import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Launch as LaunchIcon,
  Security as SecurityIcon,
  Videocam as CameraIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  DeviceThermostat as ThermostatIcon,
  Lightbulb as LightIcon,
  DoorFront as DoorIcon,
  Analytics as AnalyticsIcon
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
      id={`security-tabpanel-${index}`}
      aria-labelledby={`security-tab-${index}`}
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
    id: `security-tab-${index}`,
    'aria-controls': `security-tabpanel-${index}`,
  };
}

const HomeSecurity: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [camerasEnabled, setCamerasEnabled] = useState(true);
  const [motionDetection, setMotionDetection] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  const [recordingDialogOpen, setRecordingDialogOpen] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<string | null>(null);

  const handleSubTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveSubTab(newValue);
  };

  const handleStartRecording = (cameraName: string) => {
    setCurrentRecording(cameraName);
    setRecordingDialogOpen(true);
    // Simulate recording for 5 seconds
    setTimeout(() => {
      setRecordingDialogOpen(false);
      setCurrentRecording(null);
    }, 5000);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        🏠 Home Security Dashboard
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Comprehensive home surveillance and security monitoring powered by tapo-camera-mcp.
        Monitor cameras, sensors, and receive real-time alerts from your security ecosystem.
      </Typography>

      {/* Status Overview */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6">All Systems</Typography>
              <Typography variant="h4" color="success.main">SECURE</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'info.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CameraIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6">Cameras</Typography>
              <Typography variant="h4" color="info.main">4 ACTIVE</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6">Alerts Today</Typography>
              <Typography variant="h4" color="warning.main">2</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'secondary.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AnalyticsIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h6">Storage Used</Typography>
              <Typography variant="h4" color="secondary.main">67%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={activeSubTab}
          onChange={handleSubTabChange}
          aria-label="Home Security sub-tabs"
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { textTransform: 'none' }
          }}
        >
          <Tab label="Live Monitoring" icon={<CameraIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Device Control" icon={<SettingsIcon />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="Security Settings" icon={<SecurityIcon />} iconPosition="start" {...a11yProps(2)} />
          <Tab label="Alerts & Events" icon={<NotificationsIcon />} iconPosition="start" {...a11yProps(3)} />
        </Tabs>
      </Paper>

      <TabPanel value={activeSubTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              📹 Live Camera Feeds
            </Typography>
            <Typography variant="body1" paragraph>
              Real-time monitoring of all connected security cameras and sensors.
            </Typography>
          </Grid>

          {/* Camera Grid */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CameraIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Front Door Camera</Typography>
                  </Box>
                  <Chip label="Online" color="success" size="small" />
                </Box>
                <Box
                  sx={{
                    height: 200,
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    mb: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Live Feed - Front Door
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PlayIcon />}
                    onClick={() => handleStartRecording('Front Door')}
                  >
                    Record
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<RefreshIcon />}>
                    Refresh
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CameraIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Backyard Camera</Typography>
                  </Box>
                  <Chip label="Recording" color="warning" size="small" />
                </Box>
                <Box
                  sx={{
                    height: 200,
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    mb: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Live Feed - Backyard
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<StopIcon />}
                    color="error"
                  >
                    Stop Recording
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<RefreshIcon />}>
                    Refresh
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>
              🏠 Smart Home Integration
            </Typography>
            <Typography variant="body1" paragraph>
              Connected sensors and smart devices integrated with your security system.
            </Typography>
          </Grid>

          {/* Smart Devices */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DoorIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Front Door Sensor</Typography>
                  </Box>
                  <Chip label="Closed" color="success" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Last activity: 2 hours ago
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ThermostatIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Temperature Sensor</Typography>
                  </Box>
                  <Chip label="22°C" color="info" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Humidity: 45% | Status: Normal
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LightIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Security Lights</Typography>
                  </Box>
                  <Chip label="Auto" color="secondary" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Motion-activated | Battery: 85%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeSubTab} index={1}>
        <Typography variant="h5" gutterBottom>
          🎛️ Device Control Center
        </Typography>
        <Typography variant="body1" paragraph>
          Control and configure all your security devices and sensors.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📹 Camera Controls
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Front Door Camera" secondary="TP-Link Tapo C200" />
                    <Button size="small" variant="outlined">Configure</Button>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Backyard Camera" secondary="TP-Link Tapo C210" />
                    <Button size="small" variant="outlined">Configure</Button>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Garage Camera" secondary="USB Webcam" />
                    <Button size="small" variant="outlined">Configure</Button>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Living Room Camera" secondary="Ring Indoor Cam" />
                    <Button size="small" variant="outlined">Configure</Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🏠 Smart Device Controls
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Front Door Lock" secondary="Smart Lock Pro" />
                    <Button size="small" variant="outlined">Unlock</Button>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Security System" secondary="ADT Integration" />
                    <Button size="small" variant="outlined">Arm</Button>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Smoke Detectors" secondary="Nest Protect (2 units)" />
                    <Button size="small" variant="outlined">Test</Button>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Carbon Monoxide" secondary="Nest Protect (2 units)" />
                    <Button size="small" variant="outlined">Test</Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🔧 Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="contained" startIcon={<RefreshIcon />}>
                    Refresh All Devices
                  </Button>
                  <Button variant="outlined" startIcon={<SettingsIcon />}>
                    System Configuration
                  </Button>
                  <Button variant="outlined" startIcon={<AnalyticsIcon />}>
                    View Device Logs
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<LaunchIcon />}
                    onClick={() => window.open('http://localhost:7777', '_blank')}
                  >
                    Open Full Dashboard
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeSubTab} index={2}>
        <Typography variant="h5" gutterBottom>
          🔒 Security Settings
        </Typography>
        <Typography variant="body1" paragraph>
          Configure security preferences, automation rules, and alert settings.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📷 Camera Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={camerasEnabled}
                        onChange={(e) => setCamerasEnabled(e.target.checked)}
                      />
                    }
                    label="Enable All Cameras"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={motionDetection}
                        onChange={(e) => setMotionDetection(e.target.checked)}
                      />
                    }
                    label="Motion Detection"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={nightMode}
                        onChange={(e) => setNightMode(e.target.checked)}
                      />
                    }
                    label="Night Vision Mode"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🔔 Alert Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={alertsEnabled}
                        onChange={(e) => setAlertsEnabled(e.target.checked)}
                      />
                    }
                    label="Push Notifications"
                  />
                  <TextField
                    label="Alert Email"
                    type="email"
                    size="small"
                    defaultValue="security@example.com"
                    fullWidth
                  />
                  <TextField
                    label="Emergency Contact"
                    type="tel"
                    size="small"
                    defaultValue="+43 123 456789"
                    fullWidth
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🤖 Automation Rules
                </Typography>
                <Typography variant="body2" paragraph>
                  Set up automated responses to security events.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Motion Detected → Turn on lights"
                      secondary="Activates security lights when motion is detected"
                    />
                    <Chip label="Active" color="success" size="small" />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Door opened after hours → Send alert"
                      secondary="Sends notification when door opens outside normal hours"
                    />
                    <Chip label="Active" color="success" size="small" />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Smoke detected → Activate alarm"
                      secondary="Triggers full alarm system when smoke is detected"
                    />
                    <Chip label="Active" color="success" size="small" />
                  </ListItem>
                </List>
                <Button variant="outlined" startIcon={<SettingsIcon />} sx={{ mt: 2 }}>
                  Configure Rules
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeSubTab} index={3}>
        <Typography variant="h5" gutterBottom>
          🚨 Security Alerts & Events
        </Typography>
        <Typography variant="body1" paragraph>
          Recent security events, alerts, and system notifications.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle>Recent Activity</AlertTitle>
              <Typography variant="body2">
                2 motion events detected in the last 24 hours. All systems operating normally.
              </Typography>
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📋 Event Log
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Event</TableCell>
                        <TableCell>Device</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>14:32</TableCell>
                        <TableCell>Motion Detected</TableCell>
                        <TableCell>Backyard Camera</TableCell>
                        <TableCell>
                          <Chip label="Recorded" color="warning" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>12:15</TableCell>
                        <TableCell>Door Opened</TableCell>
                        <TableCell>Front Door Sensor</TableCell>
                        <TableCell>
                          <Chip label="Normal" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>09:47</TableCell>
                        <TableCell>System Check</TableCell>
                        <TableCell>All Devices</TableCell>
                        <TableCell>
                          <Chip label="Passed" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>08:30</TableCell>
                        <TableCell>Motion Detected</TableCell>
                        <TableCell>Front Door Camera</TableCell>
                        <TableCell>
                          <Chip label="False Alarm" color="info" size="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>
              📊 Security Analytics
            </Typography>
            <Typography variant="body1" paragraph>
              Statistics and insights from your security system.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main">47</Typography>
                <Typography variant="body2" color="text.secondary">
                  Events This Month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">98.5%</Typography>
                <Typography variant="body2" color="text.secondary">
                  System Uptime
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">2.3GB</Typography>
                <Typography variant="body2" color="text.secondary">
                  Storage Used (Video)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Recording Dialog */}
      <Dialog open={recordingDialogOpen} onClose={() => setRecordingDialogOpen(false)}>
        <DialogTitle>🎥 Recording in Progress</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
            <CircularProgress size={24} />
            <Typography>
              Recording from {currentRecording} camera...
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecordingDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomeSecurity;












