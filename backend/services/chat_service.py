"""
Chat service with streaming, tool use, web search, and prompt enhancement
"""
import json
import re
from datetime import datetime
from typing import Any, AsyncGenerator, Dict, List, Optional
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
        "name": "edit_note",
        "description": "Edit an existing note in your knowledge base",
        "parameters": {
            "identifier": "Note title or permalink",
            "content": "New content to replace existing content",
            "append": "Whether to append content instead of replacing (default: false)"
        }
    },
    {
        "name": "link_notes",
        "description": "Create semantic links between notes in your zettelkasten",
        "parameters": {
            "source_note": "Source note title",
            "target_note": "Target note title",
            "relationship": "Relationship type (related, references, contradicts, etc.)"
        }
    },
    {
        "name": "create_daily_note",
        "description": "Create a daily journal note with today's date",
        "parameters": {
            "content": "Journal content for today",
            "tags": "Tags (default: 'daily,journal')"
        }
    },
    {
        "name": "search_by_tag",
        "description": "Search notes by tags in your knowledge base",
        "parameters": {
            "tag": "Tag to search for",
            "max_results": "Number of results (default: 10)"
        }
    },
    {
        "name": "create_project",
        "description": "Create a new project in your knowledge management system",
        "parameters": {
            "name": "Project name",
            "description": "Project description",
            "tags": "Project tags (comma-separated)"
        }
    },
    {
        "name": "list_projects",
        "description": "List all your knowledge management projects",
        "parameters": {}
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
    },
    # Japanese Language Learning Tools
    {
        "name": "practice_kanji",
        "description": "Practice Japanese kanji with reading, meaning, and stroke order",
        "parameters": {
            "level": "JLPT level (N5, N4, N3, N2, N1) or 'random'",
            "count": "Number of kanji to practice (default: 5)"
        }
    },
    {
        "name": "learn_vocabulary",
        "description": "Learn Japanese vocabulary with audio and examples",
        "parameters": {
            "topic": "Vocabulary topic (greetings, food, travel, business, etc.)",
            "level": "Difficulty level (beginner, intermediate, advanced)"
        }
    },
    {
        "name": "jlpt_practice",
        "description": "Practice JLPT-style questions for grammar and vocabulary",
        "parameters": {
            "level": "JLPT level (N5, N4, N3, N2, N1)",
            "section": "Test section (vocabulary, grammar, reading, listening)"
        }
    },
    {
        "name": "translate_japanese",
        "description": "Translate between Japanese and English with furigana",
        "parameters": {
            "text": "Text to translate",
            "direction": "Translation direction (ja_to_en, en_to_ja)",
            "include_furigana": "Include furigana for kanji (default: true)"
        }
    },
    {
        "name": "japanese_conversation",
        "description": "Practice Japanese conversation with AI partner",
        "parameters": {
            "scenario": "Conversation scenario (restaurant, shopping, travel, business)",
            "difficulty": "Difficulty level (beginner, intermediate, advanced)"
        }
    },
    # Games & Entertainment Tools
    {
        "name": "play_chess",
        "description": "Play correspondence chess - make moves and get AI analysis",
        "parameters": {
            "move": "Chess move in algebraic notation (e.g., 'e2e4', 'Nf3')",
            "game_id": "Game identifier (default: 'correspondence_1')",
            "fen": "Current board position in FEN notation (optional)"
        }
    },
    {
        "name": "analyze_chess_position",
        "description": "Get detailed analysis of a chess position",
        "parameters": {
            "fen": "Board position in FEN notation",
            "depth": "Analysis depth (default: 15)"
        }
    },
    {
        "name": "play_go",
        "description": "Play correspondence Go with AI analysis",
        "parameters": {
            "move": "Go move (e.g., 'A1', 'K10', 'pass')",
            "game_id": "Game identifier (default: 'go_1')"
        }
    },
    {
        "name": "chess_openings",
        "description": "Learn and explore chess openings",
        "parameters": {
            "opening": "Opening name or ECO code",
            "color": "Color to play as (white/black)"
        }
    },
    {
        "name": "word_games",
        "description": "Play word games like Scrabble or crossword puzzles",
        "parameters": {
            "game": "Game type (scrabble, crossword, wordle)",
            "difficulty": "Difficulty level (easy, medium, hard)"
        }
    },
    # Vienna Life Management Tools
    {
        "name": "vienna_events",
        "description": "Find cultural events, concerts, and exhibitions in Vienna",
        "parameters": {
            "type": "Event type (concert, theater, museum, festival)",
            "date": "Date to search (today, tomorrow, weekend, or YYYY-MM-DD)",
            "district": "Vienna district number (1-23)"
        }
    },
    {
        "name": "vienna_services",
        "description": "Find local Vienna services (doctors, post office, government offices)",
        "parameters": {
            "service": "Service type (doctor, pharmacy, post, government, bank)",
            "district": "Vienna district number (1-23, default: 9 for Alsergrund)"
        }
    },
    {
        "name": "vienna_restaurants",
        "description": "Find restaurants and cafes in Vienna with reviews",
        "parameters": {
            "cuisine": "Type of cuisine (austrian, italian, asian, vegetarian)",
            "district": "Vienna district number (1-23)",
            "price_range": "Price range (€, €€, €€€)"
        }
    },
    {
        "name": "vienna_weather",
        "description": "Get detailed Vienna weather with Austrian-specific information",
        "parameters": {
            "forecast": "Type of forecast (current, hourly, daily)"
        }
    },
    {
        "name": "vienna_transport",
        "description": "Get detailed Wiener Linien transport information",
        "parameters": {
            "from_station": "Starting station",
            "to_station": "Destination station",
            "time": "Departure time (HH:MM format, default: now)"
        }
    },
    # Recipe & Meal Planning Tools
    {
        "name": "recipe_search",
        "description": "Find recipes based on ingredients, cuisine, or dietary preferences",
        "parameters": {
            "ingredients": "Available ingredients (comma-separated)",
            "cuisine": "Type of cuisine (italian, asian, austrian, vegetarian)",
            "dietary": "Dietary restrictions (vegetarian, vegan, gluten-free, keto)",
            "time": "Available cooking time in minutes"
        }
    },
    {
        "name": "meal_plan",
        "description": "Create a weekly meal plan with shopping list",
        "parameters": {
            "days": "Number of days to plan (default: 7)",
            "preferences": "Meal preferences (quick, healthy, budget, fancy)",
            "dietary": "Dietary restrictions or preferences"
        }
    },
    {
        "name": "cooking_tips",
        "description": "Get cooking techniques and ingredient substitution advice",
        "parameters": {
            "technique": "Cooking technique (grilling, baking, stir-fry)",
            "ingredient": "Ingredient to substitute or get tips about"
        }
    },
    # Fitness & Health Tools
    {
        "name": "workout_plan",
        "description": "Create personalized workout plans and exercise routines",
        "parameters": {
            "goal": "Fitness goal (weight_loss, muscle_gain, endurance, flexibility)",
            "level": "Current fitness level (beginner, intermediate, advanced)",
            "equipment": "Available equipment (none, home, gym)",
            "time": "Available time per session in minutes"
        }
    },
    {
        "name": "health_tracker",
        "description": "Track health metrics and get wellness advice",
        "parameters": {
            "metric": "What to track (weight, sleep, steps, water, mood)",
            "goal": "Target goal or current value",
            "advice": "Request specific health advice"
        }
    },
    {
        "name": "vienna_fitness",
        "description": "Find gyms, parks, and outdoor fitness spots in Vienna",
        "parameters": {
            "activity": "Type of fitness activity (gym, running, yoga, swimming)",
            "district": "Vienna district number (1-23, default: 9)"
        }
    },
    # Budget & Finance Tools
    {
        "name": "budget_planner",
        "description": "Create and manage personal budgets with expense tracking",
        "parameters": {
            "income": "Monthly income in euros",
            "expenses": "Monthly expenses by category (comma-separated)",
            "goals": "Savings goals or financial targets"
        }
    },
    {
        "name": "expense_analyzer",
        "description": "Analyze spending patterns and provide saving recommendations",
        "parameters": {
            "period": "Time period to analyze (month, quarter, year)",
            "category": "Expense category to focus on",
            "trends": "Look for spending trends and patterns"
        }
    },
    {
        "name": "austrian_finance",
        "description": "Get Austrian-specific financial advice and information",
        "parameters": {
            "topic": "Finance topic (taxes, banking, investments, insurance)",
            "context": "Personal situation or question"
        }
    },
    # Learning & Skill Development Tools
    {
        "name": "learning_plan",
        "description": "Create structured learning plans for new skills or subjects",
        "parameters": {
            "skill": "Skill or subject to learn",
            "level": "Current level (beginner, intermediate, advanced)",
            "time_commitment": "Hours per week available for learning",
            "duration": "Total duration in weeks"
        }
    },
    {
        "name": "progress_tracker",
        "description": "Track learning progress and skill development",
        "parameters": {
            "skill": "Skill being tracked",
            "milestone": "Recent achievement or milestone",
            "assessment": "Self-assessment of current level"
        }
    },
    {
        "name": "study_techniques",
        "description": "Get effective study and learning techniques",
        "parameters": {
            "subject": "Subject or skill area",
            "learning_style": "Preferred learning style (visual, auditory, kinesthetic)",
            "challenge": "Specific learning challenge to address"
        }
    }
]


class ChatService:
    """Chat service with AI-powered features (Beta)"""
    
    def __init__(self):
        self.personalities = PERSONALITIES
        self.tools = TOOLS
    
    async def enhance_prompt(self, user_prompt: str, model: str = "llama3.2:3b", llm_provider: str = "ollama") -> str:
        """
        Enhanced prompt optimization inspired by Promptomatix framework.
        Uses intent analysis, strategy selection, and cost-aware optimization.

        Promptomatix features implemented:
        - Intent analysis for user queries
        - Strategy selection (instructional, few-shot, chain-of-thought)
        - Cost-aware optimization for cloud LLMs (OpenAI, Anthropic)
        - Modular design with extensible strategies
        """
        # Step 1: Analyze user intent (inspired by Promptomatix)
        intent_analysis = await self._analyze_intent(user_prompt, model)

        # Step 2: Select optimal prompting strategy (cost-aware)
        strategy = self._select_prompting_strategy(intent_analysis, user_prompt, llm_provider)

        # Step 3: Generate enhanced prompt using selected strategy
        if strategy == "instructional":
            enhancement_prompt = self._create_instructional_enhancement(user_prompt, intent_analysis)
        elif strategy == "few_shot":
            enhancement_prompt = self._create_few_shot_enhancement(user_prompt, intent_analysis)
        elif strategy == "chain_of_thought":
            enhancement_prompt = self._create_cot_enhancement(user_prompt, intent_analysis)
        else:
            # Fallback to original method
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

    async def _analyze_intent(self, user_prompt: str, model: str) -> Dict[str, Any]:
        """
        Analyze user intent using Promptomatix-inspired approach.
        Returns intent classification and context.
        """
        intent_prompt = f"""Analyze this user query and classify its intent:

Query: "{user_prompt}"

Classify into one of these categories:
- QUESTION: Asking for information or explanation
- INSTRUCTION: Requesting the AI to perform a task
- CREATIVE: Requesting creative content (stories, poems, designs)
- ANALYSIS: Requesting analysis or evaluation
- CONVERSATION: Casual chat or opinion
- TECHNICAL: Programming, technical, or specialized knowledge

Also identify:
- Topic domain (e.g., technology, history, science, daily life)
- Complexity level (simple, moderate, complex)
- Required expertise level (basic, intermediate, expert)

Output in JSON format:
{{"intent": "CATEGORY", "domain": "TOPIC", "complexity": "LEVEL", "expertise": "LEVEL"}}"""

        try:
            response = await ollama_service.generate(
                model=model,
                prompt=intent_prompt,
                stream=False
            )
            response_text = response.get("response", "").strip()

            # Try to parse JSON
            try:
                import json
                intent_data = json.loads(response_text)
                return intent_data
            except:
                # Fallback to basic analysis
                return {
                    "intent": "QUESTION" if "?" in user_prompt else "INSTRUCTION",
                    "domain": "general",
                    "complexity": "moderate",
                    "expertise": "basic"
                }
        except:
            return {
                "intent": "QUESTION" if "?" in user_prompt else "INSTRUCTION",
                "domain": "general",
                "complexity": "moderate",
                "expertise": "basic"
            }

    def _select_prompting_strategy(self, intent_analysis: Dict[str, Any], user_prompt: str, llm_provider: str = "ollama") -> str:
        """
        Select optimal prompting strategy based on intent analysis and cost considerations.
        Inspired by Promptomatix cost-aware optimization.
        """
        intent = intent_analysis.get("intent", "INSTRUCTION")
        complexity = intent_analysis.get("complexity", "moderate")
        domain = intent_analysis.get("domain", "general")

        # Cost-aware strategy selection (Promptomatix-inspired)
        # Cloud LLMs (OpenAI, Anthropic) are more expensive, so prefer efficient strategies
        is_cloud_llm = llm_provider in ["openai", "anthropic"]

        if is_cloud_llm:
            # For expensive cloud LLMs, prefer shorter, more direct strategies
            if intent in ["QUESTION", "TECHNICAL"] and complexity == "complex":
                return "instructional"  # Skip expensive CoT for cloud LLMs
            elif intent == "CREATIVE":
                return "instructional"  # Direct creative prompts are more cost-effective
            else:
                return "instructional"  # Default to most efficient strategy
        else:
            # For local LLMs (Ollama), we can afford more sophisticated strategies
            if intent in ["QUESTION", "TECHNICAL"] and complexity == "complex":
                return "chain_of_thought"
            elif intent == "CREATIVE" or domain in ["writing", "art"]:
                return "few_shot"
            elif intent == "INSTRUCTION" and len(user_prompt.split()) < 20:
                return "instructional"
            else:
                return "instructional"  # Default strategy

    def _create_instructional_enhancement(self, user_prompt: str, intent_analysis: Dict[str, Any]) -> str:
        """Create instructional enhancement prompt."""
        domain = intent_analysis.get("domain", "general")
        expertise = intent_analysis.get("expertise", "basic")

        return f"""You are an expert prompt engineer specializing in {domain} with {expertise} level knowledge.

User's original prompt: "{user_prompt}"

Create an enhanced version that:
1. Is clear and specific about the desired outcome
2. Includes relevant context and constraints
3. Specifies the desired format or structure
4. Uses appropriate technical terminology for the domain

Enhanced prompt:"""

    def _create_few_shot_enhancement(self, user_prompt: str, intent_analysis: Dict[str, Any]) -> str:
        """Create few-shot enhancement prompt."""
        domain = intent_analysis.get("domain", "general")

        return f"""You are a creative prompt optimization expert for {domain} tasks.

User's original prompt: "{user_prompt}"

Enhance this prompt by adding specific examples, formatting guidance, and creative constraints that would produce better results.

Include in the enhancement:
- Specific style or tone examples
- Format specifications
- Quality criteria
- Creative constraints or themes

Enhanced prompt:"""

    def _create_cot_enhancement(self, user_prompt: str, intent_analysis: Dict[str, Any]) -> str:
        """Create chain-of-thought enhancement prompt."""
        domain = intent_analysis.get("domain", "general")

        return f"""You are a prompt engineering expert for complex {domain} reasoning tasks.

User's original prompt: "{user_prompt}"

For complex analytical or reasoning tasks, enhance the prompt to:
1. Break down the problem into steps
2. Request step-by-step reasoning
3. Specify intermediate outputs or checkpoints
4. Include verification or validation steps
5. Request justification for conclusions

Enhanced prompt that encourages systematic reasoning:"""
    
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
            
            # Advanced Knowledge Management Tools
            elif tool_name == "edit_note":
                identifier = parameters.get("identifier")
                content = parameters.get("content")
                append = parameters.get("append", False)

                if not identifier or not content:
                    return "Error: Both 'identifier' and 'content' parameters are required"

                if append:
                    # First read the current content
                    read_result = await mcp_clients.advanced_memory.read_note(identifier)
                    if read_result.get("success"):
                        current_content = read_result.get("result", {}).get("content", "")
                        content = current_content + "\n\n" + content
                    else:
                        return f"Failed to read note for appending: {read_result.get('error')}"

                result = await mcp_clients.advanced_memory.call_tool(
                    "edit_note",
                    identifier=identifier,
                    content=content
                )
                if result.get("success"):
                    action = "appended to" if append else "updated"
                    return f"Successfully {action} note '{identifier}'"
                else:
                    return f"Failed to edit note: {result.get('error')}"

            elif tool_name == "link_notes":
                source_note = parameters.get("source_note")
                target_note = parameters.get("target_note")
                relationship = parameters.get("relationship", "related")

                if not source_note or not target_note:
                    return "Error: Both 'source_note' and 'target_note' parameters are required"

                result = await mcp_clients.advanced_memory.call_tool(
                    "build_context",
                    operation="link",
                    source=source_note,
                    target=target_note,
                    relationship=relationship
                )
                if result.get("success"):
                    return f"Successfully linked '{source_note}' to '{target_note}' (relationship: {relationship})"
                else:
                    return f"Failed to link notes: {result.get('error')}"

            elif tool_name == "create_daily_note":
                content = parameters.get("content", "")
                tags = parameters.get("tags", "daily,journal")

                from datetime import datetime
                today = datetime.now().strftime("%Y-%m-%d")
                title = f"Daily Journal - {today}"

                result = await mcp_clients.advanced_memory.write_note(
                    title=title,
                    content=content,
                    folder="journal",
                    tags=tags
                )
                if result.get("success"):
                    return f"Created daily journal note: {title}"
                else:
                    return f"Failed to create daily note: {result.get('error')}"

            elif tool_name == "search_by_tag":
                tag = parameters.get("tag")
                max_results = parameters.get("max_results", 10)

                if not tag:
                    return "Error: 'tag' parameter is required"

                result = await mcp_clients.advanced_memory.call_tool(
                    "search_notes",
                    query=f"tag:{tag}",
                    results_per_page=max_results
                )
                if result.get("success"):
                    notes = result.get("result", {}).get("results", [])
                    if notes:
                        note_list = "\n".join([f"- {n.get('title', 'Untitled')}" for n in notes[:max_results]])
                        return f"Notes tagged '{tag}':\n{note_list}"
                    else:
                        return f"No notes found with tag '{tag}'"
                else:
                    return f"Failed to search by tag: {result.get('error')}"

            elif tool_name == "create_project":
                name = parameters.get("name")
                description = parameters.get("description", "")
                tags = parameters.get("tags", "project")

                if not name:
                    return "Error: 'name' parameter is required"

                result = await mcp_clients.advanced_memory.call_tool(
                    "create_memory_project",
                    name=name,
                    description=description,
                    tags=tags
                )
                if result.get("success"):
                    return f"Created project: {name}"
                else:
                    return f"Failed to create project: {result.get('error')}"

            elif tool_name == "list_projects":
                result = await mcp_clients.advanced_memory.call_tool(
                    "list_memory_projects"
                )
                if result.get("success"):
                    projects = result.get("result", [])
                    if projects:
                        project_list = "\n".join([f"- {p.get('name', 'Unnamed')}: {p.get('description', '')}" for p in projects])
                        return f"Your projects:\n{project_list}"
                    else:
                        return "No projects found"
                else:
                    return f"Failed to list projects: {result.get('error')}"

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
            
            # Japanese Language Learning Tools
            elif tool_name == "practice_kanji":
                level = parameters.get("level", "random")
                count = parameters.get("count", 5)

                # Generate kanji practice using AI
                prompt = f"""Generate {count} Japanese kanji for JLPT {level} level practice.
For each kanji, provide:
1. The kanji character
2. On-yomi and kun-yomi readings
3. English meaning
4. JLPT level
5. Example word with reading and meaning

Format as a numbered list with clear sections."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Kanji Practice ({level.upper()} level):\n\n{response['result']}"
                else:
                    return "Failed to generate kanji practice"

            elif tool_name == "learn_vocabulary":
                topic = parameters.get("topic", "general")
                level = parameters.get("level", "beginner")

                prompt = f"""Create a Japanese vocabulary learning session for topic: {topic}
Difficulty level: {level}

Provide:
1. 10 vocabulary words with hiragana/kanji, romaji, and English
2. Example sentences for each word
3. Memory tips or mnemonics
4. Related words or expressions

Format as an organized study guide."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Japanese Vocabulary ({topic} - {level}):\n\n{response['result']}"
                else:
                    return "Failed to generate vocabulary lesson"

            elif tool_name == "jlpt_practice":
                jlpt_level = parameters.get("level", "N5")
                section = parameters.get("section", "vocabulary")

                prompt = f"""Create JLPT {jlpt_level} practice questions for {section} section.
Provide:
1. 5 multiple-choice questions (A, B, C, D options)
2. Correct answers with explanations
3. Grammar points or vocabulary notes

Make it authentic to JLPT testing style."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"JLPT {jlpt_level} {section.title()} Practice:\n\n{response['result']}"
                else:
                    return "Failed to generate JLPT practice"

            elif tool_name == "translate_japanese":
                text = parameters.get("text", "")
                direction = parameters.get("direction", "ja_to_en")
                include_furigana = parameters.get("include_furigana", True)

                if not text:
                    return "Error: 'text' parameter is required"

                furigana_note = " (with furigana)" if include_furigana else ""
                prompt = f"""Translate the following text {direction.replace('_', ' to ')}{furigana_note}:

"{text}"

Provide:
1. Original text
2. Transliteration (romaji if Japanese)
3. Translation
4. Cultural notes or context if relevant"""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Translation ({direction}{furigana_note}):\n\n{response['result']}"
                else:
                    return "Failed to translate text"

            elif tool_name == "japanese_conversation":
                scenario = parameters.get("scenario", "casual")
                difficulty = parameters.get("difficulty", "beginner")

                prompt = f"""Create a Japanese conversation practice scenario.
Scenario: {scenario}
Difficulty: {difficulty}

Provide:
1. Situation description in English
2. Sample dialogue (Japanese with furigana + English translation)
3. Key vocabulary for the scenario
4. Practice tips for this difficulty level
5. Common mistakes to avoid

Make it practical and useful for learning."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Japanese Conversation Practice ({scenario} - {difficulty}):\n\n{response['result']}"
                else:
                    return "Failed to generate conversation practice"

            # Games & Entertainment Tools
            elif tool_name == "play_chess":
                move = parameters.get("move")
                game_id = parameters.get("game_id", "correspondence_1")
                fen = parameters.get("fen")

                if not move:
                    return "Error: 'move' parameter is required (e.g., 'e2e4', 'Nf3')"

                result = await mcp_clients.games.make_chess_move(game_id, move, fen)
                if result.get("success"):
                    game_data = result.get("result", {})
                    return f"Chess Move Recorded ({game_id}):\nMove: {move}\nPosition: {game_data.get('fen', 'Unknown')}\nAI Analysis: {game_data.get('analysis', 'Pending')}"
                else:
                    return f"Failed to make chess move: {result.get('error')}"

            elif tool_name == "analyze_chess_position":
                fen = parameters.get("fen")
                depth = parameters.get("depth", 15)

                if not fen:
                    return "Error: 'fen' parameter is required (FEN notation of board position)"

                result = await mcp_clients.games.analyze_position("chess", fen, depth)
                if result.get("success"):
                    analysis = result.get("result", {})
                    return f"Chess Position Analysis:\nFEN: {fen}\nBest Move: {analysis.get('best_move', 'Unknown')}\nEvaluation: {analysis.get('score', 'Unknown')}\nDepth: {depth}"
                else:
                    return f"Failed to analyze position: {result.get('error')}"

            elif tool_name == "play_go":
                move = parameters.get("move")
                game_id = parameters.get("game_id", "go_1")

                if not move:
                    return "Error: 'move' parameter is required (e.g., 'A1', 'K10', 'pass')"

                result = await mcp_clients.games.make_chess_move(game_id, move, None)
                if result.get("success"):
                    game_data = result.get("result", {})
                    return f"Go Move Recorded ({game_id}):\nMove: {move}\nPosition: {game_data.get('position', 'Unknown')}\nAI Analysis: {game_data.get('analysis', 'Pending')}"
                else:
                    return f"Failed to make Go move: {result.get('error')}"

            elif tool_name == "chess_openings":
                opening = parameters.get("opening", "italian_game")
                color = parameters.get("color", "white")

                prompt = f"""Explain the chess opening "{opening}" for {color} player.
Include:
1. Basic moves and sequence
2. Key ideas and plans
3. Common transpositions
4. Strategic themes
5. Example games or famous players who used it

Format as a clear, educational guide."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Chess Opening Guide ({opening.title()} - {color.title()}):\n\n{response['result']}"
                else:
                    return "Failed to generate opening guide"

            elif tool_name == "word_games":
                game = parameters.get("game", "scrabble")
                difficulty = parameters.get("difficulty", "medium")

                if game.lower() == "scrabble":
                    prompt = f"""Generate a Scrabble word challenge ({difficulty} difficulty):
1. 7 random letter tiles
2. Best possible words (3-7 letters)
3. Point values for each word
4. Strategy tips

Make it fun and educational."""
                elif game.lower() == "crossword":
                    prompt = f"""Create a crossword puzzle clue ({difficulty} difficulty):
Provide 5 clues with answers, covering different categories (movies, history, science, etc.)
Format: Clue -> Answer"""
                else:
                    prompt = f"Create a {game} game challenge ({difficulty} difficulty)"

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"{game.title()} Challenge ({difficulty.title()}):\n\n{response['result']}"
                else:
                    return f"Failed to generate {game} challenge"

            # Vienna Life Management Tools
            elif tool_name == "vienna_events":
                event_type = parameters.get("type", "general")
                date = parameters.get("date", "this_week")
                district = parameters.get("district", "9")  # Alsergrund

                prompt = f"""Find current {event_type} events in Vienna district {district} for {date}.
Include:
1. 3-5 relevant events with dates and venues
2. Ticket prices if available
3. Brief descriptions
4. How to get there (Wiener Linien)

Focus on authentic Vienna cultural offerings."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Vienna Events ({event_type} - District {district}):\n\n{response['result']}"
                else:
                    return "Failed to find Vienna events"

            elif tool_name == "vienna_services":
                service = parameters.get("service", "general")
                district = parameters.get("district", "9")

                prompt = f"""Find {service} services in Vienna district {district}.
Include:
1. 3-5 specific locations with addresses
2. Opening hours
3. Contact information
4. Wiener Linien connections
5. Any special Vienna-specific information

Make it practical for daily life in Vienna."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Vienna Services ({service} - District {district}):\n\n{response['result']}"
                else:
                    return "Failed to find Vienna services"

            elif tool_name == "vienna_restaurants":
                cuisine = parameters.get("cuisine", "austrian")
                district = parameters.get("district", "9")
                price_range = parameters.get("price_range", "€€")

                prompt = f"""Recommend authentic {cuisine} restaurants in Vienna district {district} ({price_range}).
Include:
1. 3-5 restaurant recommendations
2. Authentic dishes to try
3. Price ranges and typical costs
4. Wiener Linien connections
5. Vienna-specific dining tips

Focus on genuine local experiences."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Vienna Restaurants ({cuisine} - District {district}):\n\n{response['result']}"
                else:
                    return "Failed to find Vienna restaurants"

            elif tool_name == "vienna_weather":
                forecast = parameters.get("forecast", "current")

                prompt = f"""Provide detailed Vienna weather information for {forecast}.
Include Austrian-specific details:
1. Current conditions with Austrian terminology
2. Temperature in Celsius
3. Precipitation chances and types
4. Wind conditions (using Austrian wind names if applicable)
5. Vienna-specific weather impacts (Danube, outdoor activities)
6. Traditional Austrian weather sayings or advice

Make it locally relevant for Vienna residents."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Vienna Weather ({forecast.title()}):\n\n{response['result']}"
                else:
                    return "Failed to get Vienna weather"

            elif tool_name == "vienna_transport":
                from_station = parameters.get("from_station")
                to_station = parameters.get("to_station")
                time = parameters.get("time", "now")

                if not from_station or not to_station:
                    return "Error: Both 'from_station' and 'to_station' parameters are required"

                # Use the existing wiener_linien integration
                query = f"route from {from_station} to {to_station} at {time}"
                try:
                    import httpx
                    async with httpx.AsyncClient(timeout=5.0) as client:
                        response = await client.get(f"http://localhost:3079/api/routes?from={from_station}&to={to_station}&time={time}")
                        if response.status_code == 200:
                            data = response.json()
                            routes = data.get("routes", [])[:2]  # Show top 2 routes
                            if routes:
                                route_info = []
                                for i, route in enumerate(routes, 1):
                                    duration = route.get("duration", "Unknown")
                                    changes = route.get("changes", 0)
                                    lines = route.get("lines", [])
                                    route_info.append(f"Route {i}: {duration} minutes, {changes} changes, Lines: {', '.join(lines)}")
                                return f"Vienna Transport Route:\nFrom: {from_station}\nTo: {to_station}\nTime: {time}\n\n" + "\n".join(route_info)
                            else:
                                return f"No routes found from {from_station} to {to_station}"
                        else:
                            return "Wiener Linien routing service not available"
                except Exception as e:
                    return f"Transport service error: {str(e)}"

            # Recipe & Meal Planning Tools
            elif tool_name == "recipe_search":
                ingredients = parameters.get("ingredients", "")
                cuisine = parameters.get("cuisine", "general")
                dietary = parameters.get("dietary", "")
                time = parameters.get("time", "30")

                constraints = []
                if ingredients:
                    constraints.append(f"using: {ingredients}")
                if dietary:
                    constraints.append(f"{dietary}")
                if time:
                    constraints.append(f"under {time} minutes")

                prompt = f"""Find a {cuisine} recipe {' with '.join(constraints) if constraints else ''}.

Provide:
1. Recipe name and brief description
2. Ingredients list with quantities
3. Step-by-step cooking instructions
4. Preparation and cooking time
5. Serving suggestions
6. Nutritional notes (if relevant)

Make it practical and easy to follow."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Recipe Search ({cuisine}):\n\n{response['result']}"
                else:
                    return "Failed to find recipe"

            elif tool_name == "meal_plan":
                days = parameters.get("days", 7)
                preferences = parameters.get("preferences", "balanced")
                dietary = parameters.get("dietary", "")

                prompt = f"""Create a {days}-day meal plan with {preferences} preferences{' (' + dietary + ')' if dietary else ''}.

Include:
1. Breakfast, lunch, dinner for each day
2. Recipe suggestions with key ingredients
3. Nutritional balance notes
4. Complete shopping list organized by category
5. Preparation tips and time estimates

Make it realistic and varied."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"{days}-Day Meal Plan ({preferences}):\n\n{response['result']}"
                else:
                    return "Failed to create meal plan"

            elif tool_name == "cooking_tips":
                technique = parameters.get("technique")
                ingredient = parameters.get("ingredient")

                if technique:
                    prompt = f"""Provide detailed cooking tips for {technique} technique.
Include:
1. Basic method and steps
2. Common mistakes to avoid
3. Pro tips from experienced cooks
4. Recipe examples
5. Safety considerations"""

                elif ingredient:
                    prompt = f"""Provide cooking tips and substitution advice for {ingredient}.
Include:
1. Best cooking methods
2. Flavor pairings
3. Common substitutes
4. Storage and preparation tips
5. Nutritional information"""

                else:
                    return "Error: Either 'technique' or 'ingredient' parameter is required"

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Cooking Tips ({technique or ingredient}):\n\n{response['result']}"
                else:
                    return "Failed to get cooking tips"

            # Fitness & Health Tools
            elif tool_name == "workout_plan":
                goal = parameters.get("goal", "general_fitness")
                level = parameters.get("level", "intermediate")
                equipment = parameters.get("equipment", "none")
                time = parameters.get("time", 45)

                prompt = f"""Create a {goal} workout plan for {level} level with {equipment} equipment, {time} minutes per session.

Include:
1. Weekly workout schedule (4-5 days)
2. Warm-up and cool-down routines
3. Specific exercises with sets/reps
4. Progress tracking tips
5. Safety considerations and modifications

Make it realistic and progressive."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Workout Plan ({goal} - {level}):\n\n{response['result']}"
                else:
                    return "Failed to create workout plan"

            elif tool_name == "health_tracker":
                metric = parameters.get("metric", "general")
                goal = parameters.get("goal", "")
                advice = parameters.get("advice", "")

                if advice:
                    prompt = f"""Provide health and wellness advice about: {advice}
Include:
1. Evidence-based recommendations
2. Practical implementation tips
3. When to consult professionals
4. Related lifestyle factors"""

                elif metric:
                    prompt = f"""Help track and improve {metric} health metric{' with goal: ' + goal if goal else ''}.
Include:
1. How to measure and track {metric}
2. Healthy target ranges
3. Improvement strategies
4. Common pitfalls to avoid
5. Motivation and habit-building tips"""

                else:
                    return "Error: Either 'metric' or 'advice' parameter is required"

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Health Guidance ({metric or advice}):\n\n{response['result']}"
                else:
                    return "Failed to get health guidance"

            elif tool_name == "vienna_fitness":
                activity = parameters.get("activity", "gym")
                district = parameters.get("district", "9")

                prompt = f"""Find {activity} facilities and outdoor spaces in Vienna district {district}.
Include:
1. 3-5 specific locations with addresses
2. Facilities and amenities
3. Membership costs or entry fees
4. Operating hours
5. Wiener Linien connections
6. Vienna-specific fitness tips

Focus on quality, accessibility, and local knowledge."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Vienna Fitness ({activity} - District {district}):\n\n{response['result']}"
                else:
                    return "Failed to find Vienna fitness options"

            # Budget & Finance Tools
            elif tool_name == "budget_planner":
                income = parameters.get("income")
                expenses = parameters.get("expenses", "")
                goals = parameters.get("goals", "")

                prompt = f"""Create a personal budget plan{' with €' + str(income) + ' monthly income' if income else ''}.
Expense categories: {expenses}
Goals: {goals}

Provide:
1. Detailed monthly budget breakdown
2. Savings recommendations
3. Expense optimization suggestions
4. Austrian-specific financial tips (€)
5. Emergency fund planning
6. Long-term financial goals

Make it realistic and actionable for Vienna living costs."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Budget Planning{' (€' + str(income) + '/month)' if income else ''}:\n\n{response['result']}"
                else:
                    return "Failed to create budget plan"

            elif tool_name == "expense_analyzer":
                period = parameters.get("period", "month")
                category = parameters.get("category", "")
                trends = parameters.get("trends", "yes")

                focus = f" focusing on {category}" if category else ""
                trend_analysis = " with spending trend analysis" if trends.lower() == "yes" else ""

                prompt = f"""Analyze {period}ly expenses{focus}{trend_analysis}.

Provide:
1. Spending pattern insights
2. Category breakdown and percentages
3. Unusual or concerning spending
4. Saving opportunities
5. Budget adjustment recommendations
6. Austrian cost-of-living context

Use realistic Vienna expense examples."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Expense Analysis ({period}{focus}):\n\n{response['result']}"
                else:
                    return "Failed to analyze expenses"

            elif tool_name == "austrian_finance":
                topic = parameters.get("topic", "general")
                context = parameters.get("context", "")

                prompt = f"""Provide Austrian financial advice about {topic}{f' in context: {context}' if context else ''}.

Include:
1. Austrian-specific regulations and requirements
2. Local banking and financial services
3. Tax implications (€ based)
4. Vienna cost-of-living factors
5. Recommended Austrian financial institutions
6. Cultural differences in financial practices

Focus on practical, current information for expats/residents."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Austrian Finance ({topic}):\n\n{response['result']}"
                else:
                    return "Failed to get Austrian financial advice"

            # Learning & Skill Development Tools
            elif tool_name == "learning_plan":
                skill = parameters.get("skill")
                level = parameters.get("level", "beginner")
                time_commitment = parameters.get("time_commitment", "5")
                duration = parameters.get("duration", "12")

                if not skill:
                    return "Error: 'skill' parameter is required"

                prompt = f"""Create a {duration}-week learning plan for {skill} starting from {level} level with {time_commitment} hours/week.

Include:
1. Weekly learning objectives and milestones
2. Recommended resources and materials
3. Practice exercises and projects
4. Progress assessment methods
5. Common challenges and solutions
6. Realistic timeline and expectations

Make it structured, achievable, and motivating."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Learning Plan ({skill} - {level}):\n\n{response['result']}"
                else:
                    return "Failed to create learning plan"

            elif tool_name == "progress_tracker":
                skill = parameters.get("skill")
                milestone = parameters.get("milestone", "")
                assessment = parameters.get("assessment", "")

                if not skill:
                    return "Error: 'skill' parameter is required"

                prompt = f"""Track progress in learning {skill}.
Recent milestone: {milestone}
Current self-assessment: {assessment}

Provide:
1. Progress evaluation and insights
2. Next learning objectives
3. Areas needing more focus
4. Recommended next steps
5. Motivation and encouragement
6. Timeline adjustments if needed

Be encouraging and constructive."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Progress Tracking ({skill}):\n\n{response['result']}"
                else:
                    return "Failed to track progress"

            elif tool_name == "study_techniques":
                subject = parameters.get("subject", "general")
                learning_style = parameters.get("learning_style", "mixed")
                challenge = parameters.get("challenge", "")

                prompt = f"""Provide effective study techniques for {subject} with {learning_style} learning style{f' addressing challenge: {challenge}' if challenge else ''}.

Include:
1. Tailored study methods for {learning_style} learners
2. Time management and scheduling tips
3. Active recall and spaced repetition techniques
4. Memory aids and mnemonic devices
5. Technology tools and apps
6. Overcoming procrastination and maintaining motivation

Make it practical and evidence-based."""

                response = await ollama_service.generate(
                    model="llama3.2:3b",
                    prompt=prompt
                )

                if response.get("success"):
                    return f"Study Techniques ({subject} - {learning_style}):\n\n{response['result']}"
                else:
                    return "Failed to get study techniques"

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
            # Extract math expression - look for the longest sequence of math chars
            math_expr = re.findall(r"[\d\+\-\*/\(\)\s\.]+", user_message)
            if math_expr:
                # Find the longest math expression (most complete one)
                longest_expr = max(math_expr, key=len).strip()
                tool_calls.append({
                    "name": "calculator",
                    "parameters": {"expression": longest_expr}
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
            # Determine LLM provider for cost-aware optimization
            llm_provider = "ollama"  # Default
            if model.startswith("gpt-") or model.startswith("chatgpt"):
                llm_provider = "openai"
            elif model.startswith("claude"):
                llm_provider = "anthropic"

            enhanced = await self.enhance_prompt(user_content, model, llm_provider)
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

