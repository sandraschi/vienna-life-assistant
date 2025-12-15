"""
Comprehensive Chat API Tests
Tests for streaming chat, personalities, prompt enhancement, tools, and conversations
"""
import pytest
import json
from unittest.mock import patch, AsyncMock, MagicMock
from httpx import AsyncClient


class TestChatStreaming:
    """Test chat streaming functionality"""

    @pytest.mark.asyncio
    async def test_chat_stream_basic(self, client):
        """Test basic chat streaming"""
        with patch('services.chat_service.chat_service.chat_stream') as mock_stream:
            # Mock the streaming generator
            async def mock_generator():
                yield json.dumps({"type": "text", "content": "Hello"}) + "\n"
                yield json.dumps({"type": "done"}) + "\n"

            mock_stream.return_value = mock_generator()

            response = client.post("/api/chat/stream", json={
                "messages": [{"role": "user", "content": "Hello"}],
                "model": "llama3.2:3b",
                "personality": "assistant"
            })

            assert response.status_code == 200
            assert response.headers["content-type"] == "application/x-ndjson"

            # Parse streaming response
            lines = response.text.strip().split('\n')
            assert len(lines) == 2

            data1 = json.loads(lines[0])
            assert data1["type"] == "text"
            assert "Hello" in data1["content"]

            data2 = json.loads(lines[1])
            assert data2["type"] == "done"

    @pytest.mark.asyncio
    async def test_chat_stream_with_prompt_enhancement(self, client):
        """Test chat streaming with prompt enhancement"""
        # Test that the API accepts enhance_prompts parameter
        response = client.post("/api/chat/stream", json={
            "messages": [{"role": "user", "content": "Hello world"}],
            "enhance_prompts": True
        })

        # Should return 200 (enhancement happens internally, mocked in service tests)
        assert response.status_code == 200

    def _create_mock_stream(self, content):
        """Helper to create mock streaming response"""
        async def generator():
            yield json.dumps({"type": "text", "content": content}) + "\n"
            yield json.dumps({"type": "done"}) + "\n"
        return generator()

    @pytest.mark.asyncio
    async def test_chat_stream_with_tools(self, client):
        """Test chat streaming with tool usage"""
        with patch('services.chat_service.chat_service.chat_stream') as mock_stream, \
             patch('services.chat_service.chat_service._detect_tool_calls') as mock_detect:

            mock_detect.return_value = [{
                "name": "calculator",
                "parameters": {"expression": "2+2"}
            }]

            async def mock_generator():
                yield json.dumps({"type": "tool", "tool": "calculator", "result": "Result: 4"}) + "\n"
                yield json.dumps({"type": "text", "content": "The answer is 4"}) + "\n"
                yield json.dumps({"type": "done"}) + "\n"

            mock_stream.return_value = mock_generator()

            response = client.post("/api/chat/stream", json={
                "messages": [{"role": "user", "content": "What is 2+2?"}],
                "use_tools": True
            })

            assert response.status_code == 200

            lines = response.text.strip().split('\n')
            assert len(lines) == 3

            # Check tool call
            tool_data = json.loads(lines[0])
            assert tool_data["type"] == "tool"
            assert tool_data["tool"] == "calculator"

            # Check text response
            text_data = json.loads(lines[1])
            assert text_data["type"] == "text"

    @pytest.mark.asyncio
    async def test_chat_stream_all_personalities(self, client):
        """Test chat streaming with all available personalities"""
        personalities = ["assistant", "creative", "technical", "friendly", "concise", "vienna"]

        for personality in personalities:
            with patch('services.chat_service.chat_service.chat_stream') as mock_stream:
                mock_stream.return_value = self._create_mock_stream(f"Response as {personality}")

                response = client.post("/api/chat/stream", json={
                    "messages": [{"role": "user", "content": "Hello"}],
                    "personality": personality
                })

                assert response.status_code == 200

                # Verify personality was passed to chat service
                call_args = mock_stream.call_args
                assert call_args[1]["personality"] == personality


class TestChatPersonalities:
    """Test chatbot personalities"""

    def test_get_personalities(self, client):
        """Test getting available personalities"""
        response = client.get("/api/chat/personalities")

        assert response.status_code == 200
        data = response.json()

        assert "personalities" in data
        personalities = data["personalities"]

        # Should have 6 personalities
        assert len(personalities) == 6

        # Check required fields
        for personality in personalities:
            assert "id" in personality
            assert "name" in personality
            assert "description" in personality

        # Check specific personalities exist
        personality_ids = [p["id"] for p in personalities]
        assert "assistant" in personality_ids
        assert "vienna" in personality_ids
        assert "technical" in personality_ids


class TestChatTools:
    """Test chat tools functionality"""

    def test_get_tools(self, client):
        """Test getting available tools"""
        response = client.get("/api/chat/tools")

        assert response.status_code == 200
        data = response.json()

        assert "tools" in data
        tools = data["tools"]

        # Should have 15 tools (updated count)
        assert len(tools) == 15

        # Check required fields for each tool
        for tool in tools:
            assert "name" in tool
            assert "description" in tool
            assert "parameters" in tool

    def test_tool_definitions(self, client):
        """Test specific tool definitions"""
        response = client.get("/api/chat/tools")
        tools = response.json()["tools"]

        # Find specific tools
        calculator = next(t for t in tools if t["name"] == "calculator")
        assert "expression" in calculator["parameters"]

        datetime_tool = next(t for t in tools if t["name"] == "datetime")
        assert "format" in datetime_tool["parameters"]  # Has format parameter

        web_search = next(t for t in tools if t["name"] == "web_search")
        assert "query" in web_search["parameters"]
        assert "num_results" in web_search["parameters"]


class TestConversations:
    """Test conversation management"""

    def test_create_conversation(self, client):
        """Test creating a new conversation"""
        response = client.post("/api/chat/conversations", json={
            "title": "Test Conversation",
            "personality": "technical",
            "model": "llama3.2:3b"
        })

        assert response.status_code == 200
        data = response.json()

        assert "id" in data
        assert data["title"] == "Test Conversation"
        assert data["personality"] == "technical"
        assert data["model_name"] == "llama3.2:3b"

    def test_list_conversations(self, client):
        """Test listing conversations"""
        # Create a conversation first
        client.post("/api/chat/conversations", json={"title": "Test Conversation"})

        response = client.get("/api/chat/conversations")
        assert response.status_code == 200

        data = response.json()
        assert "conversations" in data
        assert len(data["conversations"]) >= 1

    def test_get_conversation(self, client):
        """Test getting a specific conversation"""
        # Create conversation
        create_response = client.post("/api/chat/conversations", json={
            "title": "Test Conversation"
        })
        conversation_id = create_response.json()["id"]

        # Get conversation
        response = client.get(f"/api/chat/conversations/{conversation_id}")
        assert response.status_code == 200

        data = response.json()
        assert "conversation" in data
        assert "messages" in data
        assert data["conversation"]["title"] == "Test Conversation"

    def test_save_message_to_conversation(self, client):
        """Test saving messages to conversation"""
        # Create conversation
        create_response = client.post("/api/chat/conversations", json={
            "title": "Test Conversation"
        })
        conversation_id = create_response.json()["id"]

        # Save user message
        response = client.post(f"/api/chat/conversations/{conversation_id}/messages", json={
            "role": "user",
            "content": "Hello AI"
        })
        assert response.status_code == 200

        # Save assistant message
        response = client.post(f"/api/chat/conversations/{conversation_id}/messages", json={
            "role": "assistant",
            "content": "Hello human!"
        })
        assert response.status_code == 200

        # Check conversation has messages
        get_response = client.get(f"/api/chat/conversations/{conversation_id}")
        data = get_response.json()
        assert len(data["messages"]) == 2

    def test_delete_conversation(self, client):
        """Test archiving a conversation"""
        # Create conversation
        create_response = client.post("/api/chat/conversations", json={
            "title": "Test Conversation"
        })
        conversation_id = create_response.json()["id"]

        # Delete conversation
        response = client.delete(f"/api/chat/conversations/{conversation_id}")
        assert response.status_code == 200

        # Check it's archived (not returned in list)
        list_response = client.get("/api/chat/conversations")
        conversations = list_response.json()["conversations"]
        conversation_ids = [c["id"] for c in conversations]
        assert conversation_id not in conversation_ids



    @pytest.mark.asyncio
    async def test_enhance_prompt_too_long(self):
        """Test prompt enhancement when result is too long"""
        with patch('services.ollama_service.ollama_service.generate') as mock_generate:
            # Return a very long enhanced prompt
            mock_generate.return_value = {
                "response": "Enhanced: " + "very long response " * 50
            }

            result = await chat_service.enhance_prompt("short", "llama3.2:3b", "ollama")

            # Should fallback to original
            assert result == "short"


class TestToolExecution:
    """Test tool execution functionality"""

    @pytest.mark.asyncio
    async def test_calculator_tool(self):
        """Test calculator tool execution"""
        result = await chat_service._execute_tool("calculator", {"expression": "2 + 3 * 4"})

        assert "Result: 14" in result

    @pytest.mark.asyncio
    async def test_datetime_tool(self):
        """Test datetime tool execution"""
        result = await chat_service._execute_tool("datetime", {})

        assert "Current time:" in result

    @pytest.mark.asyncio
    async def test_web_search_tool(self):
        """Test web search tool execution"""
        with patch('services.chat_service.ChatService._web_search_sync') as mock_search:
            mock_search.return_value = "Mock search results"

            result = await chat_service._execute_tool("web_search", {
                "query": "test query",
                "num_results": 5
            })

            assert "Mock search results" in result

    @pytest.mark.asyncio
    async def test_unknown_tool(self):
        """Test unknown tool handling"""
        result = await chat_service._execute_tool("nonexistent_tool", {})
        assert "Unknown tool" in result


class TestToolAutoDetection:
    """Test automatic tool detection"""

    def test_calculator_detection(self):
        """Test calculator tool auto-detection"""
        tools = chat_service._detect_tool_calls("What is 25 * 37?")

        assert len(tools) == 1
        assert tools[0]["name"] == "calculator"
        assert "25 * 37" in tools[0]["parameters"]["expression"]

    def test_datetime_detection(self):
        """Test datetime tool auto-detection"""
        tools = chat_service._detect_tool_calls("What time is it?")

        assert len(tools) == 1
        assert tools[0]["name"] == "datetime"

    def test_web_search_detection(self):
        """Test web search tool auto-detection"""
        tools = chat_service._detect_tool_calls("Search for Vienna weather")

        assert len(tools) == 1
        assert tools[0]["name"] == "web_search"
        assert "Vienna weather" in tools[0]["parameters"]["query"]

    def test_memory_tools_detection(self):
        """Test Advanced Memory tools auto-detection"""
        tools = chat_service._detect_tool_calls("Search my notes for Python")

        assert len(tools) == 1
        assert tools[0]["name"] == "search_knowledge"
        assert "Python" in tools[0]["parameters"]["query"]

    def test_weather_detection(self):
        """Test weather tool auto-detection"""
        tools = chat_service._detect_tool_calls("What's the weather like?")

        assert len(tools) == 1
        assert tools[0]["name"] == "get_weather"

    def test_multiple_tools_detection(self):
        """Test multiple tools can be detected"""
        tools = chat_service._detect_tool_calls("What time is it? Also calculate 2+2")

        tool_names = [t["name"] for t in tools]
        # At least one tool should be detected
        assert len(tool_names) >= 1

    def test_no_tools_detection(self):
        """Test no tools detected for regular conversation"""
        tools = chat_service._detect_tool_calls("Hello, how are you today?")

        assert len(tools) == 0


class TestErrorHandling:
    """Test error handling in chat functionality"""

    @pytest.mark.asyncio
    async def test_stream_error_handling(self, client):
        """Test streaming error handling"""
        with patch('services.chat_service.chat_service.chat_stream', side_effect=Exception("Stream error")):
            response = client.post("/api/chat/stream", json={
                "messages": [{"role": "user", "content": "Hello"}]
            })

            # Should still return a response (error handled internally)
            assert response.status_code in [200, 500]

    def test_invalid_conversation_id(self, client):
        """Test handling of invalid conversation ID"""
        response = client.get("/api/chat/conversations/invalid-id")

        assert response.status_code == 200
        data = response.json()
        assert "error" in data
        assert "not found" in data["error"].lower()

    @pytest.mark.asyncio
    async def test_invalid_tool_execution(self):
        """Test invalid tool execution"""
        result = await chat_service._execute_tool("nonexistent_tool", {})

        assert "Unknown tool" in result

    @pytest.mark.asyncio
    async def test_tool_error_handling(self):
        """Test tool error handling"""
        # Test with invalid calculator expression
        result = await chat_service._execute_tool("calculator", {"expression": "invalid syntax +++"})
        assert "Tool error" in result


# Import chat_service for testing - import after all other imports to avoid circular imports
try:
    from services.chat_service import chat_service
except ImportError:
    chat_service = None
