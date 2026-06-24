# MTP Native Tool Call Syntax

This document defines the tool-calling contract that MTP actually accepts and executes.

## The Important Mental Model

MTP does not expect the model to print a JSON execution plan into assistant text.

MTP expects the model to use the provider's native function-calling channel:

1. MTP sends tool schemas to the model provider.
2. The model returns native `tool_calls`.
3. MTP parses those calls into its internal execution graph.
4. MTP executes the graph in parallel or sequential order depending on dependencies.
5. MTP sends tool results back as `role: "tool"` messages.
6. The model produces the final answer.

The internal `ExecutionPlan` is runtime machinery. The model should focus on producing correct native tool calls.

## What The Model Should Emit

For OpenAI-compatible providers such as Xiaomi, OpenAI, Groq-compatible adapters, Together, Cerebras, and similar APIs, the accepted shape is:

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_1",
            "type": "function",
            "function": {
              "name": "calculator.add",
              "arguments": "{\"a\":15,\"b\":27}"
            }
          }
        ]
      }
    }
  ]
}
```

Notes:

- `tool_calls` is the native channel.
- `function.arguments` is a JSON string at the provider boundary.
- MTP parses that string before validating and executing the tool.

## One Native Response Can Contain Many Tool Calls

This is the key MTP behavior to optimize for.

If the tool calls are independent, return them together in one native `tool_calls` response. MTP will run them in parallel.

Example:

```json
{
  "tool_calls": [
    {
      "id": "call_1",
      "type": "function",
      "function": {
        "name": "calculator.add",
        "arguments": "{\"a\":15,\"b\":27}"
      }
    },
    {
      "id": "call_2",
      "type": "function",
      "function": {
        "name": "file.read_file",
        "arguments": "{\"path\":\"notes.txt\"}"
      }
    }
  ]
}
```

`calculator.add` and `file.read_file` do not depend on each other, so MTP derives a single parallel batch.

## Sequential Dependencies In The Same Native Response

MTP also supports dependency chains inside one native `tool_calls` response.

If a later call depends on the result of an earlier call, reference it with `{"$ref":"<call_id>"}` inside the arguments.

Example:

```json
{
  "tool_calls": [
    {
      "id": "call_1",
      "type": "function",
      "function": {
        "name": "calculator.subtract",
        "arguments": "{\"a\":18,\"b\":6}"
      }
    },
    {
      "id": "call_2",
      "type": "function",
      "function": {
        "name": "calculator.multiply",
        "arguments": "{\"a\":4,\"b\":{\"$ref\":\"call_1\"}}"
      }
    },
    {
      "id": "call_3",
      "type": "function",
      "function": {
        "name": "calculator.divide",
        "arguments": "{\"a\":{\"$ref\":\"call_2\"},\"b\":3}"
      }
    },
    {
      "id": "call_4",
      "type": "function",
      "function": {
        "name": "calculator.add",
        "arguments": "{\"a\":15,\"b\":{\"$ref\":\"call_3\"}}"
      }
    }
  ]
}
```

Even though all four calls arrive in one native response, MTP derives the dependency graph:

- `call_1` first
- then `call_2`
- then `call_3`
- then `call_4`

This is how MTP supports sequential execution without forcing the model to wait for a later planning round.

## How `$ref` Works

`$ref` points to a prior tool call ID from the same native response or an earlier executed call already present in history.

Example:

```json
{"a":{"$ref":"call_1"}}
```

During execution, MTP replaces that object with the actual tool result value from `call_1`.

Rules:

- Only reference calls that appear earlier in the same response or already exist in prior history.
- Do not guess intermediate values if they should come from a tool.
- If a value comes from a prior tool result, prefer `$ref` over hardcoding.

## Argument Rules

Arguments must match the tool schema.

Correct:

```json
{"a":15,"b":6,"ok":true}
```

Wrong:

```json
{"a":"15","b":"6","ok":"true"}
```

Additional rules:

- Use JSON numbers for numeric fields.
- Use JSON booleans for boolean fields.
- Use arrays and objects as real JSON values, not quoted JSON strings.
- Keep paths relative unless a tool explicitly accepts absolute paths.
- The optional `reasoning` argument, when present in a tool schema, should only be a short public summary of why that tool is being used.

## What The Model Should Not Do

Do not print a plan like this in assistant text:

```json
{
  "batches": [
    {
      "mode": "parallel",
      "calls": [
        {"id":"call_1","name":"calculator.add","arguments":{"a":15,"b":27}}
      ]
    }
  ]
}
```

That is documentation format, not executable output.

Do not emit XML-style inline tool tags.

Do not describe a tool plan in prose when the provider already supports native tool calling.

## Streaming

When streaming is enabled, providers may send tool calls incrementally. For example:

```json
{"choices":[{"delta":{"tool_calls":[{"index":0,"id":"call_1","function":{"name":"calculator.add","arguments":""}}]}}]}
{"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":"{\"a\":15,"}}]}}]}
{"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":"\"b\":27}"}}]}}]}
```

MTP accumulates those fragments by `index`, reconstructs the full call, and then executes it normally.

## Runtime Result Flow

After execution, MTP sends results back as tool messages:

```json
{
  "role": "tool",
  "tool_call_id": "call_1",
  "content": "42"
}
```

The model should then produce a final answer grounded in those tool outputs.

## Summary

- MTP accepts native provider tool calls.
- One native `tool_calls` response can contain multiple independent calls.
- One native `tool_calls` response can also contain a dependency chain using `$ref`.
- MTP derives parallel and sequential execution automatically from the dependency structure.
- Printed JSON plans are documentation only, not executable model output.
