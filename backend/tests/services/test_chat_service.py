"""
Comprehensive Chat Service Tests
Tests for chat service core functionality, personalities, tools, and integrations
"""
import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from services.chat_service import ChatService, chat_service


class TestChatServiceInitialization:
    """Test chat service initialization"""

    def test_chat_service_init(self):
        """Test chat service initialization"""
        service = ChatService()
        assert service.personalities is not None
        assert service.tools is not None
        assert len(service.personalities) == 6  # 6 personalities
        assert len(service.tools) == 15  # 15 tools

    def test_get_personalities(self):
        """Test getting personalities"""
        personalities = chat_service.get_personalities()

        assert len(personalities) == 6
        assert all("id" in p and "name" in p and "description" in p for p in personalities)

        # Check specific personalities
        ids = [p["id"] for p in personalities]
        assert "assistant" in ids
        assert "vienna" in ids

    def test_get_tools(self):
        """Test getting tools"""
        tools = chat_service.get_tools()

        assert len(tools) == 15  # Updated to match actual count
        assert all("name" in t and "description" in t and "parameters" in t for t in tools)


class TestPromptEnhancement:
    """Test prompt enhancement functionality"""

    @pytest.mark.asyncio
    async def test_enhance_prompt_success(self):
        """Test successful prompt enhancement"""
        with patch('services.ollama_service.ollama_service.generate') as mock_generate:
            # Use a shorter enhanced prompt that won't trigger the length limit
            mock_generate.return_value = {
                "response": "Explain ML algorithms clearly"
            }

            result = await chat_service.enhance_prompt("explain ML", "llama3.2:3b", "ollama")

            assert result == "Explain ML algorithms clearly"
            mock_generate.assert_called_once()

    @pytest.mark.asyncio
    async def test_enhance_prompt_error_fallback(self):
        """Test fallback to original prompt on error"""
        with patch('services.ollama_service.ollama_service.generate', side_effect=Exception("API Error")):
            result = await chat_service.enhance_prompt("original prompt", "llama3.2:3b", "ollama")

            assert result == "original prompt"

    @pytest.mark.asyncio
    async def test_enhance_prompt_too_long_fallback(self):
        """Test fallback when enhanced prompt is too long"""
        with patch('services.ollama_service.ollama_service.generate') as mock_generate:
            # Create a very long response
            long_response = "Enhanced: " + "very detailed enhancement " * 100
            mock_generate.return_value = {"response": long_response}

            result = await chat_service.enhance_prompt("short", "llama3.2:3b", "ollama")

            # Should fallback to original
            assert result == "short"


class TestToolExecution:
    """Test individual tool execution"""

    @pytest.mark.asyncio
    async def test_calculator_tool(self):
        """Test calculator tool"""
        result = await chat_service._execute_tool("calculator", {"expression": "10 + 5 * 2"})
        assert "Result: 20" in result

    @pytest.mark.asyncio
    async def test_calculator_tool_invalid(self):
        """Test calculator tool with invalid expression"""
        result = await chat_service._execute_tool("calculator", {"expression": "invalid syntax +++"})
        assert "Tool error" in result

    @pytest.mark.asyncio
    async def test_datetime_tool(self):
        """Test datetime tool"""
        result = await chat_service._execute_tool("datetime", {})
        assert "Current time:" in result

    @pytest.mark.asyncio
    async def test_datetime_tool_with_format(self):
        """Test datetime tool with custom format"""
        result = await chat_service._execute_tool("datetime", {"format": "%Y-%m-%d"})
        assert "Current time:" in result

    @pytest.mark.asyncio
    async def test_web_search_tool(self):
        """Test web search tool"""
        with patch.object(chat_service, '_web_search_sync') as mock_search:
            mock_search.return_value = "Mocked search results"

            result = await chat_service._execute_tool("web_search", {
                "query": "test query",
                "num_results": 3
            })

            assert "Mocked search results" in result
            mock_search.assert_called_once_with("test query", 3)

    @pytest.mark.asyncio
    async def test_advanced_memory_search(self):
        """Test Advanced Memory search tool"""
        with patch('services.mcp_clients.mcp_clients.advanced_memory') as mock_memory:
            mock_memory.search_notes = AsyncMock(return_value={
                "success": True,
                "result": [
                    {"title": "Python Basics", "preview": "Learn Python fundamentals"},
                    {"title": "Web Development", "preview": "Build web apps"}
                ]
            })

            result = await chat_service._execute_tool("search_knowledge", {
                "query": "python web",
                "max_results": 5
            })

            assert "Knowledge base search" in result
            assert "Python Basics" in result
            assert "Web Development" in result

    @pytest.mark.asyncio
    async def test_advanced_memory_read_note(self):
        """Test Advanced Memory read note tool"""
        with patch('services.mcp_clients.mcp_clients.advanced_memory') as mock_memory:
            mock_memory.read_note = AsyncMock(return_value={
                "success": True,
                "result": {
                    "title": "Test Note",
                    "content": "This is test content"
                }
            })

            result = await chat_service._execute_tool("read_note", {
                "identifier": "test-note"
            })

            assert "Note 'Test Note':" in result
            assert "This is test content" in result

    @pytest.mark.asyncio
    async def test_advanced_memory_create_note(self):
        """Test Advanced Memory create note tool"""
        with patch('services.mcp_clients.mcp_clients.advanced_memory') as mock_memory:
            mock_memory.write_note = AsyncMock(return_value={
                "success": True
            })

            result = await chat_service._execute_tool("create_note", {
                "title": "New Note",
                "content": "Note content",
                "tags": "test"
            })

            assert "Created note: 'New Note'" in result

    @pytest.mark.asyncio
    async def test_tapo_weather_tool(self):
        """Test Tapo weather tool"""
        with patch('services.mcp_clients.mcp_clients.tapo') as mock_tapo:
            mock_tapo.call_tool = AsyncMock(return_value={
                "success": True,
                "result": {
                    "data": {
                        "temperature": 22,
                        "conditions": "partly cloudy"
                    }
                }
            })

            result = await chat_service._execute_tool("get_weather", {})

            assert "Vienna Weather: 22°C, partly cloudy" in result

    @pytest.mark.asyncio
    async def test_tapo_lights_control(self):
        """Test Tapo lights control tool"""
        with patch('services.mcp_clients.mcp_clients.tapo') as mock_tapo:
            mock_tapo.call_tool = AsyncMock(return_value={"success": True})

            result = await chat_service._execute_tool("control_lights", {
                "action": "on",
                "room": "living room"
            })

            assert "Lights turned on" in result

    @pytest.mark.asyncio
    async def test_wiener_linien_tool(self):
        """Test Wiener Linien transport tool"""
        with patch('httpx.AsyncClient') as mock_client:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "stations": [
                    {"name": "Karlsplatz", "type": "U"},
                    {"name": "Stephansplatz", "type": "U"}
                ]
            }
            mock_client.return_value.__aenter__.return_value.get.return_value = mock_response

            result = await chat_service._execute_tool("wiener_linien", {
                "query": "Karlsplatz"
            })

            assert "Wiener Linien results" in result
            assert "Karlsplatz" in result

    @pytest.mark.asyncio
    async def test_unknown_tool(self):
        """Test unknown tool handling"""
        result = await chat_service._execute_tool("unknown_tool", {})

        assert "Unknown tool: unknown_tool" in result


class TestToolAutoDetection:
    """Test automatic tool detection from user messages"""

    def test_calculator_patterns(self):
        """Test calculator pattern detection"""
        patterns = [
            "What is 25 * 37?",
            "Calculate 10 + 5",
            "How much is 100 / 4?",
            "Compute sqrt(16)"
        ]

        for pattern in patterns:
            tools = chat_service._detect_tool_calls(pattern)
            assert len(tools) >= 1
            assert any(t["name"] == "calculator" for t in tools)

    def test_datetime_patterns(self):
        """Test datetime pattern detection"""
        patterns = [
            "What time is it?",
            "Current time",
            "What's today's date?",
            "What day is it?"
        ]

        for pattern in patterns:
            tools = chat_service._detect_tool_calls(pattern)
            assert len(tools) >= 1
            assert any(t["name"] == "datetime" for t in tools)

    def test_web_search_patterns(self):
        """Test web search pattern detection"""
        patterns = [
            "Search for Vienna restaurants",
            "Look up quantum physics",
            "Find information about machine learning",
            "What's the news about AI?"
        ]

        for pattern in patterns:
            tools = chat_service._detect_tool_calls(pattern)
            assert len(tools) >= 1
            assert any(t["name"] == "web_search" for t in tools)

    def test_memory_patterns(self):
        """Test Advanced Memory pattern detection"""
        patterns = [
            "Search my notes for Python",
            "Find in notes about algorithms",
            "Check knowledge base for React",
            "Look up zettelkasten about databases"
        ]

        for pattern in patterns:
            tools = chat_service._detect_tool_calls(pattern)
            assert len(tools) >= 1
            memory_tools = [t for t in tools if t["name"] in ["search_knowledge", "read_note", "recent_notes"]]
            assert len(memory_tools) >= 1

    def test_weather_patterns(self):
        """Test weather pattern detection"""
        patterns = [
            "What's the weather?",
            "Is it raining?",
            "Weather forecast",
            "How's the temperature?"
        ]

        for pattern in patterns:
            tools = chat_service._detect_tool_calls(pattern)
            assert len(tools) >= 1
            assert any(t["name"] == "get_weather" for t in tools)

    def test_light_control_patterns(self):
        """Test smart light control pattern detection"""
        patterns = [
            "Turn on the lights",
            "Turn off bedroom lights",
            "Dim the living room lights",
            "Lights on"
        ]

        for pattern in patterns:
            tools = chat_service._detect_tool_calls(pattern)
            assert len(tools) >= 1
            assert any(t["name"] == "control_lights" for t in tools)

    def test_transport_patterns(self):
        """Test Wiener Linien transport pattern detection"""
        patterns = [
            "When's next U6?",
            "U-Bahn schedule",
            "Next tram to Karlsplatz",
            "Bus departure times"
        ]

        for pattern in patterns:
            tools = chat_service._detect_tool_calls(pattern)
            assert len(tools) >= 1
            assert any(t["name"] == "wiener_linien" for t in tools)

    def test_multiple_tools_in_message(self):
        """Test detecting multiple tools in one message"""
        message = "What time is it? Also calculate 2+2 and check the weather."
        tools = chat_service._detect_tool_calls(message)

        tool_names = [t["name"] for t in tools]
        assert "datetime" in tool_names
        assert "calculator" in tool_names
        assert "get_weather" in tool_names

    def test_no_tools_detected(self):
        """Test no tools detected for regular conversation"""
        messages = [
            "Hello, how are you?",
            "Nice to meet you",
            "Tell me a joke",
            "What's your favorite color?"
        ]

        for message in messages:
            tools = chat_service._detect_tool_calls(message)
            assert len(tools) == 0


class TestWebSearch:
    """Test web search functionality"""

    @patch('httpx.Client')
    def test_web_search_success(self, mock_client):
        """Test successful web search"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "AbstractText": "Test abstract",
            "RelatedTopics": [
                {"Text": "Topic 1"},
                {"Text": "Topic 2"}
            ]
        }
        mock_client.return_value.__enter__.return_value.get.return_value = mock_response

        result = chat_service._web_search_sync("test query", 3)

        assert "Web search results:" in result
        assert "Test abstract" in result
        assert "Topic 1" in result

    @patch('httpx.Client')
    def test_web_search_no_results(self, mock_client):
        """Test web search with no results"""
        mock_response = MagicMock()
        mock_response.json.return_value = {}
        mock_client.return_value.__enter__.return_value.get.return_value = mock_response

        result = chat_service._web_search_sync("test query")

        assert "No results found" in result

    @patch('httpx.Client')
    def test_web_search_error(self, mock_client):
        """Test web search error handling"""
        mock_client.return_value.__enter__.return_value.get.side_effect = Exception("Network error")

        result = chat_service._web_search_sync("test query")

        assert "Web search error" in result


class TestChatStreaming:
    """Test chat streaming functionality"""

    @pytest.mark.asyncio
    async def test_chat_stream_basic(self):
        """Test basic chat streaming"""
        messages = [{"role": "user", "content": "Hello"}]

        with patch('services.ollama_service.ollama_service.generate_stream') as mock_stream:
            mock_stream.return_value = self._create_mock_stream("Hello from AI")

            chunks = []
            async for chunk in chat_service.chat_stream(messages):
                chunks.append(chunk)

            assert len(chunks) > 0
            # Check for done signal
            assert any('"type": "done"' in chunk for chunk in chunks)

    @pytest.mark.asyncio
    async def test_chat_stream_with_enhancement(self):
        """Test chat streaming with prompt enhancement"""
        messages = [{"role": "user", "content": "hi"}]

        with patch('services.chat_service.chat_service.enhance_prompt') as mock_enhance, \
             patch('services.ollama_service.ollama_service.generate_stream') as mock_stream:

            mock_enhance.return_value = "Enhanced: Hello there"
            mock_stream.return_value = self._create_mock_stream("Enhanced response")

            chunks = []
            async for chunk in chat_service.chat_stream(messages, enhance_prompts=True):
                chunks.append(chunk)

            # Should include enhancement info
            enhancement_chunks = [c for c in chunks if '"type": "enhancement"' in c]
            assert len(enhancement_chunks) > 0

    @pytest.mark.asyncio
    async def test_chat_stream_with_tools(self):
        """Test chat streaming with tool usage"""
        messages = [{"role": "user", "content": "Calculate 5*5"}]

        with patch('services.chat_service.chat_service._detect_tool_calls') as mock_detect, \
             patch('services.chat_service.chat_service._execute_tool') as mock_execute, \
             patch('services.ollama_service.ollama_service.generate_stream') as mock_stream:

            mock_detect.return_value = [{"name": "calculator", "parameters": {"expression": "5*5"}}]
            mock_execute.return_value = "Result: 25"
            mock_stream.return_value = self._create_mock_stream("The answer is 25")

            chunks = []
            async for chunk in chat_service.chat_stream(messages, use_tools=True):
                chunks.append(chunk)

            # Should include tool result
            tool_chunks = [c for c in chunks if '"type": "tool"' in c]
            assert len(tool_chunks) > 0

    @pytest.mark.asyncio
    async def test_chat_stream_all_personalities(self):
        """Test chat streaming with different personalities"""
        messages = [{"role": "user", "content": "Hello"}]

        for personality in ["assistant", "creative", "technical", "friendly", "concise", "vienna"]:
            with patch('services.ollama_service.ollama_service.generate_stream') as mock_stream:
                mock_stream.return_value = self._create_mock_stream(f"Response as {personality}")

                chunks = []
                async for chunk in chat_service.chat_stream(messages, personality=personality):
                    chunks.append(chunk)

                assert len(chunks) > 0

    def _create_mock_stream(self, content):
        """Helper to create mock streaming response"""
        async def generator():
            yield {"response": content}
            yield {"done": True}
        return generator()


class TestPersonalityDefinitions:
    """Test personality definitions and behavior"""

    def test_personality_structure(self):
        """Test personality definitions have required structure"""
        for pid, personality in chat_service.personalities.items():
            assert "name" in personality
            assert "description" in personality
            assert "system_prompt" in personality
            assert len(personality["system_prompt"]) > 50  # Reasonable length

    def test_vienna_personality(self):
        """Test Vienna-specific personality"""
        vienna = chat_service.personalities["vienna"]
        assert "Vienna" in vienna["name"]
        assert "vienna" in vienna["description"].lower()
        assert "Vienna" in vienna["system_prompt"]

    def test_technical_personality(self):
        """Test technical personality"""
        technical = chat_service.personalities["technical"]
        assert "technical" in technical["name"].lower()
        assert "code" in technical["system_prompt"].lower()


class TestToolDefinitions:
    """Test tool definitions and structure"""

    def test_tool_structure(self):
        """Test all tools have required structure"""
        for tool in chat_service.tools:
            assert "name" in tool
            assert "description" in tool
            assert "parameters" in tool
            assert isinstance(tool["parameters"], dict)

    def test_core_tools(self):
        """Test core tools are properly defined"""
        tool_names = [t["name"] for t in chat_service.tools]

        # Core tools
        assert "calculator" in tool_names
        assert "datetime" in tool_names
        assert "web_search" in tool_names

        # Memory tools
        assert "search_knowledge" in tool_names
        assert "read_note" in tool_names
        assert "create_note" in tool_names

        # Smart home tools
        assert "get_weather" in tool_names
        assert "control_lights" in tool_names

        # Transport tools
        assert "wiener_linien" in tool_names

    def test_tool_parameters(self):
        """Test tool parameters are reasonable"""
        for tool in chat_service.tools:
            params = tool["parameters"]
            if tool["name"] == "calculator":
                assert "expression" in params
            elif tool["name"] == "web_search":
                assert "query" in params
                assert "num_results" in params


class TestErrorHandling:
    """Test error handling in chat service"""

    @pytest.mark.asyncio
    async def test_tool_execution_error(self):
        """Test tool execution error handling"""
        with patch('services.mcp_clients.mcp_clients.advanced_memory') as mock_memory:
            mock_memory.search_notes.side_effect = Exception("Connection failed")

            result = await chat_service._execute_tool("search_knowledge", {"query": "test"})

            assert "Tool error" in result

    @pytest.mark.asyncio
    async def test_stream_error_handling(self):
        """Test streaming error handling"""
        messages = [{"role": "user", "content": "test"}]

        with patch('services.ollama_service.ollama_service.generate_stream', side_effect=Exception("Stream failed")):
            # Currently the stream method doesn't handle errors gracefully
            # This test documents the current behavior - it should raise exceptions
            with pytest.raises(Exception, match="Stream failed"):
                async for chunk in chat_service.chat_stream(messages):
                    pass

    @pytest.mark.asyncio
    async def test_web_search_timeout(self):
        """Test web search timeout handling"""
        with patch('httpx.Client') as mock_client:
            mock_client.return_value.__enter__.return_value.get.side_effect = Exception("Timeout")

            result = chat_service._web_search_sync("test query")

            assert "Web search error" in result
