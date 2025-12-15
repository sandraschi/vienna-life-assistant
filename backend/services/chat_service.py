"""
Chat service with streaming, tool use, web search, and prompt enhancement
"""
import json
import re
from datetime import datetime
from typing import AsyncGenerator, Dict, List, Optional
import httpx
from services.ollama_service import ollama_service
from services.mcp_clients import mcp_clients

# Chatbot personalities
PERSONALITIES = {
    "assistant": {
        "name": "Professional Assistant",
        "description": "Helpful, accurate, and professional",
        "system_prompt": "You are a professional AI assistant. Provide clear, accurate, and helpful responses. Be concise but thorough."
    },
    "creative": {
        "name": "Creative Writer",
        "description": "Imaginative, poetic, and expressive",
        "system_prompt": "You are a creative writer with a poetic soul. Use vivid imagery, metaphors, and engaging language. Be imaginative and expressive."
    },
    "technical": {
        "name": "Technical Expert",
        "description": "Precise, detailed, and technical",
        "system_prompt": "You are a technical expert. Provide precise, detailed explanations with code examples when relevant. Use technical terminology accurately."
    },
    "friendly": {
        "name": "Friendly Companion",
        "description": "Warm, casual, and conversational",
        "system_prompt": "You are a friendly companion. Be warm, casual, and conversational. Use emojis when appropriate. Show empathy and understanding."
    },
    "concise": {
        "name": "Concise Advisor",
        "description": "Brief, direct, and to-the-point",
        "system_prompt": "You are a concise advisor. Give brief, direct answers. No fluff. Get straight to the point. Use bullet points when appropriate."
    },
    "vienna": {
        "name": "Vienna Local",
        "description": "Expert on Vienna, Austria - culture, transport, food",
        "system_prompt": "You are a Vienna local expert. You know Vienna's culture, public transport (Wiener Linien), restaurants, districts (Bezirke), and local tips. Be friendly and share insider knowledge."
    }
}

# Available tools
TOOLS = [
    {
        "name": "calculator",
        "description": "Perform mathematical calculations. Supports +, -, *, /, **, sqrt, etc.",
        "parameters": {
            "expression": "Mathematical expression to evaluate (e.g., '2 + 2', 'sqrt(16)', '2**8')"
        }
    },
    {
        "name": "datetime",
        "description": "Get current date and time information",
        "parameters": {
            "format": "Optional format string (default: ISO format)"
        }
    },
    {
        "name": "web_search",
        "description": "Search the web using DuckDuckGo",
        "parameters": {
            "query": "Search query",
            "num_results": "Number of results (default: 5)"
        }
    },
    {
        "name": "get_todos",
        "description": "Get user's todo list",
        "parameters": {}
    },
    {
        "name": "get_calendar",
        "description": "Get user's calendar events",
        "parameters": {
            "days": "Number of days ahead to fetch (default: 7)"
        }
    },
    {
        "name": "search_knowledge",
        "description": "Search your Advanced Memory knowledge base (zettelkasten notes)",
        "parameters": {
            "query": "Search query",
            "max_results": "Number of results (default: 5)"
        }
    },
    {
        "name": "read_note",
        "description": "Read a specific note from your knowledge base",
        "parameters": {
            "identifier": "Note title or permalink"
        }
    },
    {
        "name": "create_note",
        "description": "Create a new note in your knowledge base",
        "parameters": {
            "title": "Note title",
            "content": "Note content (markdown)",
            "tags": "Tags (comma-separated, default: 'ai-generated')"
        }
    },
    {
        "name": "recent_notes",
        "description": "Get recently updated notes from your knowledge base",
        "parameters": {
            "days": "Days to look back (default: 7)"
        }
    },
    {
        "name": "get_weather",
        "description": "Get current weather in Vienna",
        "parameters": {}
    },
    {
        "name": "control_lights",
        "description": "Control Philips Hue smart lights",
        "parameters": {
            "action": "Action to perform (on, off, dim)",
            "room": "Room or light name (optional)"
        }
    },
    {
        "name": "list_lights",
        "description": "List all smart lights and their status",
        "parameters": {}
    },
    {
        "name": "camera_status",
        "description": "Get status of home security cameras",
        "parameters": {}
    },
    {
        "name": "ring_events",
        "description": "Get recent Ring doorbell events",
        "parameters": {
            "limit": "Number of events (default: 5)"
        }
    },
    {
        "name": "wiener_linien",
        "description": "Get Vienna public transport information (U-Bahn, Tram, Bus)",
        "parameters": {
            "query": "Station name or line number (e.g., 'U6', 'Floridsdorf', 'Alser Straße')"
        }
    }
]


class ChatService:
    """Chat service with AI-powered features (Beta)"""
    
    def __init__(self):
        self.personalities = PERSONALITIES
        self.tools = TOOLS
    
    async def enhance_prompt(self, user_prompt: str, model: str = "llama3.2:3b") -> str:
        """
        Use AI to enhance/refine user's prompt for better results
        """
        enhancement_prompt = f"""You are a prompt enhancement expert. The user wrote: "{user_prompt}"

Enhance this prompt to be clearer, more specific, and more likely to get a high-quality response. Keep it concise.
Only output the enhanced prompt, nothing else."""

        try:
            response = await ollama_service.generate(
                model=model,
                prompt=enhancement_prompt,
                stream=False
            )
            enhanced = response.get("response", "").strip()
            # If enhancement is too long or empty, return original
            if len(enhanced) > len(user_prompt) * 3 or not enhanced:
                return user_prompt
            return enhanced
        except Exception:
            return user_prompt
    
    async def _execute_tool(self, tool_name: str, parameters: Dict) -> str:
        """Execute a tool and return results"""
        try:
            if tool_name == "calculator":
                expr = parameters.get("expression", "")
                # Safe eval with limited scope
                import math
                safe_dict = {
                    "sqrt": math.sqrt,
                    "pow": pow,
                    "abs": abs,
                    "round": round,
                    "min": min,
                    "max": max,
                    "sum": sum,
                }
                result = eval(expr, {"__builtins__": {}}, safe_dict)
                return f"Result: {result}"
            
            elif tool_name == "datetime":
                fmt = parameters.get("format", "%Y-%m-%d %H:%M:%S")
                now = datetime.now()
                return f"Current time: {now.strftime(fmt)}"
            
            elif tool_name == "web_search":
                # Synchronous web search
                query = parameters.get("query", "")
                num_results = parameters.get("num_results", 5)
                results = self._web_search_sync(query, num_results)
                return results
            
            elif tool_name == "get_todos":
                # Mock - in real implementation, query database
                return "Todos: 1) Buy groceries 2) Walk Benny 3) Clean apartment"
            
            elif tool_name == "get_calendar":
                days = parameters.get("days", 7)
                # Mock - in real implementation, query database
                return f"Calendar (next {days} days): Dec 5 - Vet appointment (Benny), Dec 7 - Coffee with Marion"
            
            # Advanced Memory MCP tools
            elif tool_name == "search_knowledge":
                query = parameters.get("query", "")
                max_results = parameters.get("max_results", 5)
                result = await mcp_clients.advanced_memory.search_notes(query, max_results)
                if result.get("success"):
                    results_data = result.get("result", [])
                    if isinstance(results_data, list) and len(results_data) > 0:
                        notes = "\n".join([f"- {item.get('title', 'Untitled')}: {item.get('preview', '')[:100]}..." for item in results_data[:max_results]])
                        return f"Knowledge base search for '{query}':\n{notes}"
                    else:
                        return f"No notes found for: {query}"
                else:
                    return f"Search failed: {result.get('error', 'Unknown error')}"
            
            elif tool_name == "read_note":
                identifier = parameters.get("identifier", "")
                result = await mcp_clients.advanced_memory.read_note(identifier)
                if result.get("success"):
                    content = result.get("result", {})
                    if isinstance(content, dict):
                        title = content.get("title", identifier)
                        body = content.get("content", "")[:500]  # First 500 chars
                        return f"Note '{title}':\n\n{body}..."
                    else:
                        return f"Note content: {str(content)[:500]}"
                else:
                    return f"Failed to read note: {result.get('error', 'Unknown error')}"
            
            elif tool_name == "create_note":
                title = parameters.get("title", "")
                content = parameters.get("content", "")
                tags = parameters.get("tags", "ai-generated")
                result = await mcp_clients.advanced_memory.write_note(title, content, tags=tags)
                if result.get("success"):
                    return f"Created note: '{title}' in your knowledge base"
                else:
                    return f"Failed to create note: {result.get('error', 'Unknown error')}"
            
            elif tool_name == "recent_notes":
                days = parameters.get("days", 7)
                timeframe = f"{days}d"
                result = await mcp_clients.advanced_memory.recent_activity(timeframe)
                if result.get("success"):
                    activity = result.get("result", {})
                    if isinstance(activity, dict):
                        notes = activity.get("results", [])[:5]
                        note_list = "\n".join([f"- {n.get('title', 'Untitled')}" for n in notes])
                        return f"Recent notes (last {days} days):\n{note_list}"
                    else:
                        return f"Recent activity: {str(activity)[:200]}"
                else:
                    return f"Failed to get recent notes: {result.get('error', 'Unknown error')}"
            
            # Tapo MCP - Weather
            elif tool_name == "get_weather":
                result = await mcp_clients.tapo.call_tool("mcp_tapo-mcp_weather_management", action="current")
                if result.get("success"):
                    weather = result.get("result", {}).get("data", {})
                    temp = weather.get("temperature", "N/A")
                    conditions = weather.get("conditions", "N/A")
                    return f"Vienna Weather: {temp}°C, {conditions}"
                else:
                    return f"Weather unavailable: {result.get('error', 'Unknown error')}"
            
            # Tapo MCP - Smart Lights
            elif tool_name == "control_lights":
                action = parameters.get("action", "on")
                room = parameters.get("room", None)
                
                # Determine what to do
                if action.lower() in ["on", "off"]:
                    on_state = action.lower() == "on"
                    result = await mcp_clients.tapo.call_tool(
                        "mcp_tapo-mcp_lighting_management",
                        action="control_group" if room else "control_light",
                        group_id="1" if not room else room,
                        on=on_state
                    )
                    if result.get("success"):
                        return f"Lights turned {action}"
                    else:
                        return f"Failed to control lights: {result.get('error', 'Unknown error')}"
                else:
                    return "Light control: specify 'on' or 'off'"
            
            elif tool_name == "list_lights":
                result = await mcp_clients.tapo.call_tool("mcp_tapo-mcp_lighting_management", action="list_lights")
                if result.get("success"):
                    lights = result.get("result", {}).get("data", [])
                    light_list = "\n".join([f"- {l.get('name', 'Unknown')}: {'ON' if l.get('on') else 'OFF'} ({l.get('brightness', 0)}%)" for l in lights[:10]])
                    return f"Smart Lights:\n{light_list}"
                else:
                    return f"Failed to list lights: {result.get('error', 'Unknown error')}"
            
            # Tapo MCP - Cameras
            elif tool_name == "camera_status":
                result = await mcp_clients.tapo.call_tool("mcp_tapo-mcp_camera_management", action="list")
                if result.get("success"):
                    cameras = result.get("result", {}).get("data", {}).get("cameras", [])
                    cam_list = "\n".join([f"- {c.get('name', 'Unknown')}: {c.get('status', 'Unknown')}" for c in cameras[:5]])
                    return f"Security Cameras:\n{cam_list}"
                else:
                    return f"Cameras unavailable: {result.get('error', 'Unknown error')}"
            
            # Tapo MCP - Ring Doorbell
            elif tool_name == "ring_events":
                limit = parameters.get("limit", 5)
                result = await mcp_clients.tapo.call_tool(
                    "mcp_tapo-mcp_ring_management",
                    action="events",
                    limit=limit
                )
                if result.get("success"):
                    events = result.get("result", {}).get("data", [])
                    event_list = "\n".join([f"- {e.get('created_at', 'Unknown')}: {e.get('kind', 'Event')}" for e in events[:limit]])
                    return f"Ring Doorbell Events:\n{event_list}"
                else:
                    return f"Ring events unavailable: {result.get('error', 'Unknown error')}"
            
            # Wiener Linien (if available)
            elif tool_name == "wiener_linien":
                query = parameters.get("query", "")
                # Try to call Wiener Linien service
                try:
                    # Check if MyWienerLinien app is running on port 3079
                    import httpx
                    async with httpx.AsyncClient(timeout=5.0) as client:
                        # Search for station/line
                        response = await client.get(f"http://localhost:3079/api/stations/search?q={query}")
                        if response.status_code == 200:
                            data = response.json()
                            stations = data.get("stations", [])[:3]
                            if stations:
                                return f"Wiener Linien results for '{query}':\n" + "\n".join([f"- {s['name']} ({s['type']})" for s in stations])
                            else:
                                return f"No stations found for: {query}"
                        else:
                            return "Wiener Linien service not available"
                except Exception:
                    return "Wiener Linien service not running (start MyWienerLinien app on port 3079)"
            
            else:
                return f"Unknown tool: {tool_name}"
                
        except Exception as e:
            return f"Tool error: {str(e)}"
    
    def _web_search_sync(self, query: str, num_results: int = 5) -> str:
        """Synchronous web search using DuckDuckGo"""
        try:
            import httpx
            url = "https://api.duckduckgo.com/"
            params = {
                "q": query,
                "format": "json",
                "no_html": 1,
                "skip_disambig": 1
            }
            
            with httpx.Client(timeout=10.0) as client:
                response = client.get(url, params=params)
                data = response.json()
                
                results = []
                # Try AbstractText first
                if data.get("AbstractText"):
                    results.append(f"Summary: {data['AbstractText']}")
                
                # Add related topics
                for topic in data.get("RelatedTopics", [])[:num_results]:
                    if isinstance(topic, dict) and "Text" in topic:
                        results.append(f"- {topic['Text']}")
                
                if results:
                    return "Web search results:\n" + "\n".join(results)
                else:
                    return f"No results found for: {query}"
                    
        except Exception as e:
            return f"Web search error: {str(e)}"
    
    def _detect_tool_calls(self, user_message: str) -> List[Dict]:
        """Detect if user wants to use tools based on keywords"""
        tool_calls = []
        
        # Calculator patterns
        calc_pattern = r"calculate|compute|what is|how much is|\d+\s*[\+\-\*/]\s*\d+"
        if re.search(calc_pattern, user_message.lower()):
            # Extract math expression
            math_expr = re.findall(r"[\d\+\-\*/\(\)\s\.]+", user_message)
            if math_expr:
                tool_calls.append({
                    "name": "calculator",
                    "parameters": {"expression": math_expr[0].strip()}
                })
        
        # Date/time patterns
        if re.search(r"what time|current time|today's date|what day", user_message.lower()):
            tool_calls.append({
                "name": "datetime",
                "parameters": {}
            })
        
        # Web search patterns
        if re.search(r"search for|look up|find information|what's the weather|news about", user_message.lower()):
            # Extract search query (simplified)
            query = re.sub(r"(search for|look up|find information about|news about)\s+", "", user_message, flags=re.IGNORECASE)
            tool_calls.append({
                "name": "web_search",
                "parameters": {"query": query.strip(), "num_results": 5}
            })
        
        # Todo patterns
        if re.search(r"my todos|my tasks|what do i need to do", user_message.lower()):
            tool_calls.append({
                "name": "get_todos",
                "parameters": {}
            })
        
        # Calendar patterns
        if re.search(r"my calendar|my schedule|what's coming up|upcoming events", user_message.lower()):
            tool_calls.append({
                "name": "get_calendar",
                "parameters": {"days": 7}
            })
        
        # Advanced Memory - Search knowledge base
        if re.search(r"search my notes|find in notes|knowledge base|zettelkasten|search knowledge", user_message.lower()):
            # Extract search query (simplified)
            query = re.sub(r"(search my notes|find in notes|knowledge base|zettelkasten|search knowledge)\s+(for|about)?\s*", "", user_message, flags=re.IGNORECASE)
            tool_calls.append({
                "name": "search_knowledge",
                "parameters": {"query": query.strip()[:100], "max_results": 5}
            })
        
        # Advanced Memory - Read specific note
        if re.search(r"read note|show note|get note|open note", user_message.lower()):
            # Extract note identifier
            identifier = re.sub(r"(read note|show note|get note|open note)\s+", "", user_message, flags=re.IGNORECASE)
            tool_calls.append({
                "name": "read_note",
                "parameters": {"identifier": identifier.strip()[:100]}
            })
        
        # Advanced Memory - Create note
        if re.search(r"create note|save note|write note|make note|remember this", user_message.lower()):
            # Simple title/content extraction
            title = f"AI Chat Note - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            content = user_message
            tool_calls.append({
                "name": "create_note",
                "parameters": {"title": title, "content": content, "tags": "ai-chat,auto-generated"}
            })
        
        # Advanced Memory - Recent notes
        if re.search(r"recent notes|latest notes|new notes|what did i note", user_message.lower()):
            tool_calls.append({
                "name": "recent_notes",
                "parameters": {"days": 7}
            })
        
        # Weather patterns
        if re.search(r"weather|temperature|raining|forecast|umbrella|how's the weather", user_message.lower()):
            tool_calls.append({
                "name": "get_weather",
                "parameters": {}
            })
        
        # Smart lights patterns
        if re.search(r"turn on.*light|turn off.*light|lights on|lights off|dim.*light|brighten.*light", user_message.lower()):
            action = "on" if "on" in user_message.lower() else "off"
            tool_calls.append({
                "name": "control_lights",
                "parameters": {"action": action}
            })
        
        if re.search(r"list lights|show lights|what lights|which lights", user_message.lower()):
            tool_calls.append({
                "name": "list_lights",
                "parameters": {}
            })
        
        # Camera patterns
        if re.search(r"camera status|security camera|show cameras|camera list", user_message.lower()):
            tool_calls.append({
                "name": "camera_status",
                "parameters": {}
            })
        
        # Ring doorbell patterns
        if re.search(r"doorbell|ring events|who was at door|door camera|front door", user_message.lower()):
            tool_calls.append({
                "name": "ring_events",
                "parameters": {"limit": 5}
            })
        
        # Wiener Linien patterns
        if re.search(r"u-bahn|u6|u4|tram|straßenbahn|bus|öffi|wiener linien|next train|departure", user_message.lower()):
            # Extract line/station
            query = user_message
            for pattern in ["when's the next", "when is the next", "how do i get to"]:
                query = query.lower().replace(pattern, "")
            tool_calls.append({
                "name": "wiener_linien",
                "parameters": {"query": query.strip()[:50]}
            })
        
        return tool_calls
    
    async def chat_stream(
        self,
        messages: List[Dict[str, str]],
        model: str = "llama3.2:3b",
        personality: str = "assistant",
        use_tools: bool = True,
        enhance_prompts: bool = False
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat responses with tool use support
        Yields JSON strings: {"type": "text|tool|done", "content": "...", "tool": {...}}
        """
        # Add personality system prompt
        system_prompt = self.personalities.get(personality, self.personalities["assistant"])["system_prompt"]
        
        # Build context
        context_messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history
        for msg in messages[:-1]:  # All but last message
            context_messages.append(msg)
        
        # Get last user message
        last_message = messages[-1]
        user_content = last_message["content"]
        
        # Enhance prompt if requested
        if enhance_prompts and last_message["role"] == "user":
            enhanced = await self.enhance_prompt(user_content, model)
            yield json.dumps({"type": "enhancement", "original": user_content, "enhanced": enhanced}) + "\n"
            user_content = enhanced
        
        # Detect and execute tools
        tool_results = []
        if use_tools:
            tool_calls = self._detect_tool_calls(user_content)
            for tool_call in tool_calls:
                result = await self._execute_tool(tool_call["name"], tool_call["parameters"])
                tool_results.append({
                    "tool": tool_call["name"],
                    "result": result
                })
                yield json.dumps({"type": "tool", "tool": tool_call["name"], "result": result}) + "\n"
        
        # Add tool results to context
        if tool_results:
            tool_context = "\n\nTool Results:\n" + "\n".join([f"- {tr['tool']}: {tr['result']}" for tr in tool_results])
            user_content += tool_context
        
        # Add final user message
        context_messages.append({"role": "user", "content": user_content})
        
        # Build prompt
        prompt = "\n\n".join([f"{msg['role'].upper()}: {msg['content']}" for msg in context_messages])
        prompt += "\n\nASSISTANT: "
        
        # Stream response
        async for chunk in ollama_service.generate_stream(model=model, prompt=prompt):
            if chunk.get("response"):
                yield json.dumps({"type": "text", "content": chunk["response"]}) + "\n"
        
        # Done
        yield json.dumps({"type": "done"}) + "\n"
    
    def get_personalities(self) -> List[Dict]:
        """Get available personalities"""
        return [
            {
                "id": pid,
                "name": p["name"],
                "description": p["description"]
            }
            for pid, p in self.personalities.items()
        ]
    
    def get_tools(self) -> List[Dict]:
        """Get available tools"""
        return self.tools


# Global instance
chat_service = ChatService()

