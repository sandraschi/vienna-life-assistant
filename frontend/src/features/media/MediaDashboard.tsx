import { Box, Grid, Paper, Typography, Button, Card, CardContent, Chip, Divider } from '@mui/material';
import {
  PlayArrow as PlexIcon,
  MenuBook as CalibreIcon,
  Photo as ImmichIcon,
  Videocam as TapoIcon,
  OpenInNew as LaunchIcon,
} from '@mui/icons-material';

export default function MediaDashboard() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Media & Home Control
      </Typography>

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
                </Box>
                <Chip label="50k+ items" size="small" color="warning" />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Continue Watching
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  📺 Connect to Plex to see your continue watching queue
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  50,000 anime episodes + 5,000 Western movies ready
                </Typography>
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
                </Box>
                <Chip label="15k ebooks" size="small" color="success" />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Currently Reading
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  📚 Connect to Calibre to see your reading progress
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  15,000 ebooks in your library
                </Typography>
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
                </Box>
                <Chip label="Photos" size="small" color="info" />
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
                </Box>
                <Chip label="Cameras" size="small" color="error" />
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
            <Typography variant="caption">Plex: Not configured</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">Calibre: Not configured</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">Immich: Not configured</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption">Tapo: Not configured</Typography>
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

