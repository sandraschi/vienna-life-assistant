import React from 'react';
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
  Stack
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
  Restaurant as RestaurantIcon
} from '@mui/icons-material';

const Vienna: React.FC = () => {
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

      {/* Quick Facts */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
          🌟 Vienna at a Glance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>1.9M</Typography>
              <Typography variant="body2">Population</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>415km²</Typography>
              <Typography variant="body2">Area</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>23</Typography>
              <Typography variant="body2">Districts</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>€4,500</Typography>
              <Typography variant="body2">Avg Monthly Cost</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content Sections */}
      <Grid container spacing={4}>
        {/* Travel Guide */}
        <Grid item xs={12} lg={8}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="primary" />
                Travel Guide
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ViennaTravelGuide />
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TransportIcon color="primary" />
                Public Transport
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ViennaTransport />
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CelebrationIcon color="primary" />
                Festivals & Events
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ViennaFestivals />
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <ViennaSidebar />
        </Grid>
      </Grid>
    </Container>
  );
};

// Travel Guide Component
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

// Sidebar Component
const ViennaSidebar: React.FC = () => (
  <Box>
    {/* Safety & Practical Info */}
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
        <SecurityIcon /> Safety & Practical
      </Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="✅ Very safe city - walk at night" />
        </ListItem>
        <ListItem>
          <ListItemText primary="💧 Tap water is drinkable" />
        </ListItem>
        <ListItem>
          <ListItemText primary="🏥 Public healthcare excellent" />
        </ListItem>
        <ListItem>
          <ListItemText primary="💶 Euro (€) is currency" />
        </ListItem>
      </List>
    </Paper>

    {/* Free Attractions */}
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#388e3c' }}>
        <ParkIcon /> Free Attractions
      </Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="• St. Stephen's Cathedral" />
        </ListItem>
        <ListItem>
          <ListItemText primary="• Naschmarkt (food market)" />
        </ListItem>
        <ListItem>
          <ListItemText primary="• Stadtpark (city park)" />
        </ListItem>
        <ListItem>
          <ListItemText primary="• Danube Canal walks" />
        </ListItem>
        <ListItem>
          <ListItemText primary="• Belvedere Gardens" />
        </ListItem>
      </List>
    </Paper>

    {/* Vienna Coffee Houses */}
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#8d6e63' }}>
        <CafeIcon /> Famous Coffee Houses
      </Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="🏛️ Demel - Imperial favorite" />
        </ListItem>
        <ListItem>
          <ListItemText primary="📖 Literaturhaus - Literary hub" />
        </ListItem>
        <ListItem>
          <ListItemText primary="🎭 Sperl - Theater district" />
        </ListItem>
        <ListItem>
          <ListItemText primary="🎨 Hawelka - Artists' haunt" />
        </ListItem>
      </List>
    </Paper>

    {/* Cultural Venues */}
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#7b1fa2' }}>
        <MusicIcon /> Music & Culture
      </Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="🎭 Vienna State Opera" />
        </ListItem>
        <ListItem>
          <ListItemText primary="🎼 Musikverein (Golden Hall)" />
        </ListItem>
        <ListItem>
          <ListItemText primary="🎨 Albertina Museum" />
        </ListItem>
        <ListItem>
          <ListItemText primary="🎪 Volksoper" />
        </ListItem>
      </List>
    </Paper>

    {/* Vienna Zoo */}
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ff9800' }}>
        🦁 Schönbrunn Zoo
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        World's oldest zoo, founded in 1752. Features pandas, gorillas, and beautiful gardens.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Adults: €25 | Children: €12
        </Typography>
        <Chip size="small" label="UNESCO Site" color="primary" />
      </Box>
    </Paper>
  </Box>
);

export default Vienna;
