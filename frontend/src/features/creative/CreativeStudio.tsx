import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Tabs,
  Tab,
  Alert,
  Divider,
  AlertTitle
} from '@mui/material';
import {
  Brush as BrushIcon,
  Movie as MovieIcon,
  MusicNote as MusicIcon,
  Palette as PaletteIcon,
  ThreeDRotation as ThreeDIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Code as CodeIcon,
  Launch as LaunchIcon,
  GetApp as GetAppIcon,
  PlayArrow as PlayIcon,
  Create as CreateIcon
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
      id={`creative-tabpanel-${index}`}
      aria-labelledby={`creative-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CreativeStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <BrushIcon sx={{ mr: 2, color: 'primary.main' }} />
        Creative Studio
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        AI-powered creative production hub integrating Blender MCP, GIMP MCP, and multimedia tools
      </Typography>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontSize: '0.875rem',
              fontWeight: 500,
              py: 2,
              minWidth: 120
            },
            '& .Mui-selected': {
              color: 'primary.main',
              fontWeight: 600
            }
          }}
        >
          <Tab icon={<ThreeDIcon />} iconPosition="start" label="3D Modeling" />
          <Tab icon={<PaletteIcon />} iconPosition="start" label="Image Editing" />
          <Tab icon={<MovieIcon />} iconPosition="start" label="Video Production" />
          <Tab icon={<MusicIcon />} iconPosition="start" label="Audio Creation" />
          <Tab icon={<CodeIcon />} iconPosition="start" label="Creative Tools" />
        </Tabs>

        {/* 3D Modeling Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <ThreeDIcon sx={{ mr: 2, color: 'primary.main' }} />
            3D Modeling & Animation Studio
          </Typography>

          <Grid container spacing={3}>
            {/* Blender MCP Integration */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Blender MCP Integration
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    AI-powered 3D modeling, animation, and rendering with Blender MCP integration.
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<LaunchIcon />}
                        sx={{ mb: 1 }}
                      >
                        Open Blender MCP
                      </Button>
                      <Typography variant="caption" color="text.secondary">
                        Launch integrated Blender environment
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<GetAppIcon />}
                        sx={{ mb: 1 }}
                      >
                        Import Models
                      </Button>
                      <Typography variant="caption" color="text.secondary">
                        Import 3D models and assets
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Creative Projects */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Creative Projects
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ThreeDIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Vienna Architectural Models"
                        secondary="3D models of historic Vienna buildings"
                      />
                      <Chip label="In Progress" color="primary" size="small" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <MovieIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Animation Short Film"
                        secondary="Character animation for Vienna tourism"
                      />
                      <Chip label="Planning" color="default" size="small" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PaletteIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="VR Environment Design"
                        secondary="Virtual reality Vienna exploration"
                      />
                      <Chip label="Completed" color="success" size="small" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Tools & Resources */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI-Powered Tools
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip icon={<ThreeDIcon />} label="Mesh Generation" variant="outlined" />
                    <Chip icon={<PaletteIcon />} label="Texture Synthesis" variant="outlined" />
                    <Chip icon={<MovieIcon />} label="Motion Tracking" variant="outlined" />
                    <Chip icon={<CodeIcon />} label="Script Automation" variant="outlined" />
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Asset Library
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Vienna-themed 3D assets and materials
                  </Typography>
                  <Button variant="contained" fullWidth startIcon={<GetAppIcon />}>
                    Browse Asset Library
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Image Editing Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <PaletteIcon sx={{ mr: 2, color: 'primary.main' }} />
            Professional Image Editing Suite
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    GIMP MCP Integration
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Advanced image editing and manipulation with AI assistance.
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<LaunchIcon />}
                    sx={{ mb: 2 }}
                  >
                    Launch GIMP MCP
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    AI-Powered Features:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Smart object selection" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Content-aware fill" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Style transfer" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Background removal" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Vienna Image Projects
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Curated image collections for Vienna tourism and culture.
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<ImageIcon />}>
                        Architecture
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<ImageIcon />}>
                        Street Art
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<ImageIcon />}>
                        Festivals
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<ImageIcon />}>
                        Food & Drink
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Video Production Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <MovieIcon sx={{ mr: 2, color: 'primary.main' }} />
            Video Production & Editing Suite
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Coming Soon</AlertTitle>
            Video production tools integrating with your media library and AI editing capabilities.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <VideoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Video Editing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-powered video editing and post-production.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <MovieIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Motion Graphics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create animated graphics and visual effects.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PlayIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Vienna Documentaries
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Produce promotional videos for Vienna tourism.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Audio Creation Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <MusicIcon sx={{ mr: 2, color: 'primary.main' }} />
            Audio Production & Music Creation
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>OSC MCP Integration</AlertTitle>
            Audio production tools using OSC MCP for music synthesis and audio processing.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Music Synthesis & Production
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create original music and soundtracks using AI-powered synthesis.
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<MusicIcon />}
                    sx={{ mb: 2 }}
                  >
                    Launch OSC MCP Audio
                  </Button>

                  <Typography variant="subtitle2" gutterBottom>
                    Vienna-Inspired Genres:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="Classical Vienna" variant="outlined" />
                    <Chip label="Electronic Danube" variant="outlined" />
                    <Chip label="Jazz & Cabaret" variant="outlined" />
                    <Chip label="Opera Synthesis" variant="outlined" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Audio Projects
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Audio content for Vienna tourism and cultural promotion.
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Vienna Walking Tours"
                        secondary="Audio guides for tourist attractions"
                      />
                      <Chip label="In Progress" color="primary" size="small" />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Classical Music Podcasts"
                        secondary="Episodes about Vienna's musical heritage"
                      />
                      <Chip label="Planning" color="default" size="small" />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Opera Highlights"
                        secondary="AI-generated opera performances"
                      />
                      <Chip label="Completed" color="success" size="small" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Creative Tools Tab */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <CodeIcon sx={{ mr: 2, color: 'primary.main' }} />
            Creative Tools & Automation
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Content Generation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Generate creative content for Vienna tourism and cultural projects.
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<CreateIcon />}>
                        Stories
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<CreateIcon />}>
                        Scripts
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<CreateIcon />}>
                        Poetry
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="outlined" fullWidth startIcon={<CreateIcon />}>
                        Marketing
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Project Templates
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Pre-built templates for common creative projects.
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Vienna Tourism Video"
                        secondary="Template for promotional videos"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="3D Museum Models"
                        secondary="Templates for cultural heritage 3D modeling"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Audio Guide Scripts"
                        secondary="Templates for tourist audio content"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="success" sx={{ mt: 3 }}>
            <AlertTitle>Blockbuster Novels? Coming Soon! 📖</AlertTitle>
            AI-powered creative writing tools for generating novels, screenplays, and other long-form content.
            Vienna-themed stories featuring the city's rich history and culture.
          </Alert>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default CreativeStudio;
