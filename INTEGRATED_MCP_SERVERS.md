# Integrated MCP Servers

Vienna Life Assistant integrates with multiple MCP (Model Context Protocol) servers to provide a comprehensive digital ecosystem. This document explains the multi-MCP server scaffolding and the tools each server provides.

## 🏗️ Multi-MCP Server Architecture

The application uses a **modular MCP client manager** that connects to 6 specialized MCP servers:

```
Vienna Life Assistant
├── Frontend (React/TypeScript)
├── Backend (FastAPI/Python)
└── MCP Ecosystem
    ├── Advanced Memory MCP - Knowledge base & note management
    ├── Tapo MCP - Smart home control
    ├── Plex MCP - Media library access
    ├── Calibre MCP - Ebook management
    ├── Ollama MCP - Local LLM inference
    └── Immich MCP - Photo management
```

## 📚 Advanced Memory MCP

**Repository**: [sandraschi/advanced-memory-mcp](https://github.com/sandraschi/advanced-memory-mcp)

A powerful knowledge base system using the Zettelkasten method for note-taking and knowledge management.

### Tools Provided:
- **search_notes** - Full-text search across your knowledge base
- **read_note** - Retrieve specific notes by identifier
- **create_note** - Save new insights and information
- **recent_notes** - Get latest knowledge base activity

### Use Cases:
- Research organization and retrieval
- Personal knowledge management
- AI-assisted note taking
- Cross-referencing information

## 🏠 Tapo Smart Home MCP

**Repository**: [sandraschi/tapo-mcp](https://github.com/sandraschi/tapo-mcp)

Controls TP-Link Tapo smart home devices including lights, cameras, and sensors.

### Tools Provided:
- **get_weather** - Current Vienna weather conditions
- **control_lights** - Philips Hue smart lighting control
- **camera_status** - Home security camera monitoring
- **ring_events** - Ring doorbell activity feed

### Supported Devices:
- Philips Hue smart bulbs
- Tapo security cameras (C200, C210, etc.)
- Ring video doorbells
- Weather sensors

## 🎬 Plex Media MCP

**Repository**: [sandraschi/plex-mcp](https://github.com/sandraschi/plex-mcp)

Access your Plex media server library containing movies, TV shows, and music.

### Tools Provided:
- **get_continue_watching** - Resume playback items
- **get_recently_added** - Latest additions to library
- **search_media** - Find movies, shows, or music
- **get_library_stats** - Media collection statistics

### Features:
- 50,000+ anime episodes/movies
- TV series and documentaries
- Music library integration
- Playback progress tracking

## 📚 Calibre MCP

**Repository**: [sandraschi/calibre-mcp](https://github.com/sandraschi/calibre-mcp)

Manage your Calibre ebook library with 15,000+ books.

### Tools Provided:
- **get_currently_reading** - Track reading progress
- **get_recent_books** - Latest ebook additions
- **search_books** - Find books by title, author, or genre
- **get_library_stats** - Reading statistics and analytics

### Features:
- EPUB, PDF, MOBI format support
- Author and series organization
- Reading progress synchronization
- Metadata management

## 🤖 Ollama MCP

**Repository**: [sandraschi/ollama-mcp](https://github.com/sandraschi/ollama-mcp)

Local LLM inference using Ollama for privacy-focused AI.

### Tools Provided:
- **generate_text** - Text generation with various models
- **chat_completion** - Conversational AI responses
- **list_models** - Available model management
- **model_management** - Load/unload models dynamically

### Supported Models:
- llama3.2:3b (primary chat model)
- Various open-source LLMs
- Custom fine-tuned models

## 📸 Immich MCP

**Repository**: [sandraschi/immich-mcp](https://github.com/sandraschi/immich-mcp)

Photo and media management with AI-powered organization.

### Tools Provided:
- **get_recent_photos** - Latest photo uploads
- **search_photos** - Find photos by date, location, or content
- **get_today_in_history** - Photos from this date in past years
- **album_management** - Organize photos into albums

### Features:
- AI-powered photo tagging
- Facial recognition
- Geographic organization
- Timeline browsing

## 🔧 MCP Server Setup

Each MCP server runs independently and communicates via the Model Context Protocol:

### Installation:
```bash
# Clone and setup each MCP server
git clone https://github.com/sandraschi/advanced-memory-mcp.git
cd advanced-memory-mcp
pip install -r requirements.txt

# Similar setup for each MCP server
```

### Configuration:
Each server has its own configuration file and environment variables for API keys, database connections, and service endpoints.

### Health Monitoring:
The MCP client manager automatically monitors server health and handles connection failures gracefully.

## 🔗 Interoperability

The MCP servers work together seamlessly:

- **AI Chatbot** can search your knowledge base (Advanced Memory) while controlling smart lights (Tapo)
- **Calendar events** can trigger media playback (Plex) or lighting changes (Tapo)
- **Reading progress** (Calibre) integrates with knowledge notes (Advanced Memory)
- **Photo memories** (Immich) can be referenced in AI conversations

## 🚀 Development

All MCP servers follow consistent patterns:
- FastAPI-based REST APIs
- Comprehensive test coverage
- Docker containerization support
- OpenAPI documentation
- MIT licensing

## 📖 Additional Resources

- [MCP Specification](https://modelcontextprotocol.io/) - Official protocol documentation
- [sandraschi GitHub](https://github.com/sandraschi) - Complete MCP ecosystem
- [Vienna Life Assistant Docs](../docs/) - Integration guides and examples
