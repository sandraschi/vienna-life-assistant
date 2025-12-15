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
  Chip,
  Paper,
  Stack,
  Tabs,
  Tab,
  Button,
  Link
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Euro as EuroIcon,
  Museum as MuseumIcon,
  LocalCafe as CafeIcon,
  DirectionsBus as TransportIcon,
  Celebration as CelebrationIcon,
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
          <Tab icon={<MuseumIcon />} iconPosition="start" label="Museums" />
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
          <ViennaMuseums onAttractionClick={setSelectedAttraction} />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <ViennaPass />
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <ViennaDayTrips />
        </TabPanel>

        <TabPanel value={activeTab} index={5}>
          <ViennaTransport />
        </TabPanel>

        <TabPanel value={activeTab} index={6}>
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

// Museums Component
const ViennaMuseums: React.FC<{ onAttractionClick: (attraction: string) => void }> = ({ onAttractionClick }) => (
  <Box>
    <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
      🏛️ Vienna's World-Class Museums
    </Typography>

    <Typography variant="body1" sx={{ mb: 3 }}>
      Vienna boasts some of Europe's finest museums, housing priceless collections from ancient civilizations
      to contemporary art. Many are located on the Museum Quarter (MuseumsQuartier) and offer combined tickets
      and special exhibitions throughout the year.
    </Typography>

    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('khm')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Kunsthistorisches_Museum_Wien.jpg/800px-Kunsthistorisches_Museum_Wien.jpg"
            alt="Kunsthistorisches Museum"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Kunsthistorisches Museum</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              World's largest Bruegel collection and imperial art treasures. Home to masterpieces by Raphael, Rubens, and Rembrandt.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Imperial Palace" color="warning" />
              <Chip size="small" label="€20" color="primary" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('albertina')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Albertina_Vienna.jpg/800px-Albertina_Vienna.jpg"
            alt="Albertina Museum"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Albertina Museum</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Largest collection of graphic art worldwide. Features Dürer, Monet, and stunning rooftop views of Vienna.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Graphic Art" color="success" />
              <Chip size="small" label="€19" color="primary" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('albertina_modern')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Albertina_Modern_Vienna.jpg/800px-Albertina_Modern_Vienna.jpg"
            alt="Albertina Modern"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Albertina Modern</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Modern and contemporary art in historic Künstlerhaus. Features Picasso, Mondrian, and Austrian modern masters.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Modern Art" color="secondary" />
              <Chip size="small" label="€14" color="primary" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('belvedere_upper')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Belvedere_Palace_Vienna.jpg/800px-Belvedere_Palace_Vienna.jpg"
            alt="Upper Belvedere"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Upper Belvedere</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              World's largest Klimt collection including 'The Kiss'. Baroque masterpiece with imperial art treasures.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Klimt" color="error" />
              <Chip size="small" label="€16" color="primary" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('belvedere_lower')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Belvedere_Lower_Vienna.jpg/800px-Belvedere_Lower_Vienna.jpg"
            alt="Lower Belvedere"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Lower Belvedere</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Intimate Baroque palace with temporary exhibitions and beautiful garden café. More relaxed than Upper.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Contemporary Art" color="info" />
              <Chip size="small" label="€14" color="primary" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('naturhistorisches')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Naturhistorisches_Museum_Wien.jpg/800px-Naturhistorisches_Museum_Wien.jpg"
            alt="Natural History Museum"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Natural History Museum</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Venus of Willendorf, dinosaur skeletons, and vast mineral collections. One of Europe's finest natural history museums.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Dinosaurs" color="success" />
              <Chip size="small" label="€14" color="primary" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('technisches')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Technisches_Museum_Wien.jpg/800px-Technisches_Museum_Wien.jpg"
            alt="Technical Museum"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Technical Museum</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              World's largest motorcycle collection, historic cars, aircraft, and Austrian inventions. Interactive technology exhibits.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Technology" color="warning" />
              <Chip size="small" label="€14" color="primary" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('heeresgeschichtliches')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Heeresgeschichtliches_Museum_Wien.jpg/800px-Heeresgeschichtliches_Museum_Wien.jpg"
            alt="Army History Museum"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Army History Museum</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Habsburg military history in imperial arsenal. Weapons, armor, vehicles, and artworks from centuries of campaigns.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Military History" color="error" />
              <Chip size="small" label="€8" color="primary" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('haus_der_musik')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Haus_der_Musik_Wien.jpg/800px-Haus_der_Musik_Wien.jpg"
            alt="Haus der Musik"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Haus der Musik</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Interactive music museum exploring sound science and Vienna's musical heritage. Composer rooms and recording studio.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="Interactive" color="secondary" />
              <Chip size="small" label="€16" color="primary" />
            </Stack>
            <Button variant="outlined" size="small" fullWidth>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => onAttractionClick('haus_des_meeres')}>
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Haus_des_Meeres_Wien.jpg/800px-Haus_des_Meeres_Wien.jpg"
            alt="Haus des Meeres"
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>Haus des Meeres</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Aquarium in WWII bunker with sharks, rays, and 10,000+ marine creatures. Unique combination of military history and marine biology.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip size="small" label="WWII Bunker" color="error" />
              <Chip size="small" label="€22" color="primary" />
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

// ViennaTravelGuide component removed - content preserved in main component
// Stub components for Vienna tabs
const ViennaTransport: React.FC = () => (
  <Box>
    <Typography variant="h6" gutterBottom>🚇 Vienna Public Transport</Typography>
    <Typography variant="body2">
      Vienna's public transport system is world-class with U-Bahn, S-Bahn, trams, and buses.
    </Typography>
  </Box>
);

const ViennaFestivals: React.FC = () => (
  <Box>
    <Typography variant="h6" gutterBottom>🎉 Vienna Festivals</Typography>
    <Typography variant="body2">
      From Christmas markets to the Danube Island Festival, Vienna offers year-round celebrations.
    </Typography>
  </Box>
);

const AttractionDetailDialog: React.FC<{ attraction: string | null; onClose: () => void }> = ({ attraction: _attraction, onClose: _onClose }) => (
  <div>Attraction details would go here</div>
);

export default Vienna;
