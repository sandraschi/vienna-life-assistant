import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Public as PublicIcon,
  AccountCircle as AvatarIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`virtual-worlds-tabpanel-${index}`}
      aria-labelledby={`virtual-worlds-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `virtual-worlds-tab-${index}`,
    'aria-controls': `virtual-worlds-tabpanel-${index}`,
  };
}

const VirtualWorlds: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [vrchatStatus, setVrchatStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [avatarStatus, setAvatarStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAddAvatarDialog, setOpenAddAvatarDialog] = useState(false);
  const [newAvatarName, setNewAvatarName] = useState('');
  const [newAvatarId, setNewAvatarId] = useState('');
  const [avatars, setAvatars] = useState<any[]>([]);

  // Placeholder for API calls to vrchat-mcp and avatar-mcp
  const checkConnectionStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would check status via MCP APIs
      // For now, simulate connection checks
      setTimeout(() => {
        setVrchatStatus('connected');
        setAvatarStatus('connected');
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError('Failed to check connection status. Ensure vrchat-mcp and avatar-mcp are running.');
      setVrchatStatus('disconnected');
      setAvatarStatus('disconnected');
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const handleSubTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveSubTab(newValue);
  };

  const handleOpenAddAvatar = () => {
    setOpenAddAvatarDialog(true);
  };

  const handleCloseAddAvatar = () => {
    setOpenAddAvatarDialog(false);
    setNewAvatarName('');
    setNewAvatarId('');
  };

  const handleAddAvatar = () => {
    if (newAvatarName && newAvatarId) {
      alert(`Adding avatar: ${newAvatarName} with ID ${newAvatarId}. (Action via avatar-mcp)`);
      // In a real implementation, call avatar-mcp API to add avatar
      setAvatars([...avatars, {
        id: newAvatarId,
        name: newAvatarName,
        status: 'Available',
        lastUsed: 'Never'
      }]);
      handleCloseAddAvatar();
    } else {
      alert('Please enter avatar name and ID.');
    }
  };

  const handleLoadAvatar = (avatarId: string) => {
    alert(`Loading avatar ${avatarId}. (Action via avatar-mcp)`);
    // In a real implementation, call vrchat-mcp to load avatar
  };

  const handleDeleteAvatar = (avatarId: string) => {
    alert(`Deleting avatar ${avatarId}. (Action via avatar-mcp)`);
    setAvatars(avatars.filter(avatar => avatar.id !== avatarId));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        🌐 Virtual Worlds
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Manage your VRChat avatars, social interactions, and virtual world experiences.
        Powered by `vrchat-mcp` and `avatar-mcp` for seamless integration.
      </Typography>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={activeSubTab}
          onChange={handleSubTabChange}
          aria-label="Virtual Worlds sub-tabs"
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { textTransform: 'none' }
          }}
        >
          <Tab label="Avatar Control" icon={<AvatarIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Social Features" icon={<PeopleIcon />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="World Management" icon={<PublicIcon />} iconPosition="start" {...a11yProps(2)} />
          <Tab label="VRChat Settings" icon={<SettingsIcon />} iconPosition="start" {...a11yProps(3)} />
        </Tabs>
      </Paper>

      <TabPanel value={activeSubTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              🎭 Avatar Control & Management
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Integrated with avatar-mcp and vrchat-mcp</AlertTitle>
              <Typography variant="body2">
                This section provides comprehensive avatar management, including VRM 2.0 support,
                advanced animation and bone control, morph target control, and Unity desktop integration.
                Powered by the `avatar-mcp` and `vrchat-mcp` services.
              </Typography>
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                  onClick={checkConnectionStatus}
                  disabled={loading}
                >
                  {loading ? 'Checking...' : 'Check Status'}
                </Button>
                <Chip
                  label={`VRChat: ${vrchatStatus}`}
                  color={vrchatStatus === 'connected' ? 'success' : 'error'}
                />
                <Chip
                  label={`Avatar MCP: ${avatarStatus}`}
                  color={avatarStatus === 'connected' ? 'success' : 'error'}
                />
              </Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenAddAvatar}
              >
                Add New Avatar
              </Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          </Grid>

          {loading ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Checking MCP connections...</Typography>
            </Grid>
          ) : avatars.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="warning">No avatars configured. Add your first avatar to get started.</Alert>
            </Grid>
          ) : (
            avatars.map((avatar) => (
              <Grid item xs={12} md={6} lg={4} key={avatar.id}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AvatarIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">{avatar.name}</Typography>
                      </Box>
                      <Chip
                        label={avatar.status}
                        color={avatar.status === 'Available' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" paragraph>
                      **ID:** {avatar.id}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      **Last Used:** {avatar.lastUsed}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button size="small" startIcon={<PlayIcon />} onClick={() => handleLoadAvatar(avatar.id)}>Load</Button>
                      <Button size="small" startIcon={<EditIcon />}>Edit</Button>
                      <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteAvatar(avatar.id)}>Delete</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Dialog open={openAddAvatarDialog} onClose={handleCloseAddAvatar}>
          <DialogTitle>Add New Avatar</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Avatar Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newAvatarName}
              onChange={(e) => setNewAvatarName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Avatar ID (VRChat)"
              type="text"
              fullWidth
              variant="outlined"
              value={newAvatarId}
              onChange={(e) => setNewAvatarId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
              You can find the Avatar ID in VRChat's avatar menu or from the VRChat website.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddAvatar}>Cancel</Button>
            <Button onClick={handleAddAvatar} variant="contained">Add Avatar</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      <TabPanel value={activeSubTab} index={1}>
        <Typography variant="h5" gutterBottom>
          👥 Social Features & Interactions
        </Typography>
        <Typography variant="body1" paragraph>
          Manage your social interactions, friend lists, and community features in virtual worlds.
          (Functionality to be implemented using `vrchat-mcp`'s social features).
        </Typography>
        <Alert severity="warning">
          <AlertTitle>Coming Soon</AlertTitle>
          This section will include friend management, world invites, and social analytics.
        </Alert>
      </TabPanel>

      <TabPanel value={activeSubTab} index={2}>
        <Typography variant="h5" gutterBottom>
          🌍 World Management & Exploration
        </Typography>
        <Typography variant="body1" paragraph>
          Discover, bookmark, and manage virtual worlds and experiences.
          (Functionality to be implemented using `vrchat-mcp`'s world discovery tools).
        </Typography>
        <Alert severity="warning">
          <AlertTitle>Coming Soon</AlertTitle>
          This section will feature world bookmarks, visit history, and world recommendations.
        </Alert>
      </TabPanel>

      <TabPanel value={activeSubTab} index={3}>
        <Typography variant="h5" gutterBottom>
          ⚙️ VRChat & Avatar Settings
        </Typography>
        <Typography variant="body1" paragraph>
          Configure OSC settings, avatar parameters, and integration preferences.
          (Functionality to be implemented with direct MCP configuration).
        </Typography>
        <Alert severity="warning">
          <AlertTitle>Coming Soon</AlertTitle>
          This section will provide comprehensive settings for OSC ports, avatar parameters, and MCP integrations.
        </Alert>
        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">`vrchat-mcp` & `avatar-mcp` Integration Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              The Virtual Worlds tab integrates two powerful MCP services:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="`vrchat-mcp`: OSC protocol integration for VRChat control and avatar management" />
              </ListItem>
              <ListItem>
                <ListItemText primary="`avatar-mcp`: Advanced avatar manipulation with VRM 2.0 support, morph targets, and Unity integration" />
              </ListItem>
            </List>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Together, these services provide comprehensive virtual world management and avatar control capabilities.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </TabPanel>
    </Box>
  );
};

export default VirtualWorlds;
