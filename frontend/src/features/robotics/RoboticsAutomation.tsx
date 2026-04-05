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
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  SmartToy as RobotIcon,
  ThreeDRotation as ThreeDIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Build as BuildIcon,
  Science as ScienceIcon,
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
      id={`robotics-tabpanel-${index}`}
      aria-labelledby={`robotics-tab-${index}`}
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
    id: `robotics-tab-${index}`,
    'aria-controls': `robotics-tabpanel-${index}`,
  };
}

const RoboticsAutomation: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [roboticsStatus, setRoboticsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [robots, setRobots] = useState<any[]>([]);
  const [automationRules, setAutomationRules] = useState<any[]>([]);
  const [isArmed, setIsArmed] = useState(false);
  const [openAddRobotDialog, setOpenAddRobotDialog] = useState(false);
  const [newRobotName, setNewRobotName] = useState('');
  const [newRobotType, setNewRobotType] = useState('scout');
  const [newRobotPlatform, setNewRobotPlatform] = useState('physical');

  // Placeholder for API calls to robotics-mcp
  const checkRoboticsStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would check status via robotics-mcp API
      // const response = await fetch('/api/robotics-mcp/system/status');
      // const data = await response.json();
      // setRoboticsStatus('connected');
      // Mock data for now
      setTimeout(() => {
        setRoboticsStatus('connected');
        setRobots([
          { id: 'scout_01', name: 'Moorebot Scout', type: 'scout', platform: 'physical', status: 'Online', battery: 85, location: 'Living Room' },
          { id: 'go2_01', name: 'Unitree Go2', type: 'go2', platform: 'physical', status: 'Offline', battery: 0, location: 'Garage' },
          { id: 'unity_scout', name: 'Virtual Scout', type: 'scout', platform: 'virtual', status: 'Online', battery: 'N/A', location: 'Unity Scene' }
        ]);
        setAutomationRules([
          { id: '1', name: 'Motion Detection Patrol', trigger: 'motion_sensor', action: 'patrol_room', enabled: true },
          { id: '2', name: 'Time-based Cleaning', trigger: 'schedule', action: 'clean_kitchen', enabled: false },
          { id: '3', name: 'Door Bell Response', trigger: 'doorbell', action: 'greet_visitor', enabled: true }
        ]);
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError('Failed to connect to robotics system. Ensure robotics-mcp and all dependencies are running.');
      setRoboticsStatus('disconnected');
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkRoboticsStatus();
  }, []);

  const handleSubTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveSubTab(newValue);
  };

  const handleArmSystem = () => {
    setIsArmed(!isArmed);
    alert(`Robotics automation system ${isArmed ? 'disarmed' : 'armed'}. (Action via robotics-mcp)`);
  };

  const handleOpenAddRobot = () => {
    setOpenAddRobotDialog(true);
  };

  const handleCloseAddRobot = () => {
    setOpenAddRobotDialog(false);
    setNewRobotName('');
    setNewRobotType('scout');
    setNewRobotPlatform('physical');
  };

  const handleAddRobot = () => {
    if (newRobotName) {
      alert(`Adding robot: ${newRobotName} (${newRobotType}, ${newRobotPlatform}). (Action via robotics-mcp)`);
      // In a real implementation, call robotics-mcp API to add robot
      setRobots([...robots, {
        id: `${newRobotType}_${robots.length + 1}`,
        name: newRobotName,
        type: newRobotType,
        platform: newRobotPlatform,
        status: 'Initializing...',
        battery: newRobotPlatform === 'virtual' ? 'N/A' : 100,
        location: 'Unknown'
      }]);
      handleCloseAddRobot();
    } else {
      alert('Please enter robot name.');
    }
  };

  const handleControlRobot = (robotId: string, action: string) => {
    alert(`Sending ${action} command to robot ${robotId}. (Action via robotics-mcp)`);
    // In a real implementation, call robotics-mcp API
  };

  const handleToggleRule = (ruleId: string) => {
    setAutomationRules(automationRules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    alert(`Toggling automation rule ${ruleId}. (Action via robotics-mcp)`);
  };

  const handleDeleteRobot = (robotId: string) => {
    alert(`Removing robot ${robotId}. (Action via robotics-mcp)`);
    setRobots(robots.filter(robot => robot.id !== robotId));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        🤖 Robotics & Automation
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Control physical and virtual robots, manage home automation, and orchestrate intelligent robotic workflows.
        Powered by `robotics-mcp` with integrated support for `osc-mcp`, `unity3d-mcp`, `vrchat-mcp`, `avatar-mcp`, `blender-mcp`, and `gimp-mcp`.
      </Typography>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={activeSubTab}
          onChange={handleSubTabChange}
          aria-label="Robotics & Automation sub-tabs"
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { textTransform: 'none' }
          }}
        >
          <Tab label="Robot Control" icon={<RobotIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Automation Rules" icon={<SettingsIcon />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="Virtual Robotics" icon={<ThreeDIcon />} iconPosition="start" {...a11yProps(2)} />
          <Tab label="System Status" icon={<RefreshIcon />} iconPosition="start" {...a11yProps(3)} />
        </Tabs>
      </Paper>

      <TabPanel value={activeSubTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              🎮 Robot Fleet Control
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Integrated with robotics-mcp</AlertTitle>
              <Typography variant="body2">
                Control physical robots (Moorebot Scout, Unitree Go2/G1) and virtual robots through unified interfaces.
                Features ROS bridge integration, LiDAR sensing, and multi-robot coordination.
              </Typography>
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                  onClick={checkRoboticsStatus}
                  disabled={loading}
                >
                  {loading ? 'Checking...' : 'Refresh Status'}
                </Button>
                <Chip
                  label={`Robotics MCP: ${roboticsStatus}`}
                  color={roboticsStatus === 'connected' ? 'success' : 'error'}
                />
              </Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenAddRobot}
              >
                Add New Robot
              </Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          </Grid>

          {loading ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Checking robotics system...</Typography>
            </Grid>
          ) : robots.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="warning">No robots configured. Add your first robot to get started.</Alert>
            </Grid>
          ) : (
            robots.map((robot) => (
              <Grid item xs={12} md={6} lg={4} key={robot.id}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RobotIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">{robot.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={robot.platform}
                          size="small"
                          variant="outlined"
                          color={robot.platform === 'physical' ? 'primary' : 'secondary'}
                        />
                        <Chip
                          label={robot.status}
                          size="small"
                          color={robot.status === 'Online' ? 'success' : 'error'}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" paragraph>
                      **Type:** {robot.type}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      **Battery:** {robot.battery}{robot.platform === 'physical' ? '%' : ''}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      **Location:** {robot.location}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Button size="small" startIcon={<PlayIcon />} onClick={() => handleControlRobot(robot.id, 'move_forward')}>Move</Button>
                      <Button size="small" startIcon={<StopIcon />} onClick={() => handleControlRobot(robot.id, 'stop')}>Stop</Button>
                      <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleControlRobot(robot.id, 'get_status')}>Status</Button>
                      <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteRobot(robot.id)}>Remove</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Dialog open={openAddRobotDialog} onClose={handleCloseAddRobot}>
          <DialogTitle>Add New Robot</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Robot Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newRobotName}
              onChange={(e) => setNewRobotName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Robot Type"
              type="text"
              fullWidth
              variant="outlined"
              value={newRobotType}
              onChange={(e) => setNewRobotType(e.target.value)}
              sx={{ mb: 2 }}
              helperText="e.g., scout, go2, custom"
            />
            <TextField
              margin="dense"
              label="Platform"
              type="text"
              fullWidth
              variant="outlined"
              value={newRobotPlatform}
              onChange={(e) => setNewRobotPlatform(e.target.value)}
              sx={{ mb: 2 }}
              helperText="physical or virtual"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddRobot}>Cancel</Button>
            <Button onClick={handleAddRobot} variant="contained">Add Robot</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      <TabPanel value={activeSubTab} index={1}>
        <Typography variant="h5" gutterBottom>
          ⚙️ Automation Rules & Scheduling
        </Typography>
        <Typography variant="body1" paragraph>
          Create and manage automated robotic workflows, scheduled tasks, and smart home integrations.
          (Functionality to be implemented using `robotics-mcp` automation tools).
        </Typography>
        <Alert severity="warning">
          <AlertTitle>Coming Soon</AlertTitle>
          This section will feature rule-based automation, scheduling, and intelligent robotic workflows.
        </Alert>

        <FormControlLabel
          control={<Switch checked={isArmed} onChange={handleArmSystem} />}
          label={isArmed ? 'Automation Active' : 'Automation Inactive'}
          sx={{ mb: 3 }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rule Name</TableCell>
                <TableCell>Trigger</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Controls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {automationRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.name}</TableCell>
                  <TableCell>{rule.trigger}</TableCell>
                  <TableCell>{rule.action}</TableCell>
                  <TableCell>
                    <Chip
                      label={rule.enabled ? 'Enabled' : 'Disabled'}
                      color={rule.enabled ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.enabled}
                      onChange={() => handleToggleRule(rule.id)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeSubTab} index={2}>
        <Typography variant="h5" gutterBottom>
          ✨ Virtual Robotics & Simulation
        </Typography>
        <Typography variant="body1" paragraph>
          Test and develop robotic behaviors in virtual environments using Unity3D, VRChat, and simulation tools.
          (Functionality to be implemented using `robotics-mcp` virtual robotics integration with `unity3d-mcp`, `vrchat-mcp`, etc.).
        </Typography>
        <Alert severity="warning">
          <AlertTitle>Coming Soon</AlertTitle>
          This section will feature virtual robot spawning, environment loading, and behavior testing.
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ThreeDIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Unity Virtual Robotics</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Spawn and control virtual robots in Unity3D environments for testing and development.
                </Typography>
                <Button variant="outlined" startIcon={<PlayIcon />}>Open Unity Scene</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PublicIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">VRChat Integration</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Test robotic behaviors in social VR environments with avatar integration.
                </Typography>
                <Button variant="outlined" startIcon={<AvatarIcon />}>Connect to VRChat</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeSubTab} index={3}>
        <Typography variant="h5" gutterBottom>
          🔧 Robotics System Status
        </Typography>
        <Typography variant="body1" paragraph>
          Monitor the health and status of all robotics components, MCP server integrations, and automation systems.
          (Functionality to be implemented using `robotics-mcp` system monitoring tools).
        </Typography>
        <Alert severity="warning">
          <AlertTitle>Coming Soon</AlertTitle>
          This section will display comprehensive system status, dependency checks, and diagnostics.
        </Alert>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RefreshIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">MCP Server Dependencies</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  **Required MCP Servers:**
                </Typography>
                <List dense>
                  <ListItem><ListItemText primary="✅ osc-mcp - OSC communication" /></ListItem>
                  <ListItem><ListItemText primary="✅ unity3d-mcp - Unity integration" /></ListItem>
                  <ListItem><ListItemText primary="✅ vrchat-mcp - VRChat integration" /></ListItem>
                  <ListItem><ListItemText primary="✅ avatar-mcp - Avatar management" /></ListItem>
                  <ListItem><ListItemText primary="✅ blender-mcp - 3D modeling" /></ListItem>
                  <ListItem><ListItemText primary="✅ gimp-mcp - Image processing" /></ListItem>
                </List>
                <Button variant="outlined" size="small" startIcon={<RefreshIcon />}>
                  Check Dependencies
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BuildIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">Physical Robot Status</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  **Moorebot Scout:** Coming XMas 2025
                </Typography>
                <Typography variant="body2" paragraph>
                  **Unitree Go2:** Hardware pending
                </Typography>
                <Typography variant="body2" paragraph>
                  **ROS Integration:** Ready for deployment
                </Typography>
                <Button variant="outlined" size="small" startIcon={<ScienceIcon />}>
                  Run Diagnostics
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Accordion sx={{ mt: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">`robotics-mcp` System Architecture</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              The `robotics-mcp` server provides unified control for both physical and virtual robots through MCP server composition:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="`robot_control` - Physical robot movement and sensor integration (ROS 1.4)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="`virtual_robotics` - Unity3D/VRChat virtual robot simulation" />
              </ListItem>
              <ListItem>
                <ListItemText primary="`robot_model` - 3D model creation using blender-mcp + gimp-mcp" />
              </ListItem>
              <ListItem>
                <ListItemText primary="`robotics_system` - Overall system status and health monitoring" />
              </ListItem>
            </List>
            <Typography variant="body2" sx={{ mt: 2 }}>
              This architecture enables seamless testing of robotic behaviors in virtual environments before physical deployment.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </TabPanel>
    </Box>
  );
};

export default RoboticsAutomation;
