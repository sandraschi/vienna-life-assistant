import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Tabs,
  Tab,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Launch as LaunchIcon,
  LibraryBooks as LibraryIcon,
  MusicNote as MusicIcon,
  TheaterComedy as TheaterIcon,
  Piano as PianoIcon,
  Link as LinkIcon,
  Notes as NotesIcon,
  Search as SearchIcon,
  Gamepad as GameIcon,
  Home as HomeIcon,
  Train as TrainIcon,
  Psychology as AIIcon,
  Article as ArticleIcon
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
      id={`kb-tabpanel-${index}`}
      aria-labelledby={`kb-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const KnowledgeBase: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
        🧠 Vienna Knowledge Base
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Your personal knowledge management hub for Vienna research, cultural insights,
        and integrated access to all your MCP-powered applications.
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none'
            }
          }}
        >
          <Tab icon={<LibraryIcon />} iconPosition="start" label="Research Notes" />
          <Tab icon={<TheaterIcon />} iconPosition="start" label="Classical Music & Theater" />
          <Tab icon={<LinkIcon />} iconPosition="start" label="MCP Integrations" />
          <Tab icon={<NotesIcon />} iconPosition="start" label="Quick Access" />
        </Tabs>
      </Paper>

      {/* Research Notes Tab */}
      <TabPanel value={activeTab} index={0}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          📝 Personal Research & Notes (Advanced Memory MCP)
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Vienna Cultural Research
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Document your discoveries about Vienna's rich cultural heritage,
                  from Habsburg history to contemporary art scenes.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="History" size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Culture" size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Architecture" size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Art" size="small" />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="http://localhost:3060" // MyAI Dashboard with MCP server
                  target="_blank"
                  fullWidth
                >
                  Open Advanced Memory MCP
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Travel Planning Notes
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Keep detailed notes on your Vienna travel experiences,
                  restaurant discoveries, and hidden gems.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="Travel" size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Food" size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Local Tips" size="small" />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<SearchIcon />}
                  fullWidth
                >
                  Search My Notes
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  📚 Advanced Memory Features
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Your knowledge base supports bidirectional conversion between zettelkasten notes and Claude Skills format,
                  semantic search, and automatic entity linking.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">📝</Typography>
                      <Typography variant="subtitle2">Zettelkasten Notes</Typography>
                      <Typography variant="caption">Atomic knowledge units</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">🎯</Typography>
                      <Typography variant="subtitle2">Claude Skills</Typography>
                      <Typography variant="caption">AI agent capabilities</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">🔍</Typography>
                      <Typography variant="subtitle2">Semantic Search</Typography>
                      <Typography variant="caption">Find by meaning</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">🔗</Typography>
                      <Typography variant="subtitle2">Entity Linking</Typography>
                      <Typography variant="caption">Auto-connect concepts</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Classical Music Tab */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          🎼 Vienna Classical Music & Theater Scene
        </Typography>

        <Grid container spacing={3}>
          {/* Vienna's Two Opera Houses */}
          <Grid item xs={12}>
            <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
              🎭 Vienna's Two Opera Houses
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TheaterIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Staatsoper (State Opera)</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Vienna's premier opera house since 1869. Home to the Vienna State Opera
                  and the Vienna Philharmonic Orchestra. World-renowned for opera and ballet productions.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Address:</strong> Opernring 2, 1010 Vienna
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Highlights:</strong> Traditional repertoire, standing room tickets (€3-€5),
                  guided tours available.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="https://www.wiener-staatsoper.at/"
                  target="_blank"
                  fullWidth
                >
                  Visit Staatsoper
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TheaterIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">Volksoper (People's Opera)</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Vienna's "second" opera house, focusing on operetta and lighter repertoire.
                  More affordable tickets and a more relaxed atmosphere than the Staatsoper.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Address:</strong> Währinger Straße 78, 1090 Vienna
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Highlights:</strong> Operetta classics, ballet performances,
                  student discounts available.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="https://www.volksoper.at/"
                  target="_blank"
                  fullWidth
                >
                  Visit Volksoper
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Vienna's Two Concert Halls */}
          <Grid item xs={12}>
            <Typography variant="h6" color="secondary" sx={{ mt: 3, mb: 2 }}>
              🎹 Vienna's Two Major Concert Halls
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PianoIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Musikverein (Golden Hall)</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Home to the Vienna Philharmonic's New Year's Concert. One of the world's
                  most acoustically perfect concert halls, built in 1870.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Address:</strong> Musikvereinsplatz 1, 1010 Vienna
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Highlights:</strong> Vienna Philharmonic concerts, chamber music,
                  architectural tours available.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="https://www.musikverein.at/"
                  target="_blank"
                  fullWidth
                >
                  Visit Musikverein
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PianoIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">Konzerthaus Vienna</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Modern counterpart to Musikverein, opened in 1913. Hosts contemporary
                  classical music, jazz, and world music performances.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Address:</strong> Lothringerstraße 20, 1030 Vienna
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Highlights:</strong> Wiener Konzerthaus Quartett, contemporary works,
                  youth concerts and education programs.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="https://www.konzerthaus.at/"
                  target="_blank"
                  fullWidth
                >
                  Visit Konzerthaus
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Vienna's Major Theaters */}
          <Grid item xs={12}>
            <Typography variant="h6" color="secondary" sx={{ mt: 3, mb: 2 }}>
              🎭 Vienna's Major Theater Houses
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TheaterIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Burgtheater (National Theater)</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Austria's national theater since 1776. Premier venue for German-language theater,
                  featuring classical and contemporary plays by Austrian and international playwrights.
                  Home to the Burgtheater ensemble.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Address:</strong> Universitätsring 2, 1010 Vienna
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Highlights:</strong> Classical Austrian repertoire, premieres of contemporary works,
                  standing room tickets available, architectural tours.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Season Focus:</Typography>
                  <Chip label="Classical Drama" size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Contemporary Austrian" size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="International Premieres" size="small" />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="https://www.burgtheater.at/"
                  target="_blank"
                  fullWidth
                >
                  Visit Burgtheater
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TheaterIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">Volkstheater (People's Theater)</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Vienna's "people's theater" focusing on accessible, contemporary theater.
                  More affordable than Burgtheater with diverse programming including musicals,
                  comedies, and socially relevant plays.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Address:</strong> Neustiftgasse 1, 1070 Vienna
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Highlights:</strong> Contemporary Austrian plays, musical theater,
                  youth programs, student discounts, relaxed atmosphere.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Programming Style:</Typography>
                  <Chip label="Contemporary" size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Accessible" size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Social Issues" size="small" />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="https://www.volkstheater.at/"
                  target="_blank"
                  fullWidth
                >
                  Visit Volkstheater
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Notable Smaller Theaters */}
          <Grid item xs={12}>
            <Typography variant="h6" color="secondary" sx={{ mt: 3, mb: 2 }}>
              🎪 Notable Smaller Theaters & Stages
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Schloss Schönbrunn Theater</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Historic theater in Schönbrunn Palace. Features classical plays and Mozart operas
                  in an authentic 18th-century setting.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Location:</strong> Schönbrunner Schloßstraße 47, 1130 Vienna
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="https://www.schoenbrunn.at/en/palace-gardens/theatre/"
                  target="_blank"
                  size="small"
                  fullWidth
                >
                  Visit Website
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Wiener Kammerspiele</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Intimate theater focusing on contemporary and experimental works.
                  Known for productions and Austrian playwrights.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Location:</strong> Fleischmarkt 24, 1010 Vienna
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="https://www.kammerspiele.at/"
                  target="_blank"
                  size="small"
                  fullWidth
                >
                  Visit Website
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Theater in der Josefstadt</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Historic theater in the Josefstadt district. Classic repertoire with
                  modern interpretations, known for high-quality productions.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Location:</strong> Josefstädter Straße 26, 1080 Vienna
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="https://www.josefstadt.org/"
                  target="_blank"
                  size="small"
                  fullWidth
                >
                  Visit Website
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Program Scraping & Data Integration */}
          <Grid item xs={12}>
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🔄 Program Data Integration
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Theater programs are automatically scraped from official sources and theater websites.
                  Data includes current productions, upcoming premieres, and ticket availability.
                </Typography>

                <Alert severity="info" sx={{ mb: 2 }}>
                  <AlertTitle>🤖 Automated Program Updates</AlertTitle>
                  <Typography variant="body2">
                    Using web scraping tools to fetch current theater schedules from:
                    <br />• Burgtheater.at - Official program calendar
                    <br />• Volkstheater.at - Current season overview
                    <br />• Theater websites - Real-time availability
                    <br />• Public cultural calendars - Event aggregators
                  </Typography>
                </Alert>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                      <Typography variant="h6">📅</Typography>
                      <Typography variant="subtitle2">Current Programs</Typography>
                      <Typography variant="caption">Live season schedules</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                      <Typography variant="h6">🎫</Typography>
                      <Typography variant="subtitle2">Ticket Availability</Typography>
                      <Typography variant="caption">Real-time booking status</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                      <Typography variant="h6">🔄</Typography>
                      <Typography variant="subtitle2">Auto Updates</Typography>
                      <Typography variant="caption">Daily program refresh</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Current Season Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  📅 2025/26 Season Highlights - Music & Theater
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Vienna's cultural calendar combines classical music with theater productions.
                  Programs are automatically updated from official sources and theater websites.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="primary">🎼 Classical Music - January - June</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Vienna Philharmonic New Year's Concert (Musikverein)" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Staatsoper opera season continues" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Wiener Konzerthaus chamber concerts" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Spring Festival orchestral programs" />
                      </ListItem>
                    </List>

                    <Typography variant="subtitle2" color="secondary" sx={{ mt: 2 }}>🎭 Theater - January - June</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Burgtheater classical repertoire season" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Volkstheater contemporary premieres" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Wiener Festwochen theater productions" />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="primary">🎼 Classical Music - July - December</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Salzburg Festival spillover events" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Volksoper summer operetta season" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Christmas concerts and holiday programs" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Advent chamber music series" />
                      </ListItem>
                    </List>

                    <Typography variant="subtitle2" color="secondary" sx={{ mt: 2 }}>🎭 Theater - July - December</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Burgtheater summer Shakespeare festival" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Volkstheater open-air productions" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Holiday theater specials and premieres" />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* MCP Integrations Tab */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          🔗 MCP Server Integrations
        </Typography>

        <Typography variant="body2" sx={{ mb: 4 }}>
          Direct access to your MCP-powered applications from the Vienna Life Assistant.
          All your tools are integrated for seamless workflow.
        </Typography>

        <Grid container spacing={3}>
          {/* MyAI Platform */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AIIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">MyAI Platform</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Your comprehensive AI microservices platform with 10 AI applications,
                  document RAG, image generation, and MCP orchestration.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="AI" size="small" sx={{ mr: 1 }} />
                  <Chip label="MCP" size="small" sx={{ mr: 1 }} />
                  <Chip label="FastMCP 2.12+" size="small" />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="http://localhost:3060"
                  target="_blank"
                  fullWidth
                >
                  Open MyAI Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Vienna Transit */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrainIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6">Vienna Transit</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Real-time Vienna public transport with AI journey planning,
                  vehicle tracking, and ML delay predictions.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="Transit" size="small" sx={{ mr: 1 }} />
                  <Chip label="Real-time" size="small" sx={{ mr: 1 }} />
                  <Chip label="ML" size="small" />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="http://localhost:3079"
                  target="_blank"
                  fullWidth
                >
                  Open Transit Map
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Home Security */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HomeIcon sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="h6">Home Security Hub</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Unified surveillance dashboard with Tapo cameras, Ring doorbell,
                  Nest sensors, and comprehensive home monitoring.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="Security" size="small" sx={{ mr: 1 }} />
                  <Chip label="Cameras" size="small" sx={{ mr: 1 }} />
                  <Chip label="Sensors" size="small" />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="http://localhost:7777"
                  target="_blank"
                  fullWidth
                >
                  Open Security Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Games Collection */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GameIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">Games Collection</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  69 games including Chess, Go, Shogi with AI opponents.
                  Perfect for Vienna's gaming community.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="Games" size="small" sx={{ mr: 1 }} />
                  <Chip label="AI" size="small" sx={{ mr: 1 }} />
                  <Chip label="Board Games" size="small" />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  href="http://localhost:9876"
                  target="_blank"
                  fullWidth
                >
                  Open Games Collection
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Advanced Memory */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LibraryIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6">Advanced Memory MCP</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Your knowledge base with zettelkasten notes, Claude Skills export/import,
                  semantic search, and project-based organization.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="Knowledge" size="small" sx={{ mr: 1 }} />
                  <Chip label="Zettelkasten" size="small" sx={{ mr: 1 }} />
                  <Chip label="Claude Skills" size="small" sx={{ mr: 1 }} />
                  <Chip label="Semantic Search" size="small" />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  fullWidth
                  disabled
                >
                  Integrated (Current View)
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Quick Access Tab */}
      <TabPanel value={activeTab} index={3}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          ⚡ Quick Access Panel
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  📋 Recent Vienna Research Notes
                </Typography>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Vienna Opera Season 2025/26</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">
                      Staatsoper: Opening with Mozart's "Don Giovanni" conducted by Christian Thielemann.
                      Volksoper: Focus on Viennese operetta with "Die Fledermaus" revival.
                      Special events include ballet gala and contemporary opera productions.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Hidden Vienna Gems</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">
                      • Augarten porcelain museum in the former imperial porcelain factory
                      • Hundertwasserhaus - colorful residential building with unique architecture
                      • Naschmarkt extension with contemporary art galleries
                      • Secret gardens in the 1st district accessible through courtyards
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Coffee House Culture Research</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">
                      Traditional coffee houses: Central, Sperl, Hawelka, Prückel.
                      Modern interpretations: High-end (e.g., with molecular gastronomy) vs. authentic local spots.
                      Viennese coffee specialties: Melange, Einspänner, Kapuziner.
                      Historical significance as intellectual hubs since 17th century.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ArticleIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6" color="secondary">
                    📝 OneNote Import Tools
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Import your OneNote notes directly into the Advanced Memory system for AI-powered organization and search.
                  Uses both <strong>onenote-mcp</strong> (Microsoft Graph integration) and <strong>advanced-memory-mcp</strong> (note processing).
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<LaunchIcon />}
                      onClick={() => alert('Opening OneNote authentication... (onenote-mcp authentication flow)')}
                      sx={{ mb: 1 }}
                    >
                      Authenticate OneNote
                    </Button>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Connect to Microsoft Graph API
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<LibraryIcon />}
                      onClick={() => alert('Listing OneNote notebooks... (onenote-mcp list_notebooks)')}
                      sx={{ mb: 1 }}
                    >
                      Browse Notebooks
                    </Button>
                    <Typography variant="caption" display="block" color="text.secondary">
                      View your OneNote notebooks
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<NotesIcon />}
                      onClick={() => alert('Starting OneNote import... (advanced-memory-mcp adn_import onenote)')}
                      sx={{ mb: 1 }}
                    >
                      Import All Notes
                    </Button>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Import all OneNote content
                    </Typography>
                  </Grid>
                </Grid>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <AlertTitle>How OneNote Import Works</AlertTitle>
                  <Typography variant="body2">
                    1. <strong>Authentication:</strong> Connect to Microsoft Graph API via onenote-mcp
                    <br />
                    2. <strong>Data Retrieval:</strong> Get OneNote pages in HTML format
                    <br />
                    3. <strong>Clean Processing:</strong> Convert HTML to readable text using advanced-memory-mcp
                    <br />
                    4. <strong>AI Organization:</strong> Notes are automatically tagged and made searchable
                  </Typography>
                </Alert>

                <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                  📋 Your imported OneNote notes will appear in the main knowledge base with automatic tags for easy discovery.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🔧 Quick Tools
                </Typography>

                <List>
                  <ListItem button>
                    <ListItemIcon><SearchIcon /></ListItemIcon>
                    <ListItemText primary="Search Knowledge Base" secondary="Find notes by topic" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon><NotesIcon /></ListItemIcon>
                    <ListItemText primary="New Vienna Note" secondary="Document discovery" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon><MusicIcon /></ListItemIcon>
                    <ListItemText primary="Concert Calendar" secondary="Check upcoming events" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon><LinkIcon /></ListItemIcon>
                    <ListItemText primary="Cross-reference" secondary="Link to other projects" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default KnowledgeBase;
