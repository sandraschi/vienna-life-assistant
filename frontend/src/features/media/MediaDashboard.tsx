import { Box, Grid, Paper, Typography, Button, Card, CardContent, Chip, Divider, CircularProgress, Alert, LinearProgress } from '@mui/material';
import {
  PlayArrow as PlexIcon,
  MenuBook as CalibreIcon,
  Photo as ImmichIcon,
  Videocam as TapoIcon,
  OpenInNew as LaunchIcon,
  CheckCircle as ConnectedIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:9001';

interface MediaStatus {
  plex: { connected: boolean; mcp_available: boolean };
  calibre: { connected: boolean; mcp_available: boolean };
  immich: { connected: boolean; mcp_available: boolean };
  tapo: { connected: boolean; mcp_available: boolean };
  ollama: { connected: boolean; mcp_available: boolean };
}

interface PlexItem {
  title: string;
  progress?: number;
  remaining?: string;
}

interface CalibreBook {
  title: string;
  author?: string;
  progress?: number;
}

export default function MediaDashboard() {
  const [status, setStatus] = useState<MediaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plexItems, setPlexItems] = useState<PlexItem[]>([]);
  const [calibreBooks, setCalibreBooks] = useState<CalibreBook[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMediaStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/media/status`, { timeout: 10000 });
      setStatus(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch media status:', err);
      setError(err.message || 'Failed to connect to backend');
      // Set mock status so page still shows
      setStatus({
        plex: { connected: false, mcp_available: false },
        calibre: { connected: false, mcp_available: false },
        immich: { connected: false, mcp_available: false },
        tapo: { connected: false, mcp_available: false },
        ollama: { connected: false, mcp_available: false },
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchPlexData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/media/plex/continue-watching`);
      setPlexItems(response.data.items || []);
    } catch (err) {
      console.error('Failed to fetch Plex data:', err);
    }
  };

  const fetchCalibreData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/media/calibre/currently-reading`);
      setCalibreBooks(response.data.books || []);
    } catch (err) {
      console.error('Failed to fetch Calibre data:', err);
    }
  };

  useEffect(() => {
    fetchMediaStatus();
    fetchPlexData();
    fetchCalibreData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMediaStatus();
    fetchPlexData();
    fetchCalibreData();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Media & Home Control
        </Typography>
        <Button
          variant="outlined"
          startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={handleRefresh}
          disabled={refreshing}
          size="small"
          sx={{ textTransform: 'none' }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Plex Widget */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PlexIcon sx={{ color: '#e5a00d', fontSize: 32 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Plex
                  </Typography>
                  {status?.plex.connected ? (
                    <ConnectedIcon sx={{ color: 'success.main', fontSize: 20 }} />
                  ) : (
                    <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />
                  )}
                </Box>
                <Chip 
                  label={status?.plex.mcp_available ? "MCP Active" : "50k+ items"} 
                  size="small" 
                  color={status?.plex.mcp_available ? "success" : "warning"} 
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Continue Watching
              </Typography>
              <Box sx={{ mb: 2 }}>
                {plexItems.length > 0 ? (
                  plexItems.slice(0, 3).map((item, idx) => (
                    <Box key={idx} sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        📺 {item.title}
                      </Typography>
                      {item.progress && (
                        <LinearProgress 
                          variant="determinate" 
                          value={item.progress} 
                          sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                        />
                      )}
                      {item.remaining && (
                        <Typography variant="caption" color="text.secondary">
                          {item.remaining} remaining
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {status?.plex.connected 
                        ? "📺 No items in continue watching queue"
                        : "📺 Connect to Plex to see your continue watching queue"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      50,000 anime episodes + 5,000 Western movies ready
                    </Typography>
                  </>
                )}
              </Box>

              <Button
                variant="contained"
                startIcon={<LaunchIcon />}
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Open Plex
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{ ml: 1, textTransform: 'none' }}
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Calibre Widget */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalibreIcon sx={{ color: '#4caf50', fontSize: 32 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Calibre
                  </Typography>
                  {status?.calibre.connected ? (
                    <ConnectedIcon sx={{ color: 'success.main', fontSize: 20 }} />
                  ) : (
                    <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />
                  )}
                </Box>
                <Chip 
                  label={status?.calibre.mcp_available ? "MCP Active" : "15k ebooks"} 
                  size="small" 
                  color={status?.calibre.mcp_available ? "success" : "info"} 
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Currently Reading
              </Typography>
              <Box sx={{ mb: 2 }}>
                {calibreBooks.length > 0 ? (
                  calibreBooks.slice(0, 3).map((book, idx) => (
                    <Box key={idx} sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        📖 {book.title}
                      </Typography>
                      {book.author && (
                        <Typography variant="caption" color="text.secondary">
                          by {book.author}
                        </Typography>
                      )}
                      {book.progress && (
                        <LinearProgress 
                          variant="determinate" 
                          value={book.progress} 
                          sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                        />
                      )}
                    </Box>
                  ))
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {status?.calibre.connected
                        ? "📚 No books currently being read"
                        : "📚 Connect to Calibre to see your reading progress"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      15,000 ebooks in your library
                    </Typography>
                  </>
                )}
              </Box>

              <Button
                variant="contained"
                startIcon={<LaunchIcon />}
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Open Calibre++
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{ ml: 1, textTransform: 'none' }}
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Immich Widget */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <ImmichIcon sx={{ color: '#2196f3', fontSize: 32 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Immich
                  </Typography>
                  {status?.immich.connected ? (
                    <ConnectedIcon sx={{ color: 'success.main', fontSize: 20 }} />
                  ) : (
                    <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />
                  )}
                </Box>
                <Chip 
                  label={status?.immich.mcp_available ? "MCP Active" : "Photos"} 
                  size="small" 
                  color={status?.immich.mcp_available ? "success" : "info"} 
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Recent Photos
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  📸 Connect to Immich to see recent photos and memories
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Today in history, recent uploads, storage stats
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<LaunchIcon />}
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Open Immich
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{ ml: 1, textTransform: 'none' }}
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Tapo Home Control Widget */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <TapoIcon sx={{ color: '#f44336', fontSize: 32 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Tapo Home
                  </Typography>
                  {status?.tapo.connected ? (
                    <ConnectedIcon sx={{ color: 'success.main', fontSize: 20 }} />
                  ) : (
                    <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />
                  )}
                </Box>
                <Chip 
                  label={status?.tapo.mcp_available ? "MCP Active" : "Cameras"} 
                  size="small" 
                  color={status?.tapo.mcp_available ? "success" : "error"} 
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Home Security
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  📹 Connect to Tapo MCP for camera status and home control
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Camera feeds, motion alerts, smart device control
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<LaunchIcon />}
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Open Tapo Dashboard
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{ ml: 1, textTransform: 'none' }}
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Integration Info */}
      <Paper 
        elevation={2} 
        sx={{ 
          mt: 3, 
          p: 3, 
          bgcolor: 'primary.light', 
          color: 'white' 
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600}>
          🌐 Integration Status
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.95, mb: 2 }}>
          Connect your existing services to create a unified personal command center
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">
              Plex: {status?.plex.connected ? '✅ Connected' : '❌ Not connected'}
              {status?.plex.mcp_available && ' (MCP)'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">
              Calibre: {status?.calibre.connected ? '✅ Connected' : '❌ Not connected'}
              {status?.calibre.mcp_available && ' (MCP)'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">
              Immich: {status?.immich.connected ? '✅ Connected' : '❌ Not connected'}
              {status?.immich.mcp_available && ' (MCP)'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">
              Tapo: {status?.tapo.connected ? '✅ Connected' : '❌ Not connected'}
              {status?.tapo.mcp_available && ' (MCP)'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Configuration Guide */}
      <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          📖 Configuration Guide
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          To integrate your media and home services:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" color="text.secondary">
            Add service URLs to <code>backend/.env</code>
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Configure API keys/tokens for each service
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Ensure Tailscale access to Goliath server
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Test connections from backend
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          See <strong>ECOSYSTEM_INTEGRATION.md</strong> for detailed implementation plan
        </Typography>
      </Paper>
    </Box>
  );
}

