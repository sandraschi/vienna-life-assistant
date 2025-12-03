import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
  PlayArrow as LoadIcon,
  Stop as UnloadIcon,
  Psychology as AIIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { llmApi } from '../../services/api';

interface Model {
  name: string;
  size?: number;
  modified_at?: string;
}

interface RecommendedModel {
  name: string;
  size: string;
  use_case: string;
  speed: string;
  quality: string;
}

export default function LLMManager() {
  const [models, setModels] = useState<Model[]>([]);
  const [recommended, setRecommended] = useState<RecommendedModel[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pullDialog, setPullDialog] = useState(false);
  const [modelToPull, setModelToPull] = useState('');
  const [pulling, setPulling] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statusRes, modelsRes, recommendedRes] = await Promise.all([
        llmApi.getStatus(),
        llmApi.listModels(),
        llmApi.getRecommended(),
      ]);
      setStatus(statusRes.data);
      setModels(modelsRes.data.models || []);
      setRecommended(recommendedRes.data.models || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load LLM data');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadModel = async (modelName: string) => {
    try {
      await llmApi.loadModel(modelName);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load model');
    }
  };

  const handlePullModel = async () => {
    if (!modelToPull.trim()) return;
    
    try {
      setPulling(true);
      await llmApi.pullModel(modelToPull);
      setPullDialog(false);
      setModelToPull('');
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to pull model');
    } finally {
      setPulling(false);
    }
  };

  const handleDeleteModel = async (modelName: string) => {
    if (!confirm(`Delete model ${modelName}?`)) return;
    
    try {
      await llmApi.deleteModel(modelName);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete model');
    }
  };

  const handleEnsureDefault = async () => {
    try {
      setLoading(true);
      await llmApi.ensureDefault();
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to ensure default model');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Status Card */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3, 
          bgcolor: status?.connected ? 'success.light' : 'error.light',
          color: 'white'
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight={600}>
          🤖 Local LLM (Ollama)
        </Typography>
        <Typography variant="body1">
          Status: {status?.connected ? '✅ Connected' : '❌ Not Running'}
        </Typography>
        {status?.connected && (
          <>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Default Model: <strong>{status.default_model}</strong>
            </Typography>
            <Typography variant="body2">
              Base URL: {status.base_url}
            </Typography>
          </>
        )}
        {!status?.connected && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Start Ollama with: <code>ollama serve</code>
          </Typography>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Quick Actions */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={loadData}
        >
          Refresh
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => setPullDialog(true)}
          disabled={!status?.connected}
        >
          Pull Model
        </Button>
        <Button
          variant="outlined"
          onClick={handleEnsureDefault}
          disabled={!status?.connected}
        >
          Ensure Default Model
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Installed Models */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Installed Models ({models.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {models.length === 0 ? (
              <Box textAlign="center" py={4}>
                <AIIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary" gutterBottom>
                  No models installed
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    setModelToPull('llama3.2:3b');
                    setPullDialog(true);
                  }}
                  sx={{ mt: 2 }}
                >
                  Pull Default Model
                </Button>
              </Box>
            ) : (
              <List>
                {models.map((model) => (
                  <ListItem key={model.name} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography fontWeight={500}>{model.name}</Typography>
                          {model.name === status?.default_model && (
                            <Chip label="Default" size="small" color="primary" />
                          )}
                        </Box>
                      }
                      secondary={
                        model.size
                          ? `${(model.size / 1e9).toFixed(1)} GB`
                          : 'Size unknown'
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Load Model">
                        <IconButton
                          edge="end"
                          onClick={() => handleLoadModel(model.name)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <LoadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Model">
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteModel(model.name)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Recommended Models */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Recommended Models
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box display="flex" flexDirection="column" gap={2}>
              {recommended.map((model) => (
                <Card key={model.name} variant="outlined">
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {model.name}
                      </Typography>
                      <Chip 
                        label={model.size} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {model.use_case}
                    </Typography>
                    
                    <Box display="flex" gap={1} mt={1.5}>
                      <Chip 
                        label={`Speed: ${model.speed}`} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                      <Chip 
                        label={`Quality: ${model.quality}`} 
                        size="small" 
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        setModelToPull(model.name);
                        setPullDialog(true);
                      }}
                      disabled={!status?.connected || models.some(m => m.name === model.name)}
                      sx={{ mt: 2 }}
                      fullWidth
                    >
                      {models.some(m => m.name === model.name) ? 'Installed' : 'Pull Model'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Pull Model Dialog */}
      <Dialog open={pullDialog} onClose={() => setPullDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Pull Ollama Model</DialogTitle>
        <DialogContent>
          <TextField
            label="Model Name"
            value={modelToPull}
            onChange={(e) => setModelToPull(e.target.value)}
            fullWidth
            autoFocus
            placeholder="e.g., llama3.2:3b"
            helperText="This may take several minutes depending on model size"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPullDialog(false)} disabled={pulling}>
            Cancel
          </Button>
          <Button
            onClick={handlePullModel}
            variant="contained"
            disabled={!modelToPull.trim() || pulling}
            startIcon={pulling ? <CircularProgress size={16} /> : <DownloadIcon />}
          >
            {pulling ? 'Pulling...' : 'Pull'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

