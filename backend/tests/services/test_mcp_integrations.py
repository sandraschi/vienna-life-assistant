"""
MCP Integration Tests
Tests for MCP client manager and basic structure
"""
import pytest
from services.mcp_clients import MCPClientManager, mcp_clients


class TestMCPClientManager:
    """Test MCP client manager functionality"""

    def test_manager_initialization(self):
        """Test MCP client manager initializes all clients"""
        manager = MCPClientManager()

        assert hasattr(manager, 'advanced_memory')
        assert hasattr(manager, 'tapo')
        assert hasattr(manager, 'plex')
        assert hasattr(manager, 'calibre')
        assert hasattr(manager, 'ollama')
        assert hasattr(manager, 'immich')

    def test_global_mcp_clients_instance(self):
        """Test that global mcp_clients instance exists"""
        assert mcp_clients is not None
        assert isinstance(mcp_clients, MCPClientManager)


class TestMCPClientStructure:
    """Test MCP client structure and initialization"""

    def test_advanced_memory_client_creation(self):
        """Test that Advanced Memory client is properly created"""
        assert hasattr(mcp_clients, 'advanced_memory')
        assert mcp_clients.advanced_memory.server_name == "Advanced Memory MCP"
        assert mcp_clients.advanced_memory.timeout == 60

    def test_tapo_client_creation(self):
        """Test that Tapo client is properly created"""
        assert hasattr(mcp_clients, 'tapo')
        assert mcp_clients.tapo.server_name == "Tapo MCP"

    def test_plex_client_creation(self):
        """Test that Plex client is properly created"""
        assert hasattr(mcp_clients, 'plex')
        assert mcp_clients.plex.server_name == "Plex MCP"

    def test_calibre_client_creation(self):
        """Test that Calibre client is properly created"""
        assert hasattr(mcp_clients, 'calibre')
        assert mcp_clients.calibre.server_name == "Calibre MCP"

    def test_ollama_client_creation(self):
        """Test that Ollama client is properly created"""
        assert hasattr(mcp_clients, 'ollama')
        assert mcp_clients.ollama.server_name == "Ollama MCP"

    def test_immich_client_creation(self):
        """Test that Immich client is properly created"""
        assert hasattr(mcp_clients, 'immich')
        assert mcp_clients.immich.server_name == "Immich MCP"


class TestMCPClientBase:
    """Test base MCP client functionality"""

    def test_client_initialization(self):
        """Test MCP client base initialization"""
        from services.mcp_clients import MCPClientBase

        client = MCPClientBase("test/path.py", "Test Service", 30)

        assert client.server_path == "test/path.py"
        assert client.server_name == "Test Service"
        assert client.timeout == 30
        assert client._is_connected == False