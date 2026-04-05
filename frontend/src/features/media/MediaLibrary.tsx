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
  TextField,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LibraryMusic as MusicIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  LibraryBooks as LibraryIcon,
  RecentActors as RecentIcon,
  TrendingUp as TrendingIcon
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
      id={`media-library-tabpanel-${index}`}
      aria-labelledby={`media-library-tab-${index}`}
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
    id: `media-library-tab-${index}`,
    'aria-controls': `media-library-tabpanel-${index}`,
  };
}

const MediaLibrary: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [plexStatus, setPlexStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraries, setLibraries] = useState<any[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Placeholder for API calls to plex-mcp
  const checkPlexStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would call plex-mcp API
      // const response = await fetch('/api/plex-mcp/server/status');
      // const data = await response.json();
      // setPlexStatus('connected');
      // Mock data for now
      setTimeout(() => {
        setPlexStatus('connected');
        setLibraries([
          { key: '1', title: 'Movies', type: 'movie', count: 1250 },
          { key: '2', title: 'TV Shows', type: 'show', count: 890 },
          { key: '3', title: 'Music', type: 'artist', count: 2340 },
          { key: '4', title: 'Anime', type: 'show', count: 450 }
        ]);
        setRecentlyAdded([
          { title: 'Dune: Part Two', type: 'movie', added_at: '2 days ago', year: 2024 },
          { title: 'Severance S2', type: 'show', added_at: '1 week ago', year: 2025 },
          { title: 'Taylor Swift - The Eras Tour', type: 'music', added_at: '3 days ago', year: 2023 },
          { title: 'Attack on Titan Final Season', type: 'show', added_at: '5 days ago', year: 2023 }
        ]);
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError('Failed to connect to Plex server. Ensure plex-mcp is running and configured.');
      setPlexStatus('disconnected');
      console.error(err);
      setLoading(false);
    }
  };

  const searchMedia = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      // In a real implementation, this would call plex-mcp search API
      // const response = await fetch(`/api/plex-mcp/media/search?query=${encodeURIComponent(query)}`);
      // const data = await response.json();
      // setSearchResults(data);
      // Mock search results
      setTimeout(() => {
        setSearchResults([
          { title: 'Inception', type: 'movie', year: 2010, summary: 'A thief who steals corporate secrets through dream-sharing technology.' },
          { title: 'Inception (TV Series)', type: 'show', year: 2021, summary: 'A detective with a perfect memory solves crimes.' },
          { title: 'Inception Soundtrack', type: 'music', year: 2010, summary: 'Original score by Hans Zimmer.' }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPlexStatus();
  }, []);

  const handleSubTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveSubTab(newValue);
  };

  const getLibraryIcon = (type: string) => {
    switch (type) {
      case 'movie': return <MovieIcon />;
      case 'show': return <TvIcon />;
      case 'artist': return <MusicIcon />;
      default: return <LibraryIcon />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        📚 Media Library
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Access and manage your Plex media server with integrated library browsing, search, and playback control.
        Powered by `plex-mcp` for seamless media management.
      </Typography>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={activeSubTab}
          onChange={handleSubTabChange}
          aria-label="Media Library sub-tabs"
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { textTransform: 'none' }
          }}
        >
          <Tab label="Libraries" icon={<LibraryIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Recently Added" icon={<RecentIcon />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="Search & Browse" icon={<SearchIcon />} iconPosition="start" {...a11yProps(2)} />
          <Tab label="Server Status" icon={<RefreshIcon />} iconPosition="start" {...a11yProps(3)} />
        </Tabs>
      </Paper>

      <TabPanel value={activeSubTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              📚 Your Media Libraries
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Integrated with Plex-MCP</AlertTitle>
              <Typography variant="body2">
                This section provides access to all your Plex media libraries, including movies, TV shows,
                music, and anime collections. Powered by the `plex-mcp` service for comprehensive media management.
              </Typography>
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                  onClick={checkPlexStatus}
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh Libraries'}
                </Button>
                <Chip
                  label={`Plex: ${plexStatus}`}
                  color={plexStatus === 'connected' ? 'success' : 'error'}
                />
              </Box>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          </Grid>

          {loading ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading libraries...</Typography>
            </Grid>
          ) : libraries.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="warning">No libraries found. Ensure Plex server is running and configured.</Alert>
            </Grid>
          ) : (
            libraries.map((library) => (
              <Grid item xs={12} md={6} lg={3} key={library.key}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getLibraryIcon(library.type)}
                        <Typography variant="h6" sx={{ ml: 1 }}>{library.title}</Typography>
                      </Box>
                      <Chip
                        label={`${library.count} items`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" paragraph>
                      **Type:** {library.type}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      **Items:** {library.count.toLocaleString()}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button size="small" startIcon={<VisibilityIcon />}>Browse</Button>
                      <Button size="small" startIcon={<RefreshIcon />}>Scan</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Accordion sx={{ mt: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">`plex-mcp` Library Management Features</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              The `plex-mcp` service provides comprehensive library management through 15 portmanteau tools:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="`plex_library`: Complete library lifecycle (list, create, update, delete, scan, refresh, optimize)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="`plex_media`: Browse, search, and manage media content with detailed metadata" />
              </ListItem>
              <ListItem>
                <ListItemText primary="`plex_search`: Advanced search with suggestions and saved searches" />
              </ListItem>
              <ListItem>
                <ListItemText primary="`plex_reporting`: Library statistics and usage analytics" />
              </ListItem>
              <ListItem>
                <ListItemText primary="`plex_collections`: Manage media collections and playlists" />
              </ListItem>
            </List>
            <Typography variant="body2" sx={{ mt: 2 }}>
              These tools enable natural language control of your entire media library through Claude Desktop.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </TabPanel>

      <TabPanel value={activeSubTab} index={1}>
        <Typography variant="h5" gutterBottom>
          🆕 Recently Added Media
        </Typography>
        <Typography variant="body1" paragraph>
          Browse your most recently added media across all libraries.
          (Functionality to be implemented using `plex-mcp`'s `plex_media` tool with `get_recent` operation).
        </Typography>
        <Alert severity="warning">
          <AlertTitle>Coming Soon</AlertTitle>
          This section will show recently added movies, TV shows, music, and anime with thumbnails and metadata.
        </Alert>

        {/* Mock recent additions */}
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Added</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentlyAdded.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.type}
                      size="small"
                      variant="outlined"
                      icon={getLibraryIcon(item.type)}
                    />
                  </TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{item.added_at}</TableCell>
                  <TableCell>
                    <Tooltip title="Play">
                      <IconButton size="small">
                        <PlayIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeSubTab} index={2}>
        <Typography variant="h5" gutterBottom>
          🔍 Search & Browse Media
        </Typography>
        <Typography variant="body1" paragraph>
          Search across your entire media library or browse specific libraries.
          (Functionality to be implemented using `plex-mcp`'s `plex_search` and `plex_media` tools).
        </Typography>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Search your media library"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                searchMedia(searchQuery);
              }
            }}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={() => searchMedia(searchQuery)}
                  disabled={loading}
                >
                  Search
                </Button>
              ),
            }}
          />
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Searching...</Typography>
          </Box>
        )}

        {searchResults.length > 0 && (
          <Grid container spacing={2}>
            {searchResults.map((result, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getLibraryIcon(result.type)}
                      <Typography variant="h6" sx={{ ml: 1 }}>{result.title}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {result.year} • {result.type}
                    </Typography>
                    <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                      {result.summary}
                    </Typography>
                    <Button size="small" startIcon={<PlayIcon />}>Play</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Alert severity="info" sx={{ mt: 4 }}>
          <AlertTitle>Advanced Search Features</AlertTitle>
          <Typography variant="body2">
            The `plex-mcp` service provides advanced search capabilities including:
            genre filtering, actor/director search, year ranges, and natural language queries.
          </Typography>
        </Alert>
      </TabPanel>

      <TabPanel value={activeSubTab} index={3}>
        <Typography variant="h5" gutterBottom>
          🔧 Plex Server Status
        </Typography>
        <Typography variant="body1" paragraph>
          Monitor your Plex server health, active sessions, and system information.
          (Functionality to be implemented using `plex-mcp`'s `plex_server` and `plex_streaming` tools).
        </Typography>
        <Alert severity="warning">
          <AlertTitle>Coming Soon</AlertTitle>
          This section will display server status, active streams, transcoding status, and system information.
        </Alert>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RefreshIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Server Health</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  **Status:** Online
                </Typography>
                <Typography variant="body2" paragraph>
                  **Version:** 1.41.3.9314
                </Typography>
                <Typography variant="body2" paragraph>
                  **Uptime:** 15 days, 8 hours
                </Typography>
                <Button variant="outlined" size="small" startIcon={<RefreshIcon />}>
                  Refresh Status
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">Active Sessions</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  **Current Streams:** 2
                </Typography>
                <Typography variant="body2" paragraph>
                  **Transcoding:** 1 active
                </Typography>
                <Typography variant="body2" paragraph>
                  **Bandwidth:** 45.2 Mbps
                </Typography>
                <Button variant="outlined" size="small" startIcon={<VisibilityIcon />}>
                  View Sessions
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default MediaLibrary;












