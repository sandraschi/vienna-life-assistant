"""
Chat service with streaming, tool use, web search, and prompt enhancement
"""
import json
import re
from datetime import datetime
from typing import AsyncGenerator, Dict, List, Optional
import httpx
from services.ollama_service import ollama_service

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
    }
]


class ChatService:
    """Chat service with SOTA features"""
    
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
    
    def _execute_tool(self, tool_name: str, parameters: Dict) -> str:
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
                result = self._execute_tool(tool_call["name"], tool_call["parameters"])
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

