# TUI Changelog - Multi-Provider Support

## Overview

The MTP TUI has been significantly enhanced to support 12 MTP providers with comprehensive management features, replacing the previous two-backend system (codex + mtp-openai).

## Latest Update: Session Management Enhancements (April 2026)

### 1. Auto-Generated Session Titles
- **Smart Title Generation**: Session titles are now automatically generated from the first user message
- **Intelligent Extraction**: Extracts first 3-4 meaningful words from user prompts
- **Clean Formatting**: Automatically removes file attachments (@file syntax) and extra whitespace
- **Fallback Handling**: Very short prompts (< 3 chars) default to "Quick chat"
- **Manual Override**: Users can still set custom labels via `/new [label]` command
- **Zero Friction**: No user action required - titles are generated automatically

**Before:**
```
6db601d1d4 (unnamed)
  codex • 3 turns • 2026-04-17 10:30:15
```

**After:**
```
6db601d1d4 How do I implement
  codex • 3 turns • 2026-04-17 10:30:15
```

### 2. Centralized Session Storage
- **Single Storage Location**: All sessions now stored in `~/.mtp/sessions/` by default
- **Cross-Project Access**: Sessions accessible from any directory
- **Persistent Storage**: Sessions survive even if project directories are deleted
- **Backward Compatible**: Old session databases can be migrated by copying to new location

**Old Behavior:**
- Each directory had its own `tmp/mtp_tui_sessions/`
- Sessions isolated per directory
- Hard to find sessions across projects

**New Behavior:**
- All sessions in `~/.mtp/sessions/`
- Centralized management
- Easy cross-project session access

### 3. Directory-Based Session Grouping
- **Smart Organization**: Sessions grouped by working directory when listed
- **Current Directory First**: Sessions from current directory shown at the top (marked with ●)
- **Other Directories**: Sessions from other directories shown below (marked with ○)
- **Visual Hierarchy**: Easy to see which sessions belong to which project
- **Scalable Display**: Shows up to 20 sessions total (8 per directory max)

**Example `/sessions` Output:**
```
Saved Sessions
──────────────────────────────────────────────────────────

● webapp (current directory)
  abc123 Fix authentication bug
    openai • 5 turns • 2026-04-17 10:30:00
  def456 Implement user login
    groq • 3 turns • 2026-04-17 11:00:00

○ api-service
  ghi789 Debug API endpoint
    claude • 7 turns • 2026-04-17 09:15:00

○ mobile-app
  jkl012 Setup push notifications
    codex • 4 turns • 2026-04-17 08:45:00
```

### 4. Implementation Details

**Code Changes:**
- `src/mtp/cli/tui.py`: Added `_generate_session_title_from_prompt()` function
- `src/mtp/cli/tui.py`: Auto-titling logic in main loop after first turn
- `src/mtp/cli/tui.py`: Rewrote `_print_saved_sessions()` with directory grouping
- `src/mtp/cli/main.py`: Changed `--session-db` default to `~/.mtp/sessions/`

**Session Metadata:**
- Session titles stored in `metadata.tui.session_label`
- Working directory stored in `metadata.tui.cwd`
- All existing metadata fields preserved

**Benefits:**
- No more cryptic "(unnamed)" sessions
- Instantly recognize session content
- See all work across projects in one place
- Current project sessions highlighted
- Zero manual effort required
- Sessions persist across directory changes

## Recent Update: TUI Stabilization & Aesthetic Refinement

### 1. Cat Engine Stabilization & Layout HUD
- **Resize Resilience**: Explicit terminal geometry tracking to clear ghosting artifacts during window resizing.
- **Scroll Protection**: Automatic cat visibility management during heavy output streaming to prevent terminal buffer "smearing".
- **Telemetry Sidebar**: Added a right-gutter HUD displaying real-time CWD, Sandbox Mode, and active attachment counts.
- **Interactive Eye Tracking**: The Cat now dynamically follows the user's input cursor laterally across the shell.

### 2. High-Performance Micro-Animations
- **Phosphor Decay**: Implemented a "CRT-style" text streamer where new chunks appear in high-brightness before stabilizing to standard text.
- **Dynamic Input Pulse**: Tactile border-flashing feedback upon prompt submission.
- **Active Tool Spinners**: Replaced static tool logs with live, non-blocking status spinners and success/error markers.
- **Animated Toast Glide**: Smooth ease-out cubic transitions for notification popups.

### 3. Personalization & Nerd Font Support
- **Command Control**: Added `/nerdfont <on|off>` and `/nf` to manage high-fidelity icon sets via local `.env` persistence.
- **Hardware Acceleration**: Automatic glyph swapping for `󰚩`, `󰈈`, ``, etc., when specialized fonts are detected or enabled.

## Major Features Added

### 1. Multi-Provider Support (12 Providers)

**Supported Providers:**
- OpenAI
- Groq
- Claude (Anthropic)
- Gemini (Google)
- OpenRouter
- Mistral
- Cohere
- SambaNova
- Cerebras
- DeepSeek
- TogetherAI
- FireworksAI

**Implementation:**
- Lazy loading architecture to avoid requiring all provider SDKs
- Provider factory pattern with dynamic imports
- Graceful fallback when SDKs are missing

### 2. Interactive Provider Setup

**Features:**
- First-time setup flow for new providers
- API key validation (detects and rejects masked keys)
- Model selection with defaults
- Warning prompts for suspicious keys

**Commands:**
- `/backend` - List all providers with status
- `/backend <provider>` - Switch to provider (triggers setup if needed)

### 3. API Key Management System

**Full CRUD Operations:**
- `/apikey` - List all API keys (masked display)
- `/apikey set <provider> <key>` - Set/update API key
- `/apikey delete <provider>` - Delete API key
- `/apikey show <provider>` - Show full API key

**Security:**
- Keys stored in `~/.mtp/settings/provider_settings.json`
- Masked display by default (`*******`)
- Validation to prevent saving truncated keys
- Warning for keys that look suspicious

### 4. Model Management

**Enhanced `/models` Command:**
- Shows models for ALL providers (not just current)
- Organized by provider
- Visual indicators for active model (●)
- Supports custom model addition

**Model Commands:**
- `/models` - Show all models across all providers
- `/model <name>` - Switch to model for current provider
- `/model add <provider> <name>` - Add custom model to any provider

**Features:**
- Global model management (not tied to active backend)
- Per-provider model lists
- Default models for each provider
- Custom model support

### 5. Comprehensive Metrics Display

**Context Window Progress Bar:**
```
ctx ▌███░░░░░░░░░░░░░░░░ 3% 7,112/240,000
```

**Features:**
- Visual progress bar with color coding
- 🟢 Green (0-60%): Plenty of context
- 🟡 Yellow (60-85%): Getting full
- 🔴 Red (85-100%): Nearly exhausted
- Default 240k token window for MTP providers

**Token Metrics:**
```
tokens(in/out/total/reasoning)=6316/796/7112/643
cache(input/write/create/read)=1280/0/0/0
llm_calls=4
duration=10.80s
speed=658.5 tokens/s
```

**Features:**
- Real-time metrics extraction from events
- Cache metrics (when applicable)
- Performance stats (duration, tokens/sec)
- Accurate token counts per LLM call

### 6. Tool Event Streaming

**Real-Time Tool Visibility:**
```
🔧 file_read: Reading configuration file
  ✓ file_read completed
🔧 python_exec: Calculating result
  ✓ python_exec completed
```

**Configuration:**
- `stream_tool_events=True` - Shows tool name and reasoning
- `stream_tool_results=False` - Hides tool outputs for cleaner display
- Events captured from `agent.run_events()` method

### 7. Enhanced Footer Toolbar

**Codex Backend:**
```
gpt-5.4-mini · reasoning medium · codex · turns 3
```

**MTP Providers:**
```
openai/gpt-oss-120b · autoresearch off · groq · turns 3
```

**Features:**
- Shows actual active model (not hardcoded)
- Autoresearch status for MTP providers
- Reasoning level for Codex
- Dynamic updates on model/backend switch

### 8. Improved Status Display

**`/status` Command Shows:**
- Session ID and label
- Current backend and model
- Autoresearch status
- API key configuration status
- Working directory
- Max rounds
- Research instructions
- Latest usage metrics

### 9. Backend Detection

**Codex Detection:**
- Automatically detects if Codex CLI is installed
- Shows "✓ Ready" or "⚠ Not installed"
- Caches detection result

**Provider Status:**
- Shows configuration status for each provider
- "✓ Ready" - API key and model configured
- "⚠ Setup needed" - Needs configuration
- Active provider marked with filled circle (●)

## Technical Improvements

### 1. Settings Management

**File:** `src/mtp/cli/tui_settings.py`

**Features:**
- Provider settings stored in JSON
- Helper functions for CRUD operations
- Default model mappings
- API key validation

### 2. Provider Factory

**File:** `src/mtp/cli/tui_provider_factory.py`

**Features:**
- Lazy loading with dynamic imports
- Graceful error handling for missing SDKs
- Provider selection with validation
- Consistent interface across providers

### 3. MTP Backend Module

**File:** `src/mtp/cli/tui_mtp_backend.py`

**Features:**
- Event-based execution with `run_events()`
- Real-time metrics extraction
- Tool event capture and formatting
- Error handling with graceful degradation

### 4. Fresh Tool Registry

**Change:** Always create fresh tool registry on agent build

**Reason:** Prevents tool contamination when toggling autoresearch

**Impact:** Ensures clean state for each agent instance

## Bug Fixes

### 1. Status Line Display
- **Issue**: Showed wrong model name after backend switch
- **Fix**: Use `_active_model_name()` to get actual model
- **Impact**: Status line now reflects correct provider and model

### 2. Prompt Box Label
- **Issue**: All MTP providers showed as `mtp:oai:xxxxxx`
- **Fix**: Use actual provider name (first 3 letters)
- **Impact**: Groq shows as `mtp:gro:xxxxxx`, etc.

### 3. Footer Toolbar
- **Issue**: Showed wrong model and reasoning for MTP providers
- **Fix**: Dynamic model lookup and conditional reasoning display
- **Impact**: Footer accurately reflects current state

### 4. Codex Detection
- **Issue**: Showed "Not installed" even when Codex was available
- **Fix**: Call `detect_codex_bin()` in `/backend` command
- **Impact**: Correct Codex status display

### 5. Tool Registry Reuse
- **Issue**: Tool registry shared by reference between agents
- **Fix**: Always create fresh registry on agent build
- **Impact**: No stale autoresearch tools

## Configuration Files

### Provider Settings
**Location:** `~/.mtp/settings/provider_settings.json`

**Structure:**
```json
{
  "providers": {
    "groq": {
      "api_key": "gsk_...",
      "model": "llama-3.3-70b-versatile",
      "models": ["custom-model-1", "custom-model-2"]
    }
  }
}
```

### Session Storage
**Location:** `~/.mtp/sessions/mtp_json_db`

**Stores:**
- Session metadata
- Backend and model preferences
- Autoresearch settings
- Conversation history

## User Experience Improvements

### 1. Interactive Setup
- Guided flow for new providers
- Clear prompts and validation
- Helpful error messages

### 2. Visual Feedback
- Progress bars for context usage
- Color-coded status indicators
- Real-time tool execution visibility

### 3. Comprehensive Help
- `/help` shows all commands
- Organized by category
- Clear usage examples

### 4. Error Handling
- Graceful degradation on errors
- Actionable error messages
- Fallback to safe defaults

## Known Issues

### 1. Autoresearch Instructions
- **Issue**: Autoresearch system instructions may be injected even when `autoresearch=False`
- **Status**: Under investigation
- **Workaround**: Verify with `/status` and toggle `/autoresearch off` if needed

### 2. Provider-Specific Quirks
- **Issue**: Some providers (e.g., OpenRouter) may return malformed events
- **Impact**: Can cause "NoneType" errors in metrics
- **Status**: Needs defensive programming in event handling

### 3. File Attachment UI
- **Issue**: Prompt shows `@file to attach` but syntax may differ for MTP providers
- **Status**: Needs backend-specific prompt text

## Migration Guide

### From Old TUI (codex + mtp-openai)

**Old:**
```bash
mtp tui --backend mtp-openai --openai-model gpt-4o
```

**New:**
```bash
mtp tui --backend openai
# Then use /model gpt-4o if needed
```

**Changes:**
- `mtp-openai` → `openai`
- `--openai-model` flag removed (use `/model` command)
- API key setup now interactive

### Command Changes

**Old:**
- `/backend codex|mtp-openai`

**New:**
- `/backend` - List all providers
- `/backend <provider>` - Switch to any of 12 providers

**New Commands:**
- `/apikey` - Manage API keys
- `/model add <provider> <name>` - Add custom models

## Future Enhancements

### Planned
1. Markdown rendering for responses
2. Better error messages for provider-specific issues
3. Model-specific context window detection
4. Rate limit display for all providers
5. Provider-specific configuration options

### Under Consideration
1. Multi-provider comparison mode
2. Cost tracking across providers
3. Provider performance benchmarking
4. Custom provider plugins

## Documentation Updates

### Updated Files
- `docs/CLI.md` - Complete TUI section rewrite
- `docs/TUI_CHANGELOG.md` - This file

### Sections Updated
- Backend list (12 providers)
- Command reference (new commands)
- Usage examples (multi-provider)
- Metrics display (comprehensive)
- Footer toolbar (dynamic)

## Credits

This major enhancement was developed through iterative improvements based on user feedback and testing across multiple providers.

**Key Contributors:**
- Multi-provider architecture
- API key management system
- Metrics extraction and display
- Tool event streaming
- Documentation updates
