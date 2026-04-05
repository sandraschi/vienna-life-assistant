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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Slider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  MusicNote as MusicIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  LibraryMusic as LibraryIcon,
  Equalizer as EqualizerIcon,
  Piano as PianoIcon,
  Audiotrack as TrackIcon,
  GraphicEq as GraphicIcon,
  Tune as TuneIcon
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
      id={`audio-tabpanel-${index}`}
      aria-labelledby={`audio-tab-${index}`}
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
    id: `audio-tab-${index}`,
    'aria-controls': `audio-tabpanel-${index}`,
  };
}

const AudioProduction: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [oscStatus, setOscStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [audioProjects, setAudioProjects] = useState<any[]>([]);
  const [masterVolume, setMasterVolume] = useState(75);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openAddAppDialog, setOpenAddAppDialog] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppPort, setNewAppPort] = useState(9000);
  const [newAppType, setNewAppType] = useState('ableton');

  // Placeholder for API calls to osc-mcp
  const checkOscStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would check status via osc-mcp API
      // const response = await fetch('/api/osc-mcp/health');
      // const data = await response.json();
      // setOscStatus('connected');
      // Mock data for now
      setTimeout(() => {
        setOscStatus('connected');
        setApplications([
          { id: 'ableton', name: 'Ableton Live', type: 'daw', port: 11000, status: 'Running', version: '11.3.1' },
          { id: 'vcv', name: 'VCV Rack', type: 'synthesis', port: 10001, status: 'Running', version: '2.4.1' },
          { id: 'supercollider', name: 'SuperCollider', type: 'synthesis', port: 57120, status: 'Stopped', version: '3.13.0' },
          { id: 'maxmsp', name: 'Max/MSP', type: 'programming', port: 7474, status: 'Running', version: '8.6.1' }
        ]);
        setAudioProjects([
          { id: '1', name: 'Ambient Track', app: 'Ableton Live', duration: '4:32', bpm: 120, status: 'Draft' },
          { id: '2', name: 'Modular Synth Patch', app: 'VCV Rack', duration: '2:15', bpm: 140, status: 'Complete' },
          { id: '3', name: 'Generative Composition', app: 'SuperCollider', duration: '8:47', bpm: 90, status: 'In Progress' }
        ]);
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError('Failed to connect to OSC system. Ensure osc-mcp is running.');
      setOscStatus('disconnected');
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOscStatus();
  }, []);

  const handleSubTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveSubTab(newValue);
  };

  const handleOpenAddApp = () => {
    setOpenAddAppDialog(true);
  };

  const handleCloseAddApp = () => {
    setOpenAddAppDialog(false);
    setNewAppName('');
    setNewAppPort(9000);
    setNewAppType('ableton');
  };

  const handleAddApp = () => {
    if (newAppName && newAppPort) {
      alert(`Adding OSC application: ${newAppName} on port ${newAppPort}. (Action via osc-mcp)`);
      // In a real implementation, call osc-mcp API to configure application
      setApplications([...applications, {
        id: newAppType + '_' + applications.length,
        name: newAppName,
        type: newAppType,
        port: newAppPort,
        status: 'Configuring...',
        version: 'Unknown'
      }]);
      handleCloseAddApp();
    } else {
      alert('Please enter application name and port.');
    }
  };

  const handleControlApp = (appId: string, action: string) => {
    const app = applications.find(a => a.id === appId);
    alert(`Sending ${action} command to ${app?.name}. (Action via osc-mcp)`);
    // In a real implementation, call osc-mcp API
  };

  const handleTransportControl = (action: string) => {
    if (action === 'play') {
      setIsPlaying(true);
      setIsRecording(false);
    } else if (action === 'stop') {
      setIsPlaying(false);
      setIsRecording(false);
    } else if (action === 'record') {
      setIsRecording(!isRecording);
      setIsPlaying(false);
    }
    alert(`Transport ${action} command sent to all connected applications. (Action via osc-mcp)`);
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    const volume = newValue as number;
    setMasterVolume(volume);
    // In a real implementation, send OSC volume command
    alert(`Master volume set to ${volume}%. (Action via osc-mcp)`);
  };

  const handleDeleteApp = (appId: string) => {
    alert(`Removing OSC application ${appId}. (Action via osc-mcp)`);
    setApplications(applications.filter(app => app.id !== appId));
  };

  const getAppIcon = (type: string) => {
    switch (type) {
      case 'daw': return <MusicIcon />;
      case 'synthesis': return <EqualizerIcon />;
      case 'programming': return <TuneIcon />;
      default: return <TrackIcon />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        🎵 Audio Production
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Professional audio production and synthesis with OSC control of Ableton Live, VCV Rack, SuperCollider, and more.
        Powered by `osc-mcp` for seamless integration with creative audio tools.
      </Typography>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={activeSubTab}
          onChange={handleSubTabChange}
          aria-label="Audio Production sub-tabs"
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { textTransform: 'none' }
          }}
        >
          <Tab label="OSC Applications" icon={<TrackIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Transport Control" icon={<PlayIcon />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="Audio Projects" icon={<LibraryIcon />} iconPosition="start" {...a11yProps(2)} />
          <Tab label="MIDI & Synthesis" icon={<PianoIcon />} iconPosition="start" {...a11yProps(3)} />
        </Tabs>
      </Paper>

      <TabPanel value={activeSubTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              🎛️ OSC-Controlled Applications
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Integrated with osc-mcp</AlertTitle>
              <Typography variant="body2">
                Control professional audio applications through OSC (Open Sound Control) protocol.
                Supports Ableton Live, VCV Rack, SuperCollider, Max/MSP, and other OSC-enabled audio tools.
              </Typography>
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                  onClick={checkOscStatus}
                  disabled={loading}
                >
                  {loading ? 'Checking...' : 'Check OSC Status'}
                </Button>
                <Chip
                  label={`OSC MCP: ${oscStatus}`}
                  color={oscStatus === 'connected' ? 'success' : 'error'}
                />
              </Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenAddApp}
              >
                Add OSC Application
              </Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          </Grid>

          {loading ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Checking OSC connections...</Typography>
            </Grid>
          ) : applications.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="warning">No OSC applications configured. Add your first audio application to get started.</Alert>
            </Grid>
          ) : (
            applications.map((app) => (
              <Grid item xs={12} md={6} lg={3} key={app.id}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getAppIcon(app.type)}
                        <Typography variant="h6" sx={{ ml: 1 }}>{app.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={app.type}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={app.status}
                          size="small"
                          color={app.status === 'Running' ? 'success' : 'default'}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" paragraph>
                      **Port:** {app.port}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      **Version:** {app.version}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Button size="small" startIcon={<PlayIcon />} onClick={() => handleControlApp(app.id, 'play')}>Play</Button>
                      <Button size="small" startIcon={<StopIcon />} onClick={() => handleControlApp(app.id, 'stop')}>Stop</Button>
                      <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleControlApp(app.id, 'status')}>Status</Button>
                      <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteApp(app.id)}>Remove</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Dialog open={openAddAppDialog} onClose={handleCloseAddApp}>
          <DialogTitle>Add OSC Application</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Application Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="OSC Port"
              type="number"
              fullWidth
              variant="outlined"
              value={newAppPort}
              onChange={(e) => setNewAppPort(parseInt(e.target.value) || 9000)}
              sx={{ mb: 2 }}
              helperText="Default ports: Ableton Live (11000), VCV Rack (10001), SuperCollider (57120)"
            />
            <TextField
              margin="dense"
              label="Application Type"
              type="text"
              fullWidth
              variant="outlined"
              value={newAppType}
              onChange={(e) => setNewAppType(e.target.value)}
              sx={{ mb: 2 }}
              helperText="e.g., ableton, vcv, supercollider, maxmsp"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddApp}>Cancel</Button>
            <Button onClick={handleAddApp} variant="contained">Add Application</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      <TabPanel value={activeSubTab} index={1}>
        <Typography variant="h5" gutterBottom>
          🎚️ Transport & Master Control
        </Typography>
        <Typography variant="body1" paragraph>
          Unified transport control across all connected OSC applications with master volume and recording capabilities.
          (Functionality to be implemented using `osc-mcp`'s `audio_workflow_manager` and transport tools).
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Transport Controls</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PlayIcon />}
                    onClick={() => handleTransportControl('play')}
                    disabled={isPlaying}
                    size="large"
                  >
                    Play All
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<StopIcon />}
                    onClick={() => handleTransportControl('stop')}
                    disabled={!isPlaying && !isRecording}
                    size="large"
                  >
                    Stop All
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isRecording}
                        onChange={() => handleTransportControl('record')}
                        color="error"
                      />
                    }
                    label="Record"
                  />
                </Box>

                <Typography variant="h6" gutterBottom>Master Volume</Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={masterVolume}
                    onChange={handleVolumeChange}
                    aria-labelledby="master-volume-slider"
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Status</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip
                    label={isPlaying ? 'Playing' : 'Stopped'}
                    color={isPlaying ? 'success' : 'default'}
                    variant={isPlaying ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label={isRecording ? 'Recording' : 'Not Recording'}
                    color={isRecording ? 'error' : 'default'}
                    variant={isRecording ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label={`Volume: ${masterVolume}%`}
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mt: 4 }}>
          <AlertTitle>Multi-Application Sync</AlertTitle>
          <Typography variant="body2">
            The `osc-mcp` service can synchronize transport controls across multiple applications simultaneously,
            ensuring perfect timing for complex audio production workflows.
          </Typography>
        </Alert>
      </TabPanel>

      <TabPanel value={activeSubTab} index={2}>
        <Typography variant="h5" gutterBottom>
          📁 Audio Projects
        </Typography>
        <Typography variant="body1" paragraph>
          Manage and organize your audio production projects across different applications.
          (Functionality to be implemented using `osc-mcp`'s project management tools).
        </Typography>
        <Alert severity="warning">
          <AlertTitle>Coming Soon</AlertTitle>
          This section will feature project organization, version control, and cross-application project management.
        </Alert>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Name</TableCell>
                <TableCell>Application</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>BPM</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {audioProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.app}</TableCell>
                  <TableCell>{project.duration}</TableCell>
                  <TableCell>{project.bpm}</TableCell>
                  <TableCell>
                    <Chip
                      label={project.status}
                      size="small"
                      color={
                        project.status === 'Complete' ? 'success' :
                        project.status === 'In Progress' ? 'warning' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Open">
                      <IconButton size="small">
                        <PlayIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeSubTab} index={3}>
        <Typography variant="h5" gutterBottom>
          🎹 MIDI & Synthesis
        </Typography>
        <Typography variant="body1" paragraph>
          Control MIDI devices, modular synthesizers, and generative music systems.
          (Functionality to be implemented using `osc-mcp`'s `vcv_manager` and MIDI tools).
        </Typography>
        <Alert severity="warning">
          <AlertTitle>Coming Soon</AlertTitle>
          This section will feature VCV Rack control, MIDI routing, and generative synthesis workflows.
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EqualizerIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">VCV Rack Control</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Control modular synthesizer parameters, MIDI notes, and CV signals through OSC.
                </Typography>
                <Button variant="outlined" startIcon={<TuneIcon />}>Open VCV Interface</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PianoIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">MIDI Routing</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Route MIDI signals between applications and hardware devices.
                </Typography>
                <Button variant="outlined" startIcon={<GraphicIcon />}>Configure MIDI</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <Accordion sx={{ mt: 4 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">`osc-mcp` Audio Production Features</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            The `osc-mcp` service provides comprehensive audio production control through 19 tools:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="`ableton_manager` - Complete Ableton Live DAW control (playback, mixing, clip triggering)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="`vcv_manager` - VCV Rack modular synthesis (MIDI, CV, parameters, 18+ operations)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="`supercollider_manager` - SuperCollider audio synthesis (synths, nodes, controls)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="`maxmsp_manager` - Max/MSP audio/visual programming" />
            </ListItem>
            <ListItem>
              <ListItemText primary="`audio_workflow_manager` - Multi-app orchestration and sync" />
            </ListItem>
          </List>
          <Typography variant="body2" sx={{ mt: 2 }}>
            These tools enable professional audio production workflows through natural language commands and bidirectional OSC communication.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AudioProduction;
