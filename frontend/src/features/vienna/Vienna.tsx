import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Paper,
  Stack,
  Tabs,
  Tab,
  Button,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Euro as EuroIcon,
  Public as PublicIcon,
  Museum as MuseumIcon,
  MusicNote as MusicIcon,
  LocalCafe as CafeIcon,
  DirectionsBus as TransportIcon,
  Security as SecurityIcon,
  Celebration as CelebrationIcon,
  Park as ParkIcon,
  Restaurant as RestaurantIcon,
  Close as CloseIcon,
  Train as TrainIcon,
  Flight as FlightIcon,
  AccessTime as TimeIcon,
  Info as InfoIcon,
  Photo as PhotoIcon
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
      id={`vienna-tabpanel-${index}`}
      aria-labelledby={`vienna-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Vienna: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAttraction, setSelectedAttraction] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          mb: 2
        }}>
          Vienna (Wien) 🇦🇹
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          The Imperial Capital • Heart of Classical Music • City of Dreams
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip label="UNESCO World Heritage" color="primary" variant="outlined" />
          <Chip label="European Capital of Culture" color="secondary" variant="outlined" />
          <Chip label="Music Capital of the World" color="success" variant="outlined" />
          <Chip label="Imperial Residence" color="warning" variant="outlined" />
        </Box>
      </Box>

      {/* Vienna Tabs */}
      <Paper sx={{ mb: 4 }}>
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
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500,
              py: { xs: 1.5, sm: 2, md: 2.5 },
              minHeight: { xs: 48, sm: 56, md: 64 },
              minWidth: { xs: 80, sm: 120 }
            },
            '& .Mui-selected': {
              color: 'primary.main',
              fontWeight: 600
            }
          }}
        >
          <Tab icon={<LocationIcon />} iconPosition="start" label="Attractions" />
          <Tab icon={<CafeIcon />} iconPosition="start" label="Coffee Houses" />
          <Tab icon={<EuroIcon />} iconPosition="start" label="Vienna Pass" />
          <Tab icon={<TrainIcon />} iconPosition="start" label="Day Trips" />
          <Tab icon={<TransportIcon />} iconPosition="start" label="Transport" />
          <Tab icon={<CelebrationIcon />} iconPosition="start" label="Festivals" />
        </Tabs>

        {/* Tab Content */}
        <TabPanel value={activeTab} index={0}>
          <ViennaAttractions onAttractionClick={setSelectedAttraction} />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <ViennaCoffeeHouses onAttractionClick={setSelectedAttraction} />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <ViennaPass />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <ViennaDayTrips />
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <ViennaTransport />
        </TabPanel>

        <TabPanel value={activeTab} index={5}>
          <ViennaFestivals />
        </TabPanel>
      </Paper>

      {/* Attraction Detail Dialog */}
      <AttractionDetailDialog
        attraction={selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
      />
    </Container>
  );
};

// Attractions Component
const ViennaAttractions: React.FC<{ onAttractionClick: (attraction: string) => void }> = ({ onAttractionClick }) => (
  <Box>
    <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
      🎭 Must-See Vienna Attractions
    </Typography>

    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('stephansdom')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Stephansdom_Wien_2014.jpg/800px-Stephansdom_Wien_2014.jpg"
            alt="St. Stephen's Cathedral"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>St. Stephen's Cathedral</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Vienna's iconic Gothic cathedral, symbol of the city. Climb the south tower for panoramic views of Vienna's rooftops.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="UNESCO" color="primary" />
              <Chip size="small" label="Free Entry" color="success" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('belvedere')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Belvedere_Palace_Vienna.jpg/800px-Belvedere_Palace_Vienna.jpg"
            alt="Belvedere Palace"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Belvedere Palace</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Baroque palace complex housing Gustav Klimt's "The Kiss". Two palaces connected by beautiful gardens.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Klimt" color="secondary" />
              <Chip size="small" label="€16" color="warning" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('hofburg')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Hofburg_Palace%2C_Innsbruck.jpg/800px-Hofburg_Palace%2C_Innsbruck.jpg"
            alt="Hofburg Palace"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Hofburg Palace</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Imperial residence of Habsburg emperors. Imperial Apartments, Treasury, and Spanish Riding School.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Imperial" color="warning" />
              <Chip size="small" label="€20" color="warning" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('schonbrunn')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Sch%C3%B6nbrunn_Palace%2C_Vienna.jpg/800px-Sch%C3%B6nbrunn_Palace%2C_Vienna.jpg"
            alt="Schönbrunn Palace"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Schönbrunn Palace</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Summer residence of Habsburg emperors. Vast palace complex with gardens, zoo, and palm house.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="UNESCO" color="primary" />
              <Chip size="small" label="€22" color="warning" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('prater')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Vienna_Stadtpark_01.jpg/800px-Vienna_Stadtpark_01.jpg"
            alt="Prater Park"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Prater Park</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Vienna's largest park with the famous Riesenrad ferris wheel. Historic amusement park and recreation area.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Riesenrad" color="success" />
              <Chip size="small" label="€12" color="warning" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('naschmarkt')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Naschmarkt_Vienna.jpg/800px-Naschmarkt_Vienna.jpg"
            alt="Naschmarkt"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Naschmarkt</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Vienna's most famous market. Fresh produce, international cuisine, street food, and vintage shops.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Market" color="success" />
              <Chip size="small" label="Free" color="success" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// Coffee Houses Component
const ViennaCoffeeHouses: React.FC<{ onAttractionClick: (attraction: string) => void }> = ({ onAttractionClick }) => (
  <Box>
    <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
      ☕ Vienna Coffee House Culture
    </Typography>

    <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
      "The coffee house is a social institution in Vienna. It is a place where time and space are consumed, but only the coffee is found on the bill." - Peter Altenberg
    </Typography>

    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('cafe-central')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Caf%C3%A9_Central_in_Vienna.jpg/800px-Caf%C3%A9_Central_in_Vienna.jpg"
            alt="Café Central"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Café Central</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Vienna's most famous coffee house. Historic venue where Trotsky played chess and Freud met colleagues.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Historic" color="warning" />
              <Chip size="small" label="Famous Queue" color="error" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('cafe-sperl')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Caf%C3%A9_Sperl_Interior.jpg/800px-Caf%C3%A9_Sperl_Interior.jpg"
            alt="Café Sperl"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Café Sperl</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Theater district institution since 1880. Jugendstil interior, traditional Viennese atmosphere.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Theater" color="secondary" />
              <Chip size="small" label="Jugendstil" color="primary" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('cafe-hawelka')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Caf%C3%A9_Hawelka_Interior.jpg/800px-Caf%C3%A9_Hawelka_Interior.jpg"
            alt="Café Hawelka"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Café Hawelka</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Artists' haunt since 1939. Famous for Buchteln (sweet yeast dumplings) and intellectual atmosphere.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Artists" color="secondary" />
              <Chip size="small" label="Buchteln" color="success" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('cafe-demel')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Demel_Logo.jpg/800px-Demel_Logo.jpg"
            alt="Demel"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Demel</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Imperial court confectioner since 1786. Famous for Sachertorte and imperial pastries.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Imperial" color="warning" />
              <Chip size="small" label="Pastries" color="success" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('cafe-pruckel')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Caf%C3%A9_Pr%C3%BCckel_Interior.jpg/800px-Caf%C3%A9_Pr%C3%BCckel_Interior.jpg"
            alt="Café Prückel"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Café Prückel</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Jugendstil masterpiece. Stunning interior with marble columns, stained glass, and garden.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Jugendstil" color="primary" />
              <Chip size="small" label="Architecture" color="secondary" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// Vienna Pass Component
const ViennaPass: React.FC = () => (
  <Box>
    <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
      🎫 Vienna Pass - Your Smart City Guide
    </Typography>

    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>What is the Vienna Pass?</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            The Vienna Pass is your all-access ticket to Vienna's top attractions. It provides free entry to over 60 museums,
            palaces, and sights, plus unlimited public transport and fast-track entry to avoid queues.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>What's Included:</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon><MuseumIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Free entry to 60+ attractions" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TransportIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Unlimited public transport" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TimeIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Fast-track entry (skip queues)" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Free city guide app" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhotoIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Free walking tours" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TrainIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Airport transfer options" />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Pricing:</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                <Typography variant="h6">1 Day</Typography>
                <Typography variant="h4">€69</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                <Typography variant="h6">2 Days</Typography>
                <Typography variant="h4">€89</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                <Typography variant="h6">3 Days</Typography>
                <Typography variant="h4">€109</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'black' }}>
                <Typography variant="h6">6 Days</Typography>
                <Typography variant="h4">€149</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Top Attractions Covered:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            <Chip label="Schönbrunn Palace" variant="outlined" />
            <Chip label="Hofburg Palace" variant="outlined" />
            <Chip label="Belvedere Palace" variant="outlined" />
            <Chip label="St. Stephen's Cathedral" variant="outlined" />
            <Chip label="Albertina Museum" variant="outlined" />
            <Chip label="Kunst Haus Wien" variant="outlined" />
            <Chip label="Haus des Meeres" variant="outlined" />
            <Chip label="Madame Tussauds" variant="outlined" />
            <Chip label="Vienna State Opera" variant="outlined" />
          </Box>

          <Button
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            component={Link}
            href="https://www.viennapass.com"
            target="_blank"
            rel="noopener"
          >
            Get Vienna Pass Online
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, bgcolor: 'success.light', color: 'white' }}>
          <Typography variant="h6" gutterBottom>💰 Money Saving Tips</Typography>
          <List dense sx={{ color: 'white' }}>
            <ListItem>
              <ListItemText primary="• Payback within 2-3 attractions" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Skip-the-line saves hours" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Free transport included" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Best for intensive sightseeing" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 3, mt: 2, bgcolor: 'info.light' }}>
          <Typography variant="h6" gutterBottom>📱 Vienna Pass App</Typography>
          <Typography variant="body2">
            Download the free Vienna Pass app for:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Interactive city map" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Attraction details & hours" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Real-time queue times" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Personalized itineraries" />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

// Day Trips Component
const ViennaDayTrips: React.FC = () => (
  <Box>
    <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
      🚂 Day Trips from Vienna
    </Typography>

    <Grid container spacing={3}>
      {/* Salzburg */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Salzburg_Mirabellgarten.jpg/800px-Salzburg_Mirabellgarten.jpg"
            alt="Salzburg"
          />
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrainIcon /> Salzburg (2.5 hours by train)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Birthplace of Mozart, baroque architecture, and stunning alpine scenery. Perfect day trip combining culture and nature.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>🚆 Transport Options:</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Railjet train: 2h 25min, €30-60 one-way" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Regional trains: 2h 40min, €20-40" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Bus: 3 hours, €15-25 (cheaper but slower)" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>📅 Suggested Itinerary:</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              8:00 AM departure → 10:30 AM arrive → Mirabell Gardens → Hohensalzburg Fortress →
              Mozart's birthplace → Evening return
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip size="small" label="Mozart" color="secondary" />
              <Chip size="small" label="Baroque" color="primary" />
              <Chip size="small" label="Alps" color="success" />
            </Box>

            <Button
              variant="outlined"
              size="small"
              fullWidth
              component={Link}
              href="https://www.salzburg.info"
              target="_blank"
              rel="noopener"
            >
              Visit Salzburg Tourism
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Bratislava */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bratislava_Castle_from_Donau.jpg/800px-Bratislava_Castle_from_Donau.jpg"
            alt="Bratislava Castle"
          />
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrainIcon /> Bratislava (1 hour by train)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Slovakia's capital offers stunning castle views, medieval old town, and surprisingly affordable dining. Europe's cheapest capital!
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>🚆 Transport Options:</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Direct train: 1 hour, €10-15 one-way" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Bus: 1h 15min, €8-12" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Danube cruise: 1h 15min, €15-25 return" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>📅 Suggested Itinerary:</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              9:00 AM departure → 10:00 AM arrive → Bratislava Castle → Old Town Square →
              UFO Bridge → Lunch (€10-15) → Return by 5:00 PM
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip size="small" label="Castle" color="warning" />
              <Chip size="small" label="Budget" color="success" />
              <Chip size="small" label="Medieval" color="primary" />
            </Box>

            <Button
              variant="outlined"
              size="small"
              fullWidth
              component={Link}
              href="https://www.visitbratislava.com"
              target="_blank"
              rel="noopener"
            >
              Visit Bratislava Tourism
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Budapest */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Budapest_Parliament_from_Buda_Hill.jpg/800px-Budapest_Parliament_from_Buda_Hill.jpg"
            alt="Budapest Parliament"
          />
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrainIcon /> Budapest (2.5 hours by train)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              "Paris of the East" offers stunning architecture, thermal baths, ruin bars, and vibrant nightlife.
              Hungary's capital combines imperial elegance with youthful energy.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>🚆 Transport Options:</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Railjet train: 2h 30min, €25-50 one-way" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Regional trains: 2h 45min, €15-35" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Bus: 3 hours, €12-25" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>📅 Suggested Itinerary:</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              8:30 AM departure → 11:00 AM arrive → Buda Castle → Parliament Building →
              St. Stephen's Basilica → Thermal baths (Széchenyi) → Ruin bar evening
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip size="small" label="Thermal Baths" color="primary" />
              <Chip size="small" label="Architecture" color="secondary" />
              <Chip size="small" label="Nightlife" color="warning" />
            </Box>

            <Button
              variant="outlined"
              size="small"
              fullWidth
              component={Link}
              href="https://www.visitbudapest.travel"
              target="_blank"
              rel="noopener"
            >
              Visit Budapest Tourism
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Klagenfurt & Graz */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Klagenfurt_Lindwurm.jpg/800px-Klagenfurt_Lindwurm.jpg"
            alt="Klagenfurt Lindwurm"
          />
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrainIcon /> Klagenfurt & Graz (now fast day trips!)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Carinthia's capital with lakes, mountains, and alpine culture. The December 2025 opening of the Koralmbahn
              tunnel revolutionized travel times, making both Klagenfurt (2.5h) and Graz (1.5h) perfect day trips from Vienna.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>🚆 Transport Revolution:</Typography>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
              🎉 Koralmbahn Tunnel (opened Dec 2025): Cut travel times by 30-45 minutes!
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• To Klagenfurt: 2h 30min, €25-45 (was 3h 15min)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• To Graz: 1h 30min, €15-30 (was 2h 15min)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Modern Railjet trains with WiFi, power outlets" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>📅 Suggested Itinerary:</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Graz: 9:00 AM departure → 10:30 AM arrive → Schlossberg → Mur Island → City sights → Return by 6:00 PM<br/>
              Klagenfurt: 8:00 AM departure → 10:30 AM arrive → Wörthersee lake → Minimundus → Return by 8:00 PM
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip size="small" label="Lakes" color="primary" />
              <Chip size="small" label="Mountains" color="success" />
              <Chip size="small" label="Koralmbahn" color="secondary" />
            </Box>

            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
              💡 The Koralmbahn is Austria's largest infrastructure project (€3.3B), connecting Vienna to Carinthia seamlessly.
            </Typography>

            <Button
              variant="outlined"
              size="small"
              fullWidth
              component={Link}
              href="https://www.visitklagenfurt.at"
              target="_blank"
              rel="noopener"
            >
              Visit Klagenfurt Tourism
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Munich */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Munich_Marienplatz.jpg/800px-Munich_Marienplatz.jpg"
            alt="Munich Marienplatz"
          />
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrainIcon /> Munich (4 hours, borderline day trip)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Bavaria's capital offers world-class museums, beer gardens, and alpine proximity. A borderline day trip
              that works with an early start, but overnight stay is preferable for a relaxed experience.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>🚆 Transport Options:</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Railjet train: 4 hours, €40-80 one-way" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• ICE trains: 3h 45min, €45-90" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Bus: 5-6 hours, €20-40" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>📅 Suggested Itinerary:</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              6:00 AM departure → 10:00 AM arrive → Marienplatz → Viktualienmarkt → Nymphenburg Palace →
              Beer garden lunch → English Garden → Return by 10:00 PM (overnight preferable)
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip size="small" label="Beer Gardens" color="warning" />
              <Chip size="small" label="Museums" color="primary" />
              <Chip size="small" label="Alps" color="success" />
              <Chip size="small" label="Overnight Preferred" color="error" />
            </Box>

            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
              💡 Consider staying overnight - Munich hotels from €60, or day trip with early return. The extra time is worth it!
            </Typography>

            <Button
              variant="outlined"
              size="small"
              fullWidth
              component={Link}
              href="https://www.muenchen.de"
              target="_blank"
              rel="noopener"
            >
              Visit Munich Tourism
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Venice - Special Sleeper Train Section */}
      <Grid item xs={12}>
        <Card sx={{ border: '2px solid', borderColor: 'primary.main' }}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Venice_-_Grand_Canal_and_Rialto_Bridge.jpg/800px-Venice_-_Grand_Canal_and_Rialto_Bridge.jpg"
            alt="Venice Grand Canal"
          />
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🌙 Venice (7 hours by sleeper train - MUST!)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The floating city demands a special approach. Take the legendary ÖBB Nightjet sleeper train from Vienna -
              the journey itself is part of the adventure. ÖBB has revived sleeper trains across Central Europe.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>🚂 Sleeper Train Experience:</Typography>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
              🌙 Nightjet Vienna-Venice: Depart 22:40, arrive 05:40 (7 hours overnight)
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Comfortable sleeping cars with beds (€89-159)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Couchette cars with seats that convert to beds (€49-89)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Scenic route through Alps and Italian countryside" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Breakfast service on arrival" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>🎭 ÖBB's Sleeper Train Renaissance:</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Austrian Federal Railways (ÖBB) has invested €500M+ reviving Europe's sleeper train network. From Vienna you can now reach:
              Berlin, Hamburg, Zurich, Rome, Florence, Milan, Venice, and more - all by comfortable overnight train.
              Perfect for sustainable, scenic travel while you sleep.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>📅 Suggested Itinerary:</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Day 1: 10:00 PM departure Vienna → Sleep through Alps<br/>
              Day 2: 5:40 AM arrive Venice → St. Mark's Square → Doge's Palace → Gondola ride →
              Murano glass → Return next evening or extend stay
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip size="small" label="Sleeper Train" color="primary" />
              <Chip size="small" label="Romantic" color="secondary" />
              <Chip size="small" label="UNESCO" color="success" />
              <Chip size="small" label="ÖBB Nightjet" color="warning" />
            </Box>

            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
              💡 Book early! Nightjet sleeper cars sell out quickly. Consider a 2-3 day stay in Venice for the full experience.
            </Typography>

            <Button
              variant="outlined"
              size="small"
              fullWidth
              component={Link}
              href="https://www.oebb.at/en/tickets-travelling/nightjets"
              target="_blank"
              rel="noopener"
            >
              Book ÖBB Nightjet
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Prague */}
      <Grid item xs={12}>
        <Card>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Prague_Castle_from_Vltava.jpg/800px-Prague_Castle_from_Vltava.jpg"
            alt="Prague Castle"
          />
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlightIcon /> Prague (4 hours by train, early start recommended)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              "City of a Hundred Spires" offers stunning Gothic architecture, world-famous beer culture, and fairy-tale charm.
              Requires an early start for a full day trip.
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>🚆 Transport Options:</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Railjet train: 4 hours, €30-60 one-way" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Regional trains: 4h 30min, €20-40" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Bus: 4-5 hours, €15-30 (overnight return option)" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>📅 Suggested Itinerary:</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              5:30 AM departure → 9:30 AM arrive → Prague Castle → Charles Bridge → Old Town Square →
              Astronomical Clock → Beer garden lunch → Return by 8:00 PM train
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip size="small" label="Gothic" color="primary" />
              <Chip size="small" label="Beer" color="warning" />
              <Chip size="small" label="Castle" color="secondary" />
              <Chip size="small" label="Early Start" color="error" />
            </Box>

            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
              💡 Tip: Consider staying overnight in Prague for a more relaxed experience - hotels from €40.
            </Typography>

            <Button
              variant="outlined"
              size="small"
              fullWidth
              component={Link}
              href="https://www.prague.eu"
              target="_blank"
              rel="noopener"
            >
              Visit Prague Tourism
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// Travel Guide Component (kept for reference but now part of Attractions)
const ViennaTravelGuide: React.FC = () => (
  <Box>
    {/* History & Geography */}
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        📜 History & Geography
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Vienna_Stadtpark_01.jpg/800px-Vienna_Stadtpark_01.jpg"
              alt="Vienna Stadtpark"
            />
            <CardContent>
              <Typography variant="h6">Geography</Typography>
              <Typography variant="body2" color="text.secondary">
                Vienna lies on the Danube River in northeastern Austria. The city is divided into 23 districts,
                with the historic center (Innere Stadt) being District 1. The Danube Canal and numerous parks
                provide green spaces throughout the urban landscape.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Sch%C3%B6nbrunn_Palace%2C_Vienna.jpg/800px-Sch%C3%B6nbrunn_Palace%2C_Vienna.jpg"
              alt="Schönbrunn Palace"
            />
            <CardContent>
              <Typography variant="h6">Imperial History</Typography>
              <Typography variant="body2" color="text.secondary">
                For over 600 years, Vienna was the seat of the Holy Roman Empire, then the Austrian Empire,
                and finally the Austro-Hungarian Empire. The city's imperial palaces, including Schönbrunn
                and Hofburg, reflect this rich monarchic heritage.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>

    {/* 3-Day Travel Plan */}
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        📅 3-Day Vienna Travel Plan
      </Typography>

      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
            <ScheduleIcon /> Day 1: Imperial Vienna
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Morning: St. Stephen's Cathedral & Stephansplatz" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Lunch: Traditional Austrian cuisine in Innere Stadt" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Afternoon: Hofburg Palace Imperial Apartments" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Evening: Vienna State Opera (book tickets in advance)" />
            </ListItem>
          </List>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#388e3c' }}>
            <ScheduleIcon /> Day 2: Culture & Gardens
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Morning: Belvedere Palace (art collection)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Lunch: Picnic in Stadtpark" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Afternoon: Naschmarkt exploration" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Evening: Danube River cruise or Heurigen wine tavern" />
            </ListItem>
          </List>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#f57c00' }}>
            <ScheduleIcon /> Day 3: Modern & Musical Vienna
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Morning: Hundertwasserhaus (modern architecture)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Lunch: Street food at Karmelitermarkt" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Afternoon: Haus des Meeres aquarium" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Evening: Classical concert at Musikverein" />
            </ListItem>
          </List>
        </Box>
      </Stack>
    </Paper>

    {/* Must-See Attractions */}
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        🎭 Must-See Attractions
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Stephansdom_Wien_2014.jpg/800px-Stephansdom_Wien_2014.jpg"
              alt="St. Stephen's Cathedral"
            />
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontSize: '1rem' }}>St. Stephen's Cathedral</Typography>
              <Typography variant="body2" color="text.secondary">
                Gothic masterpiece, symbol of Vienna. Climb the south tower for panoramic views.
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Chip size="small" label="Free Entry" color="success" />
                <Chip size="small" label="UNESCO" color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Belvedere_Palace_Vienna.jpg/800px-Belvedere_Palace_Vienna.jpg"
              alt="Belvedere Palace"
            />
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontSize: '1rem' }}>Belvedere Palace</Typography>
              <Typography variant="body2" color="text.secondary">
                Baroque palace housing Klimt's "The Kiss". Two palaces connected by gardens.
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip size="small" label="€16 Entry" color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Hofburg_Palace%2C_Innsbruck.jpg/800px-Hofburg_Palace%2C_Innsbruck.jpg"
              alt="Hofburg Palace"
            />
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontSize: '1rem' }}>Hofburg Palace</Typography>
              <Typography variant="body2" color="text.secondary">
                Imperial residence of Habsburg emperors. Home to Imperial Apartments and Treasury.
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip size="small" label="€20 Entry" color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  </Box>
);

// Transport Component
const ViennaTransport: React.FC = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      🚇 Vienna Public Transport System
    </Typography>

    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" color="primary">U-Bahn (Metro)</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            5 lines covering the entire city. Clean, efficient, and frequent service.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Single ride: €2.40 | 24h ticket: €8.00 | 48h: €14.10
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" color="primary">Tram & Bus</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Extensive tram network and buses for areas not covered by U-Bahn.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Same pricing as U-Bahn | Night service available
          </Typography>
        </Paper>
      </Grid>
    </Grid>

    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" color="primary">🚆 Regional Transport</Typography>
      <Typography variant="body2">
        Vienna is connected to the rest of Austria and Europe via:
      </Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="• ÖBB trains to other Austrian cities" />
        </ListItem>
        <ListItem>
          <ListItemText primary="• Vienna International Airport (VIE) - CAT train from city center" />
        </ListItem>
        <ListItem>
          <ListItemText primary="• International trains to Budapest, Prague, Bratislava" />
        </ListItem>
      </List>
    </Paper>

    <Paper sx={{ p: 2, mt: 2, backgroundColor: '#e8f5e8' }}>
      <Typography variant="h6" color="success.main">💡 Pro Tips</Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="• Buy tickets at machines or Wiener Linien app" />
        </ListItem>
        <ListItem>
          <ListItemText primary="• Validate tickets when boarding" />
        </ListItem>
        <ListItem>
          <ListItemText primary="• Vienna Pass includes unlimited transport + attractions" />
        </ListItem>
        <ListItem>
          <ListItemText primary="• Bicycles can be rented at many stations" />
        </ListItem>
      </List>
    </Paper>
  </Box>
);

// Festivals Component
const ViennaFestivals: React.FC = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      🎪 Festivals & Annual Events
    </Typography>

    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Typography variant="h6" color="primary">🎄 Christmas Markets (Advent)</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Vienna's Christmas markets are among Europe's most beautiful, featuring handmade crafts,
            mulled wine (Glühwein), and festive atmosphere.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Main markets: Rathausplatz, Schönbrunn Palace, Belvedere Palace
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
            December 1st - December 24th | Free entry
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" color="primary">🎡 Donauinselfest</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Europe's largest free open-air festival on Donauinsel (Danube Island).
            Features international artists, food stalls, and beach atmosphere.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Early June | 3 million+ visitors | Free entry
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" color="primary">🎭 Wiener Festwochen</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Vienna Festival Weeks featuring theater, opera, and contemporary performances
            at various venues across the city.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            May-June | Various venues | €10-80 tickets
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" color="primary">🎺 Wienerwald Festival</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Classical music festival in the Vienna Woods featuring concerts in historic settings.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            July | Various venues | €20-50 tickets
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" color="primary">🏊‍♂️ Beach Volleyball Grand Slam</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            World-class beach volleyball tournament at Wiener Stadthalle.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Late July | Wiener Stadthalle | Free viewing
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  </Box>
);

// Attraction Detail Dialog Component
const AttractionDetailDialog: React.FC<{
  attraction: string | null;
  onClose: () => void;
}> = ({ attraction, onClose }) => {
  if (!attraction) return null;

  const attractionData: Record<string, {
    title: string;
    image: string;
    description: string;
    details: string[];
    website: string;
    price?: string;
    hours?: string;
    tips?: string[];
  }> = {
    stephansdom: {
      title: "St. Stephen's Cathedral (Stephansdom)",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Stephansdom_Wien_2014.jpg/800px-Stephansdom_Wien_2014.jpg",
      description: "Vienna's iconic Gothic cathedral, built between 1137 and 1160, is the symbol of Vienna and one of Europe's most important Gothic structures. The cathedral has witnessed centuries of history, from medieval coronations to modern state ceremonies.",
      details: [
        "• Gothic architecture with stunning stained glass windows",
        "• Climb the 343 steps of the South Tower for panoramic city views (€6)",
        "• The Pummerin bell weighs 20 tons and tolls on special occasions",
        "• Imperial crypt contains the remains of 12 emperors and 19 empresses",
        "• North Tower houses the cathedral treasury with precious artifacts",
        "• Free entry to main nave, charges for towers and catacombs"
      ],
      website: "https://www.stephanskirche.at",
      price: "Free entry to cathedral, €6 for South Tower, €5 for North Tower & Treasury",
      hours: "Daily 6:00 AM - 10:00 PM (towers until 5:30 PM)",
      tips: [
        "Visit early morning to avoid crowds",
        "South Tower views are spectacular at sunset",
        "Photography allowed but no flash",
        "Dress modestly - shoulders and knees covered",
        "Wheelchair accessible via ramp"
      ]
    },
    belvedere: {
      title: "Belvedere Palace",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Belvedere_Palace_Vienna.jpg/800px-Belvedere_Palace_Vienna.jpg",
      description: "A masterpiece of Baroque architecture, the Belvedere was built as a summer residence for Prince Eugene of Savoy. Today it houses the world's largest collection of Gustav Klimt paintings, including his famous 'The Kiss'.",
      details: [
        "• Two palaces (Upper and Lower) connected by formal gardens",
        "• Upper Belvedere: Klimt's 'The Kiss' and other masterpieces",
        "• Lower Belvedere: Temporary exhibitions and garden café",
        "• Marble Hall with stunning ceiling frescoes",
        "• Orangery with seasonal exhibitions",
        "• Beautiful Baroque gardens with fountains and sculptures"
      ],
      website: "https://www.belvedere.at",
      price: "€16 for Upper Belvedere, €14 for Lower, €22 combined ticket",
      hours: "Tue-Sun 10:00 AM - 6:00 PM, Thu until 9:00 PM",
      tips: [
        "Buy tickets online to skip queues",
        "Allow 2-3 hours for both palaces",
        "Gardens are free and beautiful for picnics",
        "Thursday evening visits are quieter",
        "Photography allowed without flash"
      ]
    },
    hofburg: {
      title: "Hofburg Palace",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Hofburg_Palace%2C_Innsbruck.jpg/800px-Hofburg_Palace%2C_Innsbruck.jpg",
      description: "The Hofburg was the residence of the Habsburg emperors for over 600 years. This vast complex includes the Imperial Apartments, the Imperial Treasury with the crown jewels, and the Spanish Riding School famous for its Lipizzaner horses.",
      details: [
        "• Imperial Apartments: 19 rooms of imperial luxury",
        "• Imperial Treasury: Crown jewels, coronation robes, and holy relics",
        "• Spanish Riding School: World-famous Lipizzaner stallions (€25-€125)",
        "• Imperial Chapel with Silberkammer (silver collection)",
        "• National Library with priceless manuscripts",
        "• Michaelerplatz entrance with Roman ruins underneath"
      ],
      website: "https://www.hofburg-wien.at",
      price: "€20 for Imperial Apartments & Treasury, additional €25-€125 for Riding School",
      hours: "Imperial Apartments: Sep-Jun 9:00 AM - 5:30 PM, Jul-Aug until 6:00 PM",
      tips: [
        "Book tickets online for Imperial Apartments",
        "Visit Imperial Treasury early to avoid crowds",
        "Riding School performances require advance booking",
        "Combined tickets save money",
        "Guided tours available in multiple languages"
      ]
    },
    schonbrunn: {
      title: "Schönbrunn Palace & Gardens",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Sch%C3%B6nbrunn_Palace%2C_Vienna.jpg/800px-Sch%C3%B6nbrunn_Palace%2C_Vienna.jpg",
      description: "Schönbrunn Palace, the former summer residence of the Habsburg emperors, is one of the world's most beautiful Baroque palaces. The palace and its 160-hectare gardens were designed to rival Versailles and remain a UNESCO World Heritage site.",
      details: [
        "• 1,441 rooms, 40 of which are open to visitors",
        "• Grand Gallery with ceiling frescoes by Gregorio Guglielmi",
        "• Million Room with its intricate oriental wallpaper",
        "• Gardens with maze, zoo, and palm house (€6)",
        "• Gloriette: Iconic viewpoint with city panorama",
        "• Crown Prince Garden with playground and petting zoo"
      ],
      website: "https://www.schoenbrunn.at",
      price: "€22 for palace and gardens, additional €6 for zoo/palm house",
      hours: "Apr-Oct: 8:00 AM - 6:30 PM, Nov-Mar: 8:00 AM - 5:00 PM",
      tips: [
        "Take tram D from city center (20 minutes)",
        "Visit early morning or late afternoon to avoid crowds",
        "Gardens are free if you skip the palace",
        "Picnic areas available in gardens",
        "Tram tickets included in Vienna Pass"
      ]
    },
    'cafe-central': {
      title: "Café Central",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Caf%C3%A9_Central_in_Vienna.jpg/800px-Caf%C3%A9_Central_in_Vienna.jpg",
      description: "Café Central, opened in 1876, is Vienna's most famous coffee house and a UNESCO World Heritage site. This historic venue hosted intellectual giants like Sigmund Freud, Leon Trotsky (who played chess here), and Theodor Herzl. The café maintains its imperial splendor with marble pillars, chandeliers, and newspapers on sticks.",
      details: [
        "• Historic venue since 1876, UNESCO World Heritage",
        "• Famous for its chess games and intellectual gatherings",
        "• Marble pillars, chandeliers, and Jugendstil interior",
        "• Newspapers on sticks tradition",
        "• Trotsky played chess here daily",
        "• Freud and Herzl met here regularly",
        "• Famous queue at the entrance (worth the wait!)"
      ],
      website: "https://www.cafecentral.wien",
      price: "Coffee €4-6, pastries €5-8, lunch €15-25",
      hours: "Daily 7:30 AM - 10:00 PM",
      tips: [
        "Expect to queue 15-30 minutes (it's part of the experience!)",
        "Try the Wiener Melange (Viennese coffee with milk foam)",
        "Traditional Austrian dishes like Schnitzel available",
        "Newspapers in multiple languages available",
        "Perfect for people-watching and intellectual atmosphere",
        "Dress code: Smart casual, no athletic wear"
      ]
    },
    'cafe-sperl': {
      title: "Café Sperl",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Caf%C3%A9_Sperl_Interior.jpg/800px-Caf%C3%A9_Sperl_Interior.jpg",
      description: "Established in 1880, Café Sperl is a Jugendstil masterpiece located in Vienna's theater district. This institution has hosted countless actors, directors, and theater lovers. The café features stunning Art Nouveau interiors with floral motifs, marble tables, and brass fittings.",
      details: [
        "• Jugendstil (Art Nouveau) masterpiece since 1880",
        "• Located in Vienna's theater district (near Burgtheater)",
        "• Stunning floral motifs and brass fittings",
        "• Traditional marble tables and bentwood chairs",
        "• Famous for Sachertorte and apple strudel",
        "• Theater programs and newspapers available",
        "• Popular with actors and theater enthusiasts"
      ],
      website: "https://www.cafesperl.at",
      price: "Coffee €3.50-5, cakes €4-6, main dishes €12-18",
      hours: "Mon-Fri 7:00 AM - 8:00 PM, Sat 8:00 AM - 6:00 PM, Sun closed",
      tips: [
        "Visit after a theater performance",
        "Try the Sachertorte - Sperl's specialty",
        "Indoor and outdoor seating available",
        "Theater tickets can be purchased at the counter",
        "Perfect spot for pre-theater coffee and cake",
        "Authentic Viennese coffee house experience"
      ]
    },
    'cafe-hawelka': {
      title: "Café Hawelka",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Caf%C3%A9_Hawelka_Interior.jpg/800px-Caf%C3%A9_Hawelka_Interior.jpg",
      description: "Café Hawelka, established in 1939 by Leopold Hawelka, has been an artists' haunt for generations. Located in a narrow alleyway near St. Stephen's Cathedral, this bohemian café is famous for its Buchteln (sweet yeast dumplings) and intellectual atmosphere. The walls are adorned with artworks donated by customers over the years.",
      details: [
        "• Artists' café since 1939, founded by Leopold Hawelka",
        "• Located in Dorotheergasse, near St. Stephen's Cathedral",
        "• Famous for Buchteln (sweet yeast dumplings)",
        "• Bohemian atmosphere with artwork-covered walls",
        "• Intellectual and artistic clientele",
        "• No music, no games - just conversation and coffee",
        "• Traditional Viennese coffee house culture"
      ],
      website: "https://www.hawelka.at",
      price: "Coffee €3-4, Buchteln €4.50, small dishes €8-12",
      hours: "Mon-Sat 8:00 AM - 2:00 AM, Sun 10:00 AM - 2:00 AM",
      tips: [
        "Go for the Buchteln - they're legendary!",
        "The queue moves quickly, but come early for seats",
        "Walls covered with customer-donated artwork",
        "Late-night spot for artists and intellectuals",
        "Cash only (no cards accepted)",
        "Authentic, no-frills Viennese experience"
      ]
    },
    prater: {
      title: "Prater Park & Riesenrad",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Vienna_Stadtpark_01.jpg/800px-Vienna_Stadtpark_01.jpg",
      description: "The Prater is Vienna's largest park and home to the iconic Riesenrad (Ferris Wheel), made famous in the film 'The Third Man'. This vast recreational area combines amusement park rides, traditional attractions, and beautiful green spaces for relaxation and family entertainment.",
      details: [
        "• Vienna's largest public park (3,000 acres)",
        "• Riesenrad: 64-meter tall Ferris wheel since 1897",
        "• Wurstelprater amusement park with traditional rides",
        "• Liliputbahn miniature railway",
        "• Planetarium and Madame Tussauds Wax Museum",
        "• Beautiful lake with rowing boats and pedalos"
      ],
      website: "https://www.wiener-prater.at",
      price: "Riesenrad €12, amusement park rides €2-4 each",
      hours: "Park: Always open, Rides: 10:00 AM - 6:00 PM (seasonal)",
      tips: [
        "Take U1 to Praterstern station",
        "Riesenrad cabins hold 15 people, take 20 minutes",
        "Visit early morning for fewer crowds",
        "Combined tickets available for multiple attractions",
        "Beautiful in spring with cherry blossoms"
      ]
    },
    naschmarkt: {
      title: "Naschmarkt",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Naschmarkt_Vienna.jpg/800px-Naschmarkt_Vienna.jpg",
      description: "Vienna's most famous market, established in 1793, is a vibrant food market that has evolved into a cultural hub. This mile-long market offers everything from fresh produce and international cuisine to vintage clothing and handmade crafts. It's also famous for its bars and restaurants that come alive in the evenings.",
      details: [
        "• Vienna's largest and most famous food market since 1793",
        "• Over 120 market stalls with international cuisine",
        "• Famous for fresh produce, spices, and street food",
        "• Vintage shops, flower stalls, and handmade crafts",
        "• Evening bars and restaurants transform the atmosphere",
        "• Popular with locals and tourists alike",
        "• Weekend flea market with antiques and collectibles"
      ],
      website: "https://www.naschmarkt-vienna.com",
      price: "Free entry, food from €5-15 per person",
      hours: "Mon-Fri 6:00 AM - 8:00 PM, Sat 6:00 AM - 6:00 PM",
      tips: [
        "Visit Saturday morning for the flea market",
        "Try the Naschmarkt's famous chicken soup",
        "Many stalls have English menus and speak English",
        "Evening bars popular with young locals",
        "Take U4 to Kettenbrückengasse or Karlsplatz",
        "Great for picnic supplies and local specialties"
      ]
    }
  };

  const data = attractionData[attraction];
  if (!data) return null;

  return (
    <Dialog
      open={!!attraction}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          {data.title}
        </Typography>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Box
            component="img"
            src={data.image}
            alt={data.title}
            sx={{
              width: '100%',
              height: 300,
              objectFit: 'cover',
              borderRadius: 1,
              mb: 3
            }}
          />

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            {data.description}
          </Typography>

          <Typography variant="h6" gutterBottom color="primary">
            Key Features & Highlights
          </Typography>
          <List dense sx={{ mb: 3 }}>
            {data.details.map((detail, index) => (
              <ListItem key={index}>
                <ListItemText primary={detail} />
              </ListItem>
            ))}
          </List>

          {data.price && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.light' }}>
              <Typography variant="h6" color="white" gutterBottom>
                💰 Admission & Pricing
              </Typography>
              <Typography variant="body1" color="white">
                {data.price}
              </Typography>
            </Paper>
          )}

          {data.hours && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light' }}>
              <Typography variant="h6" color="white" gutterBottom>
                🕐 Opening Hours
              </Typography>
              <Typography variant="body1" color="white">
                {data.hours}
              </Typography>
            </Paper>
          )}

          {data.tips && (
            <>
              <Typography variant="h6" gutterBottom color="primary">
                💡 Visitor Tips
              </Typography>
              <List dense sx={{ mb: 3 }}>
                {data.tips.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          variant="contained"
          component={Link}
          href={data.website}
          target="_blank"
          rel="noopener"
          sx={{ mr: 2 }}
        >
          Visit Official Website
        </Button>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Vienna;
