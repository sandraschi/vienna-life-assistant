# AI Chatbot Documentation

**Last Updated**: 2025-12-15
**Status**: Beta Version 🚧

## 🤖 Overview

An **AI-powered conversational assistant** with 16 integrated tools, 6 personalities, streaming responses, and MCP server integration. Runs locally on RTX 4070 or better via Ollama, or use cloud providers like OpenAI.

## ✨ Features

### **Streaming Responses**
- Real-time text generation
- See responses appear character-by-character
- Low latency via Server-Sent Events (SSE)
- Smooth UX with loading indicators

### **6 AI Personalities**

1. **Professional Assistant** (Default)
   - Helpful, accurate, professional tone
   - Best for: General questions, information lookup
   - System prompt: "Provide clear, accurate, and helpful responses"

2. **Creative Writer**
   - Imaginative, poetic, expressive
   - Best for: Storytelling, creative writing, poetry
   - Uses vivid imagery and metaphors

3. **Technical Expert**
   - Precise, detailed, technical terminology
   - Best for: Programming, technical explanations
   - Includes code examples when relevant

4. **Friendly Companion**
   - Warm, casual, conversational
   - Best for: Casual chat, emotional support
   - Uses emojis appropriately 😊

5. **Concise Advisor**
   - Brief, direct, to-the-point
   - Best for: Quick answers, busy times
   - Uses bullet points, no fluff

6. **Vienna Local** 🇦🇹
   - Expert on Vienna, Austria
   - Best for: Local tips, Wiener Linien, restaurants
   - Knows Bezirke, culture, insider knowledge

### **AI Prompt Enhancement**

Uses a small model (llama3.2:3b) to refine your prompts:
- Makes vague questions clearer
- Adds relevant context
- Improves response quality
- Optional toggle in settings

Example:
```
Original:  "weather"
Enhanced:  "What is the current weather forecast for Vienna, Austria?"
```

### **Conversation Memory**

- **Save conversations** - Persistent storage in SQLite
- **Resume chats** - Pick up where you left off
- **Multiple conversations** - Organize by topic
- **Message history** - Full context across messages
- **Auto-titling** - Conversations get meaningful titles

## 🔧 Integrated Tools (16 Total)

### Core Tools (1-5)

#### 1. **Calculator** 🔢
**Trigger patterns:**
- "what is 2 + 2"
- "calculate 15 * 8"
- "compute sqrt(16)"

**Supported operations:**
- Basic: `+`, `-`, `*`, `/`
- Advanced: `**` (power), `sqrt()`, `abs()`, `round()`

**Example:**
```
User: "what is 25 * 37"
Bot: "Result: 925"
```

#### 2. **DateTime** 🕐
**Trigger patterns:**
- "what time is it"
- "current time"
- "today's date"

**Returns:** Current date and time in Vienna (CET/CEST)

#### 3. **Web Search** 🔍
**Trigger patterns:**
- "search for X"
- "look up Y"
- "find information about Z"

**Provider:** DuckDuckGo API
**Example:**
```
User: "search for Vienna weather"
Bot: Shows weather results from DuckDuckGo
```

#### 4. **Get Todos** ✅
**Trigger patterns:**
- "my todos"
- "my tasks"
- "what do i need to do"

**Returns:** Your current todo list from database

#### 5. **Get Calendar** 📅
**Trigger patterns:**
- "my calendar"
- "my schedule"
- "what's coming up"

**Returns:** Upcoming events (next 7 days)

---

### Advanced Memory MCP (6-9) 🧠

Connects to your zettelkasten knowledge base via MCP stdio transport.

#### 6. **Search Knowledge**
**Trigger patterns:**
- "search my notes for X"
- "find in notes about Y"
- "knowledge base search"

**Example:**
```
User: "search my notes for Python patterns"
Bot: Shows matching notes with previews
```

#### 7. **Read Note**
**Trigger patterns:**
- "read note Python Basics"
- "show note MCP Patterns"
- "get note about X"

**Example:**
```
User: "read note Vienna Restaurants"
Bot: Displays full note content (first 500 chars)
```

#### 8. **Create Note**
**Trigger patterns:**
- "remember this: X"
- "create note about Y"
- "save note: Z"

**Auto-saves to:** `ai-chat/` folder with `ai-generated` tag

**Example:**
```
User: "remember this: Best Schnitzel at Figlmüller in 1st district"
Bot: "Created note: 'AI Chat Note - 2025-12-04 15:30' in your knowledge base"
```

#### 9. **Recent Notes**
**Trigger patterns:**
- "recent notes"
- "latest notes"
- "what did i note recently"

**Returns:** Last 7 days of note activity

---

### Tapo MCP - Smart Home (10-13) 🏠

Connects to your smart home devices via Tapo MCP server.

#### 10. **Get Weather** 🌤️
**Trigger patterns:**
- "what's the weather"
- "weather forecast"
- "do i need an umbrella"

**Returns:** Vienna weather (temperature, conditions)

#### 11. **Control Lights** 💡
**Trigger patterns:**
- "turn on lights"
- "turn off bedroom lights"
- "lights on"

**Controls:** Philips Hue smart lights
**Actions:** on, off, dim (via brightness)

**Example:**
```
User: "turn off bedroom lights"
Bot: "Lights turned off"
```

#### 12. **List Lights**
**Trigger patterns:**
- "list lights"
- "show lights"
- "what lights are on"

**Returns:** All lights with status and brightness

#### 13. **Camera Status** 📷
**Trigger patterns:**
- "camera status"
- "show cameras"
- "security cameras"

**Returns:** All Tapo/Ring cameras and their status

#### 14. **Ring Events** 🔔
**Trigger patterns:**
- "who was at the door"
- "doorbell events"
- "ring doorbell"

**Returns:** Recent Ring doorbell motion/press events

---

### Media & Transit (15-16)

#### 15. **Wiener Linien** 🚊
**Trigger patterns:**
- "when's next U6"
- "U4 departures"
- "how do i get to Schönbrunn"

**Requires:** MyWienerLinien app running on port 3079

**Returns:** Station search, line info, departures

**Example:**
```
User: "when's the next U6 to Floridsdorf"
Bot: Shows U6 departures from nearest station
```

#### 16. **Plex/Calibre** (Future)
Ready for media recommendations and library search.

## 🎨 User Interface

### Chat Window
- **Avatar-based messages** - You (person icon) vs Bot (robot icon)
- **Timestamps** - Every message timestamped
- **Tool chips** - Visual indicators when tools are used
- **Enhancement chips** - Shows when prompts are enhanced
- **Loading states** - Spinner while AI thinks
- **Auto-scroll** - Always shows latest message

### Settings Panel
- **Personality selector** - Choose from 6 personalities
- **Model selector** - All 15 Ollama models available
- **Tool toggle** - Enable/disable tool use
- **Enhancement toggle** - Enable/disable prompt enhancement

### Conversations Panel
- **List conversations** - All saved chats
- **Create new** - Start fresh conversation
- **Load previous** - Resume old chat
- **Delete** - Archive unwanted conversations

## 🧪 Testing the Chatbot

### 1. Test Calculator Tool
```
Message: "what is 15 * 23"
Expected: Tool chip appears, shows "Result: 345", AI confirms
```

### 2. Test Web Search
```
Message: "search for Vienna Christmas markets 2025"
Expected: Tool chip, DuckDuckGo results, AI summarizes
```

### 3. Test Knowledge Base
```
Message: "search my notes for MCP"
Expected: Searches Advanced Memory, shows matching notes
```

### 4. Test Smart Home
```
Message: "what's the weather?"
Expected: Calls Tapo MCP, shows Vienna weather
```

### 5. Test Transit
```
Message: "when's next U6"
Expected: Calls MyWienerLinien API, shows departures
```

## 🔧 Technical Architecture

### Backend Flow

```
User Message
    ↓
API: /api/chat/stream (POST)
    ↓
chat_service.py
    ↓
├─ Enhance prompt? (optional)
│  └─ Uses llama3.2:3b to refine
    ↓
├─ Detect tool calls
│  └─ Pattern matching on user message
    ↓
├─ Execute tools (async)
│  ├─ Local tools (calculator, datetime)
│  ├─ Web search (DuckDuckGo)
│  ├─ Database tools (todos, calendar)
│  └─ MCP tools (Advanced Memory, Tapo, etc.)
    ↓
├─ Build context
│  └─ System prompt + history + tool results
    ↓
├─ Stream LLM response
│  └─ Ollama generate_stream()
    ↓
Server-Sent Events → Frontend
```

### Frontend Flow

```
User types message
    ↓
Send to /api/chat/stream
    ↓
Receive SSE stream
    ↓
├─ type: "enhancement" → Show chip
├─ type: "tool" → Show tool chip
├─ type: "text" → Append to message
└─ type: "done" → Save to DB
```

### MCP Integration

```
chat_service.py
    ↓
mcp_clients.py (AdvancedMemoryMCPClient, TapoMCPClient, etc.)
    ↓
FastMCP Client (stdio transport)
    ↓
MCP Server Process (spawned via subprocess)
    ↓
Tool execution → Result returned
```

## 📊 Database Schema

### `conversations` Table
```sql
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    personality TEXT DEFAULT 'assistant',
    model_name TEXT DEFAULT 'llama3.2:3b',
    message_count INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### `messages` Table
```sql
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL,  -- user, assistant, system
    content TEXT NOT NULL,
    original_prompt TEXT,    -- Before enhancement
    enhanced_prompt TEXT,    -- After enhancement
    tool_calls TEXT,         -- JSON of tool calls
    tool_results TEXT,       -- JSON of results
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP
);
```

## 🎯 Future Enhancements

### Planned Features
- [ ] Voice input/output (via Tapo audio_management)
- [ ] Multi-model comparison (ask same question to 3 models)
- [ ] Conversation export (PDF, markdown)
- [ ] Custom tool creation (user-defined)
- [ ] Advanced Memory skill activation
- [ ] Torrent search integration (Detective Conan episodes!)
- [ ] Plex "what should I watch" recommendations
- [ ] Immich "photos from today in history"

### Possible Improvements
- [ ] Tool use visualization (graph of tool calls)
- [ ] Token usage tracking and analytics
- [ ] Response quality ratings
- [ ] Custom personality creation
- [ ] Multi-turn tool use (tools calling tools)
- [ ] Conversation branching (explore alternatives)

## 🐛 Known Issues

1. **Tapo MCP**: Untested! May need OAuth setup for Nest/Ring
2. **Wiener Linien**: Requires MyWienerLinien running on port 3079
3. **Tool detection**: Pattern matching is simple, may miss complex queries
4. **MCP timeouts**: Long operations (search, note creation) may timeout

## 💡 Tips & Tricks

### Get Better Responses
- Enable "AI Prompt Enhancement" for complex questions
- Use specific personalities (Vienna Local for local questions)
- Mention tools explicitly ("use calculator to compute...")

### Tool Use
- Tools auto-detect, but you can be explicit: "search my notes for..."
- Multiple tools can trigger in one message
- Tool results are added to context before AI responds

### Performance
- Use smaller models (llama3.2:3b) for faster responses
- Disable tools if you don't need them
- Disable prompt enhancement for instant responses

### MCP Services
- MCP clients connect lazily (on first use)
- Connections are cached for performance
- Failures are graceful (returns error string, doesn't crash)

## 🎓 Learning Resources

### Understanding the Code
- `backend/services/chat_service.py` - Core chat logic, tool execution
- `backend/api/chat/routes.py` - API endpoints, streaming
- `frontend/src/features/chat/ChatBot.tsx` - React UI component
- `backend/models/conversation.py` - Database models

### Key Concepts
- **Streaming**: Using async generators and SSE
- **Tool use**: Pattern matching and async execution
- **MCP**: Stdio transport for inter-process communication
- **Context building**: System prompt + history + tool results

## 📞 Support

Issues? Check:
1. Backend logs: Terminal window or `terminals/38.txt`
2. Frontend console: F12 → Console tab
3. Database: `backend/vienna_life.db` (SQLite browser)
4. MCP health: `/api/media/health` endpoint

## 🎉 Success Stories

**What works:**
- ✅ 6 personalities load and apply correctly
- ✅ Streaming responses show in real-time
- ✅ Calculator tool auto-detects and executes
- ✅ Conversation persistence works
- ✅ Model switching works
- ✅ UI is beautiful and responsive

**What's untested:**
- ⚠️ Tapo MCP (weather, lights, cameras, Ring)
- ⚠️ Advanced Memory MCP (needs knowledge base setup)
- ⚠️ Wiener Linien (needs MyWienerLinien running)
- ⚠️ Plex/Calibre MCP (needs server setup)

---

**Built for Sandra's daily life in Vienna** 🇦🇹

*Ask it about the weather, control your lights, search your notes, or just have a friendly chat!* 💬

