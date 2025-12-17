import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Tooltip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Construction as ToolIcon,
  AutoFixHigh as EnhanceIcon,
} from '@mui/icons-material';
import api from '../../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: any[];
  enhanced?: boolean;
}

interface Personality {
  id: string;
  name: string;
  description: string;
}

interface Conversation {
  id: string;
  title: string;
  personality: string;
  updated_at: string;
}

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState('assistant');
  const [selectedModel, setSelectedModel] = useState('llama3.2:3b');
  const [models, setModels] = useState<any[]>([]);
  const [useTools, setUseTools] = useState(true);
  const [enhancePrompts, setEnhancePrompts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadPersonalities();
    loadModels();
    loadConversations();
  }, []);

  const loadPersonalities = async () => {
    try {
      const response = await api.get('/api/chat/personalities');
      setPersonalities(response.data.personalities);
    } catch (error) {
      console.error('Failed to load personalities:', error);
    }
  };

  const loadModels = async () => {
    try {
      const response = await api.get('/api/llm/models');
      setModels(response.data.models || []);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await api.get('/api/chat/conversations');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await api.post('/api/chat/conversations', {
        title: 'New Chat',
        personality: selectedPersonality,
        model: selectedModel,
      });
      setCurrentConversation(response.data.id);
      setMessages([]);
      await loadConversations();
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await api.get(`/api/chat/conversations/${conversationId}`);
      setCurrentConversation(conversationId);
      const loadedMessages = response.data.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.created_at),
      }));
      setMessages(loadedMessages);
      setShowConversations(false);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await api.delete(`/api/chat/conversations/${conversationId}`);
      await loadConversations();
      if (currentConversation === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    // Create conversation if none exists
    if (!currentConversation) {
      await createNewConversation();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build message history
      const messageHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      messageHistory.push({ role: 'user', content: input });

      // Stream response - use the configured API base URL
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:7334';
      
      const response = await fetch(`${apiBaseUrl}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: currentConversation,
          messages: messageHistory,
          model: selectedModel,
          personality: selectedPersonality,
          use_tools: useTools,
          enhance_prompts: enhancePrompts,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Stream failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        toolCalls: [],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((l) => l.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.type === 'enhancement') {
              // Show prompt enhancement
              assistantMessage.enhanced = true;
            } else if (data.type === 'tool') {
              // Tool call result
              if (!assistantMessage.toolCalls) assistantMessage.toolCalls = [];
              assistantMessage.toolCalls.push(data);
            } else if (data.type === 'text') {
              // Stream text
              assistantMessage.content += data.content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { ...assistantMessage };
                return newMessages;
              });
            } else if (data.type === 'done') {
              // Done streaming
              break;
            }
          } catch (e) {
            console.error('Failed to parse chunk:', e);
          }
        }
      }

      // Save messages
      if (currentConversation) {
        await api.post(`/api/chat/conversations/${currentConversation}/messages`, {
          role: 'user',
          content: input,
        });
        await api.post(`/api/chat/conversations/${currentConversation}/messages`, {
          role: 'assistant',
          content: assistantMessage.content,
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <BotIcon color="primary" sx={{ fontSize: 32 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">AI Chatbot</Typography>
          <Typography variant="caption" color="text.secondary">
            {personalities.find((p) => p.id === selectedPersonality)?.name || 'Assistant'} •{' '}
            {selectedModel}
          </Typography>
        </Box>
        <Tooltip title="Conversations">
          <IconButton onClick={() => setShowConversations(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Settings">
          <IconButton onClick={() => setShowSettings(true)}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Messages */}
      <Paper
        sx={{
          flex: 1,
          p: 2,
          overflow: 'auto',
          mb: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <BotIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Start a conversation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ask me anything! I can use tools, search the web, and help with your tasks.
            </Typography>
          </Box>
        ) : (
          <Box>
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 2,
                  alignItems: 'flex-start',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main',
                  }}
                >
                  {msg.role === 'user' ? <PersonIcon /> : <BotIcon />}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Paper sx={{ p: 2 }}>
                    {msg.enhanced && (
                      <Chip
                        icon={<EnhanceIcon />}
                        label="Enhanced Prompt"
                        size="small"
                        color="info"
                        sx={{ mb: 1 }}
                      />
                    )}
                    {msg.toolCalls && msg.toolCalls.length > 0 && (
                      <Box sx={{ mb: 1 }}>
                        {msg.toolCalls.map((tool, idx) => (
                          <Chip
                            key={idx}
                            icon={<ToolIcon />}
                            label={`${tool.tool}: ${tool.result.substring(0, 30)}...`}
                            size="small"
                            color="success"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    )}
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {msg.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Paper>

      {/* Input */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
          </IconButton>
        </Box>
        {(useTools || enhancePrompts) && (
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            {useTools && (
              <Chip icon={<ToolIcon />} label="Tools Enabled" size="small" color="success" />
            )}
            {enhancePrompts && (
              <Chip icon={<EnhanceIcon />} label="Prompt Enhancement" size="small" color="info" />
            )}
          </Box>
        )}
      </Paper>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chat Settings</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Personality</InputLabel>
            <Select
              value={selectedPersonality}
              onChange={(e) => setSelectedPersonality(e.target.value)}
              label="Personality"
            >
              {personalities.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  <Box>
                    <Typography variant="body1">{p.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {p.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Model</InputLabel>
            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              label="Model"
            >
              {models.map((m) => (
                <MenuItem key={m.name} value={m.name}>
                  {m.name} ({(m.size / 1e9).toFixed(1)} GB)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={<Switch checked={useTools} onChange={(e) => setUseTools(e.target.checked)} />}
            label="Enable Tools (calculator, web search, calendar)"
            sx={{ mt: 2 }}
          />

          <FormControlLabel
            control={
              <Switch checked={enhancePrompts} onChange={(e) => setEnhancePrompts(e.target.checked)} />
            }
            label="AI Prompt Enhancement"
            sx={{ mt: 1 }}
          />
        </DialogContent>
      </Dialog>

      {/* Conversations Dialog */}
      <Dialog
        open={showConversations}
        onClose={() => setShowConversations(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Conversations
          <Button startIcon={<AddIcon />} onClick={createNewConversation} sx={{ float: 'right' }}>
            New Chat
          </Button>
        </DialogTitle>
        <DialogContent>
          <List>
            {conversations.map((conv) => (
              <ListItem
                key={conv.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteConversation(conv.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton onClick={() => loadConversation(conv.id)}>
                  <ListItemIcon>
                    <BotIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={conv.title}
                    secondary={`${conv.personality} • ${new Date(conv.updated_at).toLocaleDateString()}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

