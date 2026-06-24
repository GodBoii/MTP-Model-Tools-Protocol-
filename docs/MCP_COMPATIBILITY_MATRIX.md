# MCP Compatibility Matrix

- Generated: `2026-04-06T12:11:59.324235+00:00`
- Profile: `all`
- Server feature set: `resumable`

| Client | Version | Transport | Scenario | Result | Severity | Triage |
|---|---|---|---|---|---|---|
| direct-jsonrpc | v1 | direct | initialize_lifecycle | PASS | critical | - |
| direct-jsonrpc | v1 | direct | tools_list_call | PASS | critical | - |
| direct-jsonrpc | v1 | direct | resources_prompts | PASS | major | - |
| direct-jsonrpc | v1 | direct | cancellation_progress | PASS | major | - |
| direct-jsonrpc | v1 | direct | auth_challenge | PASS | critical | - |
| http-jsonrpc | v1 | http | initialize_lifecycle | PASS | critical | - |
| http-jsonrpc | v1 | http | tools_list_call | PASS | critical | - |
| http-jsonrpc | v1 | http | resources_prompts | PASS | major | - |
| http-jsonrpc | v1 | http | cancellation_progress | PASS | major | - |
| http-jsonrpc | v1 | http | auth_challenge | PASS | critical | - |
