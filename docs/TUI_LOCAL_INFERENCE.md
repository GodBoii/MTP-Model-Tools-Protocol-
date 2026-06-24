# TUI CLI Local Inference Guide

This guide covers using local LLM providers (Ollama, LM Studio) in the MTP TUI CLI.

## Overview

The MTP TUI CLI supports running local LLMs on your machine, providing:
- **Privacy**: Your data never leaves your machine
- **Cost**: No API fees
- **Speed**: Low latency for local models
- **Offline**: Works without internet connection

## Supported Local Providers

### Ollama
- **Default Endpoint**: `http://localhost:11434`
- **Models**: Any model pulled via `ollama pull`
- **Popular Models**: llama3.2:3b, qwen3:1.7b, mistral:7b, codellama:13b

### LM Studio
- **Default Endpoint**: `http://127.0.0.1:1234/v1`
- **Models**: Any model loaded in LM Studio desktop app
- **Popular Models**: qwen3-4b-thinking-2507, llama-3.1-8b

## Quick Start

### 1. Setup Ollama

```bash
# Install Ollama
# Visit: https://ollama.com

# Pull a model
ollama pull llama3.2:3b

# Verify
ollama list
```

### 2. Setup LM Studio

1. Download from: https://lmstudio.ai
2. Install and launch the desktop app
3. Download a model from the model browser
4. Load the model (click it in "My Models")
5. Enable local server: Developer → Local Server → Start

### 3. Use in TUI

```bash
# Start TUI
mtp tui

# Switch to Ollama
/backend ollama

# Follow the interactive setup:
# 1. Select "Local" deployment
# 2. Use default endpoint (or enter custom)
# 3. Select a model from the discovered list

# Start chatting!
> Calculate 25 * 4 + 10
```

## Interactive Setup Flow

When you run `/backend ollama` or `/backend lmstudio`, the TUI guides you through setup:

### Step 1: Deployment Type

```
┌─────────────────────────────────────────────────────────┐
│ Ollama Setup                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Deployment Type:                                        │
│   [1] Local (recommended) - Run on your machine        │
│   [2] Cloud/Remote - Connect to remote server          │
│                                                         │
│ Select deployment type (1-2):                          │
└─────────────────────────────────────────────────────────┘
```

### Step 2: Endpoint Configuration

```
Endpoint Configuration:
  Default: http://localhost:11434

Use default endpoint? (Y/n):
```

### Step 3: Model Discovery

The TUI automatically discovers available models:

```
Discovering models from ollama...

✓ Found 5 model(s)

Available Models:
────────────────────────────────────────────────────────────
  [1] llama3.2:3b        2.0GB  ← Recommended
  [2] qwen3:1.7b         1.2GB
  [3] mistral:7b         4.1GB
  [4] codellama:13b      7.4GB
  [5] deepseek-coder:6.7b 3.8GB
────────────────────────────────────────────────────────────

Select model (1-5 or model name):
```

### Step 4: Confirmation

```
✓ Configuration saved

✓ Ollama configured successfully!
  Deployment: local
  Endpoint: http://localhost:11434
  Model: llama3.2:3b
```

## Thinking Tokens & Metrics Display

The TUI provides comprehensive metrics for local inference, including thinking tokens, context window usage, and performance metrics.

### Thinking Tokens (Ollama Only)

Some Ollama models support "thinking tokens" - internal reasoning that the model generates before producing the final answer. This is particularly useful for understanding the model's reasoning process.

**Supported Models**:
- `qwen3:1.7b`, `qwen3:4b`, `qwen3:8b` - Qwen3 series
- `deepseek-r1:1.5b`, `deepseek-r1:7b`, `deepseek-r1:8b` - DeepSeek R1 series
- `llama3.2:1b`, `llama3.2:3b` - Llama 3.2 series

**Example Output**:
```
> What is 15 * 23? Think step by step.

  ctx [█░░░░░░░░░░░░░░░░░░░] 200/32,768 (0.6%)
  💭 thinking Let me calculate 15 * 23 step by step: 15 * 20 = 300, 15 * 3 = 45, 300 + 45 = 345
  tokens(in/out/total/reasoning)=120/80/200/30  llm_calls=1  duration=1.50s  speed=133.3 tokens/s

The answer is 345.
```

### Metrics Display

The TUI displays comprehensive metrics after each response:

#### Context Window Usage
```
ctx [████████████████░░░░] 32,768/131,072 (25%)
```
- **Progress bar**: Visual representation of context usage
- **Numbers**: Used tokens / Total context window
- **Percentage**: Context utilization

**Context Windows by Model**:
- Qwen3 (1.7b, 4b, 8b): 32,768 tokens
- Llama 3.2 (1b, 3b): 128,000 tokens
- Llama 3.1 (8b, 70b): 128,000 tokens
- DeepSeek R1 series: 65,536 tokens
- Mistral 7b: 32,768 tokens
- CodeLlama: 16,384 tokens

#### Token Metrics
```
tokens(in/out/total/reasoning)=150/50/200/30
```
- **input_tokens**: Prompt tokens sent to model
- **output_tokens**: Completion tokens generated
- **total_tokens**: Sum of input + output
- **reasoning_tokens**: Thinking/reasoning tokens (Ollama only)

#### Performance Metrics
```
llm_calls=1  duration=1.23s  speed=162.6 tokens/s
```
- **llm_calls**: Number of LLM API calls made
- **duration**: Total execution time in seconds
- **speed**: Tokens per second (throughput)

#### Cache Metrics (Cloud Providers)
```
cache(input/write/create/read)=100/50/25/75
```
- Only shown for providers with prompt caching (e.g., Anthropic Claude)
- **input**: Cached input tokens
- **write**: Cache write tokens
- **create**: Cache creation tokens
- **read**: Cache read tokens

### Enabling Thinking Tokens

Thinking tokens are automatically enabled for supported Ollama models. No configuration needed!

**To verify thinking token support**:
```bash
# In TUI
/backend ollama
/model qwen3:1.7b

# Ask a question that requires reasoning
> Calculate the factorial of 5. Show your thinking process.
```

**Expected behavior**:
- You'll see a `💭 thinking` line with the model's reasoning
- The `reasoning_tokens` count will be > 0
- Live thinking updates appear during generation

### Performance Comparison

**Example: Qwen3 1.7B on M1 Mac**:
```
Simple query:     150 tokens/s  (0.5s response time)
Complex reasoning: 120 tokens/s  (2.0s response time)
Code generation:   140 tokens/s  (1.5s response time)
```

**Example: Llama 3.2 3B on RTX 3090**:
```
Simple query:     200 tokens/s  (0.3s response time)
Complex reasoning: 180 tokens/s  (1.2s response time)
Code generation:   190 tokens/s  (0.8s response time)
```

### Metrics Troubleshooting

**Issue: No thinking tokens displayed**

**Check**:
1. Model supports thinking tokens (Qwen3, DeepSeek R1, Llama 3.2)
2. Ollama version is up to date: `ollama --version`
3. Model is properly loaded: `ollama ps`

**Solution**:
```bash
# Update Ollama
# Visit: https://ollama.com

# Pull a supported model
ollama pull qwen3:1.7b

# Test in TUI
/backend ollama
/model qwen3:1.7b
> Think step by step: what is 2+2?
```

**Issue: Wrong context window displayed**

**Check**:
1. Model is in the context window database
2. Model name matches expected format

**Solution**:
```bash
# Check current model
/status

# Try exact model name
/model llama3.2:3b

# Refresh models
/models refresh
```

**Issue: Speed metrics seem slow**

**Possible causes**:
1. Model too large for available RAM
2. CPU-only inference (no GPU acceleration)
3. Other applications using resources

**Solution**:
```bash
# Try a smaller model
/model qwen3:1.7b

# For Ollama: Check resource usage
ollama ps

# Close other applications
# Enable GPU acceleration (if available)
```

## Commands

### Backend Management

```bash
# List all providers
/backend

# Switch to Ollama
/backend ollama

# Switch to LM Studio
/backend lmstudio
```

### Model Management

```bash
# List all models
/models

# Refresh model list (re-discover from local server)
/models refresh

# Switch to a different model
/model llama3.2:3b

# Add a custom model
/model add ollama custom-model:latest
```

### Session Management

```bash
# Check current configuration
/status

# Start new chat
/new

# View history
/history
```

## Cloud/Remote Deployment

You can also connect to remote Ollama/LM Studio servers:

### Setup Remote Ollama

```bash
/backend ollama

# Select deployment type
[2] Cloud/Remote

# Enter server URL
Enter server URL: https://my-server.com:11434

# Enter API key (optional)
Enter API key: <press Enter to skip>

# Select model (auto-discovered or manual entry)
```

## Troubleshooting

### Ollama: Connection Refused

**Symptom**: `Cannot connect to Ollama server at http://localhost:11434`

**Solution**:
1. Check if Ollama is running: `ollama list`
2. If not running, start it (usually starts automatically)
3. Verify endpoint: `curl http://localhost:11434/api/tags`

### Ollama: No Models Found

**Symptom**: `No models found. Pull a model with: ollama pull llama3.2:3b`

**Solution**:
```bash
# Pull a model
ollama pull llama3.2:3b

# Verify
ollama list

# Refresh in TUI
/models refresh
```

### LM Studio: Server Not Running

**Symptom**: `Cannot connect to LM Studio at http://127.0.0.1:1234/v1`

**Solution**:
1. Open LM Studio desktop app
2. Go to: Developer → Local Server
3. Click "Start Server"
4. Verify: `curl http://127.0.0.1:1234/v1/models`

### LM Studio: No Models Loaded

**Symptom**: `Server running but no models loaded`

**Solution**:
1. Open LM Studio desktop app
2. Go to "My Models" tab
3. Click on a model to load it
4. Wait for loading to complete
5. Refresh in TUI: `/models refresh`

### Model Not Responding

**Symptom**: Requests hang or timeout

**Solution**:
1. Check model size vs available RAM
2. Try a smaller model (e.g., llama3.2:3b instead of llama3.2:70b)
3. Close other applications to free memory
4. For Ollama: `ollama ps` to see running models

## Performance Tips

### Model Selection

**Small Models (1-3B parameters)**:
- Fast inference (< 1 second)
- Low memory (4-8GB RAM)
- Good for: simple tasks, code completion, quick Q&A
- Examples: llama3.2:3b, qwen3:1.7b

**Medium Models (7-13B parameters)**:
- Moderate inference (1-3 seconds)
- Medium memory (8-16GB RAM)
- Good for: general tasks, coding, reasoning
- Examples: mistral:7b, codellama:13b

**Large Models (30B+ parameters)**:
- Slow inference (5-10+ seconds)
- High memory (32GB+ RAM)
- Good for: complex reasoning, research, analysis
- Examples: llama3.2:70b, qwen2.5:72b

### Optimization

**Ollama**:
```bash
# Use quantized models for faster inference
ollama pull llama3.2:3b-q4_0  # 4-bit quantization

# Check running models
ollama ps

# Stop unused models to free memory
ollama stop llama3.2:70b
```

**LM Studio**:
- Use GPU acceleration if available
- Adjust context length in model settings
- Enable prompt caching for repeated queries

## Configuration Files

### Location

TUI settings are stored in:
```
<session-db-path>/tui_provider_settings.json
```

Default: `tmp/mtp_tui_sessions/tui_provider_settings.json`

### Example Configuration

```json
{
  "providers": {
    "ollama": {
      "deployment_type": "local",
      "base_url": "http://localhost:11434",
      "api_key": null,
      "model": "llama3.2:3b",
      "models": [
        "llama3.2:3b",
        "qwen3:1.7b",
        "mistral:7b"
      ]
    },
    "lmstudio": {
      "deployment_type": "local",
      "base_url": "http://127.0.0.1:1234/v1",
      "api_key": null,
      "model": "qwen3-4b-thinking-2507",
      "models": [
        "qwen3-4b-thinking-2507",
        "llama-3.1-8b"
      ]
    }
  }
}
```

## Advanced Usage

### Custom Endpoints

```bash
# Use custom Ollama port
/backend ollama
[1] Local
Enter custom endpoint URL: http://localhost:8080
```

### Multiple Models

```bash
# Switch between models quickly
/model llama3.2:3b    # Fast, small model
/model mistral:7b     # Better quality
/model codellama:13b  # Code-specialized
```

### Hybrid Workflow

```bash
# Use local for quick tasks
/backend ollama
> Quick calculation: 25 * 4 + 10

# Switch to cloud for complex tasks
/backend openai
> Write a comprehensive analysis of...
```

## Comparison: Local vs Cloud

| Feature | Local (Ollama/LMStudio) | Cloud (OpenAI/Anthropic) |
|---------|-------------------------|--------------------------|
| **Privacy** | ✓ Complete | ✗ Data sent to provider |
| **Cost** | ✓ Free | ✗ Pay per token |
| **Speed** | ✓ Low latency | ~ Network dependent |
| **Offline** | ✓ Works offline | ✗ Requires internet |
| **Model Quality** | ~ Depends on model | ✓ State-of-the-art |
| **Setup** | ~ Requires installation | ✓ Just API key |
| **Hardware** | ~ Needs RAM/GPU | ✓ No requirements |

## Best Practices

1. **Start Small**: Begin with 3B models, upgrade if needed
2. **Monitor Resources**: Watch RAM/GPU usage
3. **Use Quantization**: Q4/Q5 models are faster with minimal quality loss
4. **Cache Models**: Keep frequently used models loaded
5. **Refresh Models**: Run `/models refresh` after pulling new models
6. **Test Locally First**: Prototype with local models, deploy with cloud
7. **Hybrid Approach**: Use local for iteration, cloud for production

## Related Documentation

- [Local Inference SDK Guide](LOCAL_INFERENCE.md)
- [TUI CLI Overview](CLI.md)
- [Provider Configuration](PROVIDERS.md)
- [Ollama Documentation](https://ollama.com/docs)
- [LM Studio Documentation](https://lmstudio.ai/docs)

## Support

For issues or questions:
- GitHub Issues: https://github.com/GodBoii/Model-Tool-protocol-/issues
- Ollama Discord: https://discord.gg/ollama
- LM Studio Discord: https://discord.gg/lmstudio
