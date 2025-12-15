import React, { useState, useEffect } from 'react';
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
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Euro as EuroIcon,
  Museum as MuseumIcon,
  LocalCafe as CafeIcon,
  DirectionsBus as TransportIcon,
  Celebration as CelebrationIcon,
  Train as TrainIcon,
  Tram as TramIcon,
  DirectionsRailway as DirectionsRailwayIcon,
  Flight as FlightIcon,
  AccessTime as TimeIcon,
  Info as InfoIcon,
  Photo as PhotoIcon,
  Image as ImageIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Enhanced Image Component with Error Handling and Fallbacks
const ViennaImage: React.FC<{
  src: string;
  alt: string;
  height?: number;
  category?: string;
  style?: React.CSSProperties;
}> = ({ src, alt, height = 200, category = 'general', style }) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // High-quality primary images from Unsplash (guaranteed to work)
  const primaryImages = {
    stephansdom: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600&h=400&fit=crop&crop=center",
    belvedere: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center",
    hofburg: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&h=400&fit=crop&crop=center",
    schonbrunn: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center",
    prater: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&crop=center",
    naschmarkt: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop&crop=center",
    cafe_central: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop&crop=center",
    khm: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop&crop=center",
    albertina: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=400&fit=crop&crop=center",
    haus_des_meeres: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center"
  };

  // High-quality fallback images from Unsplash by category
  const fallbackImages = {
    cathedral: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&crop=center",
    palace: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center",
    museum: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center",
    coffee: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop&crop=center",
    market: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop&crop=center",
    restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&crop=center",
    park: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&crop=center",
    aquarium: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center",
    general: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&h=400&fit=crop&crop=center"
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    // First try specific attraction image, then category fallback
    const attractionKey = alt.toLowerCase().replace(/[^a-z]/g, '_').replace(/_+/g, '_');
    if (primaryImages[attractionKey as keyof typeof primaryImages]) {
      setImageSrc(primaryImages[attractionKey as keyof typeof primaryImages]);
    } else {
      setImageSrc(fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.general);
    }
  };

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  return (
    <Box sx={{ position: 'relative', height, overflow: 'hidden', borderRadius: 1 }}>
      {isLoading && (
        <Skeleton
          variant="rectangular"
          height={height}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1,
            borderRadius: 1
          }}
        />
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: isLoading ? 'none' : 'block',
          borderRadius: '4px',
          ...style
        }}
      />
      {hasError && !isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(0,0,0,0.7)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            zIndex: 2
          }}
        >
          <ImageIcon sx={{ fontSize: 14 }} />
          Photo
        </Box>
      )}
    </Box>
  );
};

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
          <ViennaImage
            src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop&crop=center"
            alt="St. Stephen's Cathedral"
            category="cathedral"
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
          <ViennaImage
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center"
            alt="Belvedere Palace"
            category="palace"
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
          <ViennaImage
            src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop&crop=center"
            alt="Hofburg Imperial Palace"
            category="palace"
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
            image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&crop=center"
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
            image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&crop=center"
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
            image="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop&crop=center"
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
            image="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop&crop=center"
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
            image="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&h=400&fit=crop&crop=center"
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
            image="https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&h=400&fit=crop&crop=center"
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
            image="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center"
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
            image="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center"
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
            image="https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&h=400&fit=crop&crop=center"
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
            image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center"
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
    <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
      🚇 Vienna Public Transport - World-Class System
    </Typography>

    <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
      Vienna boasts one of Europe's most efficient and extensive public transport networks, serving over 2.6 million passengers daily.
      The integrated system covers the entire city and surrounding areas with excellent frequency, reliability, and coverage.
    </Typography>

    <Grid container spacing={3}>
      {/* U-Bahn Metro */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', border: '2px solid #1976d2' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrainIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">U-Bahn (Metro)</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              5 lines (U1-U4, U6) covering 83.3 km with 109 stations. Known for its distinctive red, white, and blue color scheme.
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Lines & Coverage:</Typography>
              <Typography variant="body2" component="div">
                • <strong>U1:</strong> Red line - North-South through city center<br/>
                • <strong>U2:</strong> Purple line - East-West, Karlsplatz to Stadlau<br/>
                • <strong>U3:</strong> Orange line - North-South, Ottakring to Simmering<br/>
                • <strong>U4:</strong> Green line - Short line through city center<br/>
                • <strong>U6:</strong> Brown line - Northwest to Southeast
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              Frequency: Every 2-5 minutes during peak hours, 5-8 minutes off-peak
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* S-Bahn Suburban Rail */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', border: '2px solid #388e3c' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DirectionsRailwayIcon sx={{ mr: 1, color: '#388e3c' }} />
              <Typography variant="h6">S-Bahn (Suburban Rail)</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              12 lines connecting Vienna to surrounding areas, airports, and regional destinations. Essential for airport access.
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Key Lines:</Typography>
              <Typography variant="body2" component="div">
                • <strong>S1-S8:</strong> Regional lines to Lower Austria<br/>
                • <strong>S7:</strong> Vienna Airport to city center (16 min)<br/>
                • <strong>S45:</strong> Vienna Airport to Wien Mitte (16 min)<br/>
                • <strong>S50:</strong> North-South through city<br/>
                • <strong>S60:</strong> To Bratislava (2.5 hours)
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              Vienna Airport: CAT (City Airport Train) from city center in 16 minutes
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Trams */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', border: '2px solid #f57c00' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TramIcon sx={{ mr: 1, color: '#f57c00' }} />
              <Typography variant="h6">Trams</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              29 lines covering 176.9 km, making Vienna one of Europe's most tram-dependent cities. Iconic yellow trams.
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Popular Lines:</Typography>
              <Typography variant="body2" component="div">
                • <strong>1:</strong> Ring tram around city center<br/>
                • <strong>2:</strong> Along Danube Canal<br/>
                • <strong>D:</strong> Through city center<br/>
                • <strong>O:</strong> Karlsplatz to Raxstraße<br/>
                • <strong>71:</strong> To Kahlenberg viewpoint
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              Frequency: Every 4-8 minutes, historic trams still in service on line 1
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Buses */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', border: '2px solid #7b1fa2' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TransportIcon sx={{ mr: 1, color: '#7b1fa2' }} />
              <Typography variant="h6">Buses</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              127 lines complementing metro and tram networks, especially in outer districts and for airport connections.
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Key Services:</Typography>
              <Typography variant="body2" component="div">
                • <strong>Express lines:</strong> VAL 1-3 for airport<br/>
                • <strong>Night buses:</strong> N25, N38, N60, N66<br/>
                • <strong>Airport buses:</strong> Direct from city center<br/>
                • <strong>VIP buses:</strong> Premium airport service
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              Airport: VAL lines connect Vienna Airport to city center in 45-75 minutes
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {/* Ticketing System */}
    <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
        🎫 Ticketing System
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ mb: 2, color: 'secondary.main' }}>
            Single Tickets & Passes
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 2 }}>
            • <strong>Single ticket:</strong> €2.40 (valid 1 hour)<br/>
            • <strong>24-hour ticket:</strong> €8.00<br/>
            • <strong>48-hour ticket:</strong> €14.10<br/>
            • <strong>72-hour ticket:</strong> €17.10<br/>
            • <strong>Weekly ticket:</strong> €17.10<br/>
            • <strong>Monthly pass:</strong> €51.00<br/>
            • <strong>Annual pass:</strong> €365.00
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            All tickets valid on entire network (U-Bahn, S-Bahn, trams, buses, regional trains)
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ mb: 2, color: 'secondary.main' }}>
            Vienna Pass Integration
          </Typography>
          <Typography variant="body2" component="div">
            • <strong>72-hour Vienna Pass:</strong> €99 (includes unlimited transport)<br/>
            • <strong>Card holders:</strong> 50% discount on single tickets<br/>
            • <strong>Seniors (65+):</strong> Reduced fares available<br/>
            • <strong>Youth (6-15):</strong> 50% discount<br/>
            • <strong>Children under 6:</strong> Free travel
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
            Buy tickets at machines, apps, or Wiener Linien shops. Validate before boarding!
          </Typography>
        </Grid>
      </Grid>
    </Paper>

    {/* Night Services */}
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
        🌙 Night Services (Nightline)
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Vienna operates an excellent night transport system from 12:30 AM to 5:00 AM:
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2">Night Buses:</Typography>
          <Typography variant="body2">
            N25, N38, N60, N66 - Every 30 minutes, covering main routes
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2">Night Trams:</Typography>
          <Typography variant="body2">
            Lines: 1, 5, 6, 9, 18, 31, 33, 37, 38, 41, 42, 43, 44, 49, 52
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2">Night Trains:</Typography>
          <Typography variant="body2">
            S-Bahn lines continue until 12:30 AM, then limited night service
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
        Night services use regular tickets. Special night buses operate between major nightlife areas.
      </Typography>
    </Paper>

    {/* Practical Information */}
    <Paper sx={{ p: 3, mt: 3, bgcolor: 'primary.light', color: 'white' }}>
      <Typography variant="h6" gutterBottom>
        💡 Practical Tips for Tourists
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'white' }}>Navigation:</Typography>
          <Typography variant="body2" component="div" sx={{ color: 'white' }}>
            • <strong>Wiener Linien app:</strong> Real-time schedules and journey planning<br/>
            • <strong>Google Maps:</strong> Integrated with public transport<br/>
            • <strong>Wiener Linien website:</strong> Route planning and maps<br/>
            • <strong>Physical maps:</strong> Available at tourist offices and hotels
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'white' }}>Important Rules:</Typography>
          <Typography variant="body2" component="div" sx={{ color: 'white' }}>
            • <strong>Validate tickets</strong> before boarding (stamp machines)<br/>
            • <strong>Exit through turnstiles</strong> at destination<br/>
            • <strong>No eating/drinking</strong> on U-Bahn and most trams<br/>
            • <strong>Give up seats</strong> for elderly, disabled, pregnant passengers<br/>
            • <strong>Quiet zones</strong> marked in carriages
          </Typography>
        </Grid>
      </Grid>
    </Paper>

    {/* Accessibility */}
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
        ♿ Accessibility & Special Services
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Vienna's public transport is highly accessible with modern facilities:
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2">Wheelchair Access:</Typography>
          <Typography variant="body2">
            All U-Bahn stations and most trams equipped with lifts and ramps
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2">Visual Aids:</Typography>
          <Typography variant="body2">
            Audio announcements, tactile paving, Braille signage
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2">Assistance:</Typography>
          <Typography variant="body2">
            Call 05-1717 for help with navigation and boarding
          </Typography>
        </Grid>
      </Grid>
    </Paper>

    {/* Tourist Information */}
    <Paper sx={{ p: 3, mt: 3, bgcolor: 'secondary.light' }}>
      <Typography variant="h6" gutterBottom>
        🗺️ Tourist Information Centers
      </Typography>
      <Typography variant="body2" component="div">
        • <strong>Main Tourist Office:</strong> Albertinaplatz 1 (near Opera House)<br/>
        • <strong>Airport Tourist Info:</strong> Vienna International Airport<br/>
        • <strong>Railway Station Info:</strong> Wien Hauptbahnhof and Wien Westbahnhof<br/>
        • <strong>Online:</strong> Visit www.wien.info for transport information
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
        Free city maps, Vienna Pass sales, and personalized route planning available at all tourist offices.
      </Typography>
    </Paper>

    {/* System Statistics */}
    <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
        📊 Vienna Transport by Numbers
      </Typography>
      <Grid container spacing={2} sx={{ textAlign: 'center' }}>
        <Grid item xs={6} sm={3}>
          <Typography variant="h4" sx={{ color: 'secondary.main' }}>2.6M</Typography>
          <Typography variant="body2">Daily Passengers</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="h4" sx={{ color: 'secondary.main' }}>1,200+</Typography>
          <Typography variant="body2">Stations & Stops</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="h4" sx={{ color: 'secondary.main' }}>1,900km</Typography>
          <Typography variant="body2">Total Network Length</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="h4" sx={{ color: 'secondary.main' }}>99.5%</Typography>
          <Typography variant="body2">Punctuality Rate</Typography>
        </Grid>
      </Grid>
    </Box>
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
      hours: "Daily 10:00 AM - 6:00 PM",
      tips: [
        "Picnic in Belvedere Park is not allowed on the lawn - stepping on the lawn is forbidden",
        "Visit early to see Klimt's works before crowds arrive",
        "The botanical garden next to Belvedere is beautiful",
        "Alpengarten (Alpine Garden) nearby showcases Austrian flora",
        "Combined ticket saves €8 and is valid for 2 days"
      ]
    },
    hofburg: {
      title: "Hofburg Imperial Palace",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Hofburg_Palace%2C_Vienna.jpg/800px-Hofburg_Palace%2C_Vienna.jpg",
      description: "The Hofburg was the residence of the Habsburg dynasty for over 600 years. This vast complex includes imperial apartments, the Spanish Riding School, and the Imperial Silver Collection. It represents the power and opulence of the Austro-Hungarian Empire.",
      details: [
        "• Imperial Apartments: opulent rooms used by emperors and their families",
        "• Spanish Riding School: world-famous Lipizzaner stallions",
        "• Imperial Silver Collection: priceless tableware and artifacts",
        "• Sisi Museum: dedicated to Empress Elisabeth",
        "• Chapel Court: where Mozart performed as a child",
        "• Papal apartments used during visits to Vienna"
      ],
      website: "https://www.hofburg-wien.at",
      price: "€20 for Imperial Apartments tour, €16 for Silver Collection",
      hours: "Daily 9:00 AM - 5:00 PM (except Tuesdays)",
      tips: [
        "Imperial Apartments require guided tour (audio guide available)",
        "Spanish Riding School performances require separate tickets",
        "Visit early morning to avoid tour groups",
        "The complex is huge - plan for at least 2-3 hours",
        "Café Hofburg in the complex serves traditional Austrian cuisine"
      ]
    },
    schonbrunn: {
      title: "Schönbrunn Palace & Gardens",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Sch%C3%B6nbrunn_Palace%2C_Vienna.jpg/800px-Sch%C3%B6nbrunn_Palace%2C_Vienna.jpg",
      description: "Schönbrunn Palace is Vienna's answer to Versailles. Built as a summer residence for the Habsburgs, it features 1,441 rooms, beautiful gardens, and the world's oldest zoo. The palace and gardens cover 160 hectares.",
      details: [
        "• 1,441 rooms, but only 40 are open to public",
        "• Grand Gallery: site of Mozart's first public performance",
        "• Schönbrunn Zoo: world's oldest zoo (1752)",
        "• Gloriette: triumphal arch with panoramic views",
        "• Maze and Labyrinth for children",
        "• Orangery with seasonal flower displays"
      ],
      website: "https://www.schoenbrunn.at",
      price: "€22 for palace tour, €12 for gardens only",
      hours: "Daily 8:00 AM - 6:00 PM (gardens), palace until 5:00 PM",
      tips: [
        "Tram D goes directly from city center to Schönbrunn",
        "Visit gardens early morning for peaceful walks",
        "Zoo is separate entrance and has additional €22 entry",
        "Picnic areas available in the gardens",
        "Audio guides available in multiple languages"
      ]
    },
    prater: {
      title: "Prater Park & Giant Ferris Wheel",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Prater_Wheel_Vienna.jpg/800px-Prater_Wheel_Vienna.jpg",
      description: "The Prater is Vienna's premier recreational area, combining amusement park rides with beautiful green spaces. The iconic Riesenrad (Giant Ferris Wheel) has been a Vienna landmark since 1897 and offers stunning city views.",
      details: [
        "• Riesenrad: 64 meter tall Ferris wheel with cabin views",
        "• Planetarium and Madame Tussauds wax museum",
        "• Liliput miniature village with tiny houses",
        "• Traditional carousel and historic rides",
        "• Beautiful green spaces for picnics and walks",
        "• Beer gardens and restaurants"
      ],
      website: "https://www.wienerriesenrad.com",
      price: "€16 for Riesenrad ride, free entry to Prater park",
      hours: "Park: Daily 24/7, Rides: 10:00 AM - 6:00 PM (seasonal)",
      tips: [
        "Riesenrad cabins accommodate up to 8 people",
        "Best views from Riesenrad are at sunset",
        "U1 metro line goes directly to Praterstern station",
        "Many rides close in winter - check seasonal schedule",
        "Traditional Austrian food available at on-site restaurants"
      ]
    },
    naschmarkt: {
      title: "Naschmarkt",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Naschmarkt_Wien.jpg/800px-Naschmarkt_Wien.jpg",
      description: "Vienna's most famous market, the Naschmarkt has been a food market since 1793. This vibrant market offers everything from fresh produce and international cuisine to antiques and street food. It's a microcosm of Vienna's multicultural character.",
      details: [
        "• Over 120 market stalls with international cuisine",
        "• Fresh produce, spices, and delicatessen items",
        "• Antique shops and flea market sections",
        "• Famous for its sarma (cabbage rolls) and falafel",
        "• Wine bars and casual restaurants",
        "• Live music and cultural events"
      ],
      website: "https://www.wien.gv.at",
      price: "Free entry, food prices vary (€5-15 per meal)",
      hours: "Mon-Fri 6:00 AM - 6:00 PM, Sat 6:00 AM - 5:00 PM",
      tips: [
        "Visit Saturday morning when it's most lively",
        "Try the Bitzinger Würstelstand for authentic sausages",
        "Many vendors accept only cash",
        "Located between Karlsplatz and Kettenbrückengasse in the 4th district",
        "Great place to experience Vienna's diversity"
      ]
    },
    khm: {
      title: "Kunsthistorisches Museum (KHM)",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Kunsthistorisches_Museum_Wien.jpg/800px-Kunsthistorisches_Museum_Wien.jpg",
      description: "Housed in a magnificent neo-Renaissance building, the Kunsthistorisches Museum contains one of the world's most important art collections. The Habsburgs' treasures include works by Bruegel, Rubens, and Vermeer.",
      details: [
        "• World's largest Bruegel collection (12 paintings)",
        "• Imperial Picture Gallery with masterpieces from 1500-1800",
        "• Kunstkammer: collection of curiosities and artifacts",
        "• Egyptian and Near Eastern antiquities",
        "• Greek and Roman antiquities",
        "• Numismatic collection (coins and medals)"
      ],
      website: "https://www.khm.at",
      price: "€20 regular, €17 reduced, €25 family ticket",
      hours: "Daily 10:00 AM - 6:00 PM, Thu until 9:00 PM",
      tips: [
        "Allow 2-3 hours for thorough visit",
        "Audio guide highly recommended (€5)",
        "Thursday evening visits are quieter",
        "Café in the museum serves traditional Austrian food",
        "Wheelchair accessible with elevators"
      ]
    },
    albertina: {
      title: "Albertina Museum",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Albertina_Wien.jpg/800px-Albertina_Wien.jpg",
      description: "The Albertina houses the world's largest collection of graphic art, with over 65,000 drawings and 1 million prints. It features contemporary art exhibitions and stunning architectural spaces.",
      details: [
        "• Largest graphic art collection worldwide",
        "• Temporary exhibitions of contemporary art",
        "• Monet, Picasso, and Warhol collections",
        "• State Rooms with stunning architecture",
        "• Rooftop terrace with city views"
      ],
      website: "https://www.albertina.at",
      price: "€19 regular, €16.50 reduced, €17.50 for contemporary exhibitions",
      hours: "Daily 10:00 AM - 6:00 PM, Wed until 9:00 PM",
      tips: [
        "Rooftop terrace has great views and a café",
        "Wednesday evening is less crowded",
        "Graphic art collection requires separate ticket",
        "Photography allowed in most areas"
      ]
    },
    albertina_modern: {
      title: "Albertina Modern",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Albertina_Modern_Wien.jpg/800px-Albertina_Modern_Wien.jpg",
      description: "Located in the former Hotel Schwarzenberg, Albertina Modern focuses exclusively on 20th and 21st-century art. The museum presents works from artists like Picasso, Mondrian, and contemporary Austrian artists.",
      details: [
        "• 20th and 21st-century Austrian and international art",
        "• Works by Picasso, Mondrian, and Warhol",
        "• Contemporary Austrian artists",
        "• Temporary exhibitions of modern art",
        "• Located in historic Hotel Schwarzenberg",
        "• Focus on post-WWII art movements"
      ],
      website: "https://www.albertina.at",
      price: "€17.50 regular, €15 reduced",
      hours: "Daily 10:00 AM - 6:00 PM",
      tips: [
        "Combined ticket with main Albertina available",
        "Located in the elegant Schwarzenberg Palace",
        "Contemporary focus complements main Albertina",
        "Café serves modern Austrian cuisine",
        "Smaller venue allows focused visits"
      ]
    },
    belvedere_upper: {
      title: "Upper Belvedere",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Upper_Belvedere_Vienna.jpg/800px-Upper_Belvedere_Vienna.jpg",
      description: "The Upper Belvedere houses the permanent collection of Austrian art from the Middle Ages to the present. It's home to Gustav Klimt's masterpiece 'The Kiss' and works by Egon Schiele, Oskar Kokoschka, and other Austrian modernists.",
      details: [
        "• Austrian art from Middle Ages to present day",
        "• Klimt's 'The Kiss' and other masterpieces",
        "• Egon Schiele and Oskar Kokoschka works",
        "• Medieval art collection",
        "• Baroque Austrian painting",
        "• Modern Austrian art movements"
      ],
      website: "https://www.belvedere.at",
      price: "€16 regular, combined ticket with Lower Belvedere €22",
      hours: "Daily 10:00 AM - 6:00 PM",
      tips: [
        "Klimt Room is usually crowded - visit early",
        "Audio guide (€5) provides excellent context",
        "Lower Belvedere can be visited same day with combined ticket",
        "Gardens are beautiful for strolls between palaces",
        "Photography allowed without flash"
      ]
    },
    belvedere_lower: {
      title: "Lower Belvedere",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Belvedere_Palace_Vienna.jpg/800px-Belvedere_Palace_Vienna.jpg",
      description: "The Lower Belvedere focuses on international Baroque art and features temporary exhibitions. The palace itself is a masterpiece of Baroque architecture with stunning interiors and formal gardens.",
      details: [
        "• International Baroque art collection",
        "• Temporary exhibitions of various art periods",
        "• Marble Hall with ceiling frescoes",
        "• State rooms with period furniture",
        "• Formal French gardens",
        "• Orangery for seasonal exhibitions"
      ],
      website: "https://www.belvedere.at",
      price: "€14 regular, combined ticket with Upper Belvedere €22",
      tips: [
        "Marble Hall is the highlight of the palace",
        "Gardens are perfect for picnics (designated areas only)",
        "Combined ticket saves money and time",
        "Visit gardens in spring for flower displays",
        "Café in Lower Belvedere serves traditional Austrian food"
      ]
    },
    naturhistorisches: {
      title: "Naturhistorisches Museum",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Naturhistorisches_Museum_Wien.jpg/800px-Naturhistorisches_Museum_Wien.jpg",
      description: "One of the world's most important natural history museums, featuring the famous Venus of Willendorf (25,000 years old), dinosaur skeletons, and extensive geology and biology collections. The museum's architecture is equally impressive.",
      details: [
        "• Venus of Willendorf (oldest known art in world)",
        "• Complete dinosaur skeletons including T-Rex",
        "• Vast geology collection with crystals and minerals",
        "• Anthropology exhibits from around the world",
        "• Tropical butterfly house",
        "• Vast biology collections"
      ],
      website: "https://www.nhm-wien.ac.at",
      price: "€14 regular, €10 reduced, €30 family",
      hours: "Daily 9:00 AM - 6:30 PM, Wed until 9:00 PM",
      tips: [
        "Venus of Willendorf is in a special display case",
        "Dinosaur hall is impressive for all ages",
        "Wednesday evening is less crowded",
        "Interactive exhibits for children",
        "Café serves traditional Austrian food"
      ]
    },
    technisches: {
      title: "Technisches Museum",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Technisches_Museum_Wien.jpg/800px-Technisches_Museum_Wien.jpg",
      description: "The Technical Museum showcases Austria's industrial and technological heritage. It houses the world's largest collection of motorcycles, historic cars, aircraft, and industrial machinery. Interactive exhibits make it engaging for all ages.",
      details: [
        "• World's largest motorcycle collection",
        "• Historic cars and locomotives",
        "• Aircraft and aviation history",
        "• Industrial machinery from various eras",
        "• Interactive science and technology exhibits",
        "• Children's science center"
      ],
      website: "https://www.technischesmuseum.at",
      price: "€14 regular, €10 reduced, €35 family",
      hours: "Daily 9:00 AM - 6:00 PM",
      tips: [
        "Motorcycle collection is world-renowned",
        "Interactive exhibits are great for families",
        "Science center has hands-on experiments",
        "Visit early to see the full collection",
        "Café serves modern Austrian cuisine"
      ]
    },
    heeresgeschichtliches: {
      title: "Heeresgeschichtliches Museum",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Heeresgeschichtliches_Museum_Wien.jpg/800px-Heeresgeschichtliches_Museum_Wien.jpg",
      description: "Located in the Arsenal complex, this military history museum chronicles Austria's military history from the 16th century to the present. It features extensive collections of weapons, uniforms, and military artifacts.",
      details: [
        "• Austrian military history from 16th century",
        "• Weapons and armor collections",
        "• Uniforms from various historical periods",
        "• Military vehicles and artillery",
        "• WWI and WWII exhibits",
        "• Modern Austrian military equipment"
      ],
      website: "https://www.hgm.at",
      price: "€8 regular, €4 reduced",
      hours: "Tue-Sun 9:00 AM - 5:00 PM",
      tips: [
        "Extensive collection spans multiple buildings",
        "Audio guide recommended (€3)",
        "Located in historic Arsenal complex",
        "Tuesday is free entry day",
        "Military history buffs will love the detail"
      ]
    },
    haus_der_musik: {
      title: "Haus der Musik",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Haus_der_Musik_Wien.jpg/800px-Haus_der_Musik_Wien.jpg",
      description: "An interactive museum dedicated to music and sound, located in the former palace of the Archduke Charles. Features exhibits on Vienna's musical heritage, interactive sound installations, and a special Mozart room.",
      details: [
        "• Interactive exhibits on music and sound",
        "• Vienna's musical heritage and composers",
        "• Special Mozart room with interactive exhibits",
        "• Sound installations and experiments",
        "• Historical instruments collection",
        "• Recording studio experience"
      ],
      website: "https://www.hausdermusik.com",
      price: "€14 regular, €11 reduced, €38 family",
      hours: "Daily 10:00 AM - 10:00 PM",
      tips: [
        "Interactive exhibits are engaging for all ages",
        "Mozart room is a highlight for families",
        "Evening visits have live music sometimes",
        "Located in historic palace building",
        "Audio guide in multiple languages"
      ]
    },
    haus_des_meeres: {
      title: "Haus des Meeres",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Haus_des_Meeres_Wien.jpg/800px-Haus_des_Meeres_Wien.jpg",
      description: "Located in a WWII flak tower bunker, Haus des Meeres is Vienna's aquarium featuring over 10,000 marine creatures. The building itself has historical significance as a remnant of Vienna's wartime defenses.",
      details: [
        "• Over 10,000 marine creatures",
        "• Tropical and cold water exhibits",
        "• Shark tunnel and coral reefs",
        "• Touch pools and interactive exhibits",
        "• Located in WWII flak tower bunker",
        "• Historical exhibits about the building"
      ],
      website: "https://www.haus-des-meeres.at",
      price: "€22 regular, €19 reduced, €59 family",
      hours: "Daily 10:00 AM - 6:00 PM",
      tips: [
        "Shark tunnel is impressive for children",
        "Building was part of Vienna's WWII defenses",
        "Interactive exhibits teach about marine life",
        "Visit during school holidays for special events",
        "Café serves light meals and snacks"
      ]
    },
    cafe_central: {
      title: "Café Central",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Cafe_Central_Wien.jpg/800px-Cafe_Central_Wien.jpg",
      description: "One of Vienna's most famous coffee houses, Café Central opened in 1876 in the former bank building of the Austrian National Bank. It was a meeting place for intellectuals like Freud, Trotsky, and Lenin. The famous queue at the entrance is part of the experience.",
      details: [
        "• Historic coffee house since 1876",
        "• Meeting place for Freud, Trotsky, Lenin",
        "• Famous queue at entrance (worth the wait)",
        "• Traditional Viennese coffee specialties",
        "• Historic interior with marble pillars",
        "• Live piano music in the evenings"
      ],
      website: "https://www.cafecentral.wien",
      price: "€4-8 for coffee and pastries",
      hours: "Daily 7:30 AM - 10:00 PM",
      tips: [
        "The queue is part of the authentic experience",
        "Try the Café Central mélange (marvelous coffee)",
        "Live piano music creates special atmosphere",
        "Located in historic Palais Ferstel",
        "Dress code is smart casual"
      ]
    },
    cafe_sperl: {
      title: "Café Sperl",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Cafe_Sperl_Wien.jpg/800px-Cafe_Sperl_Wien.jpg",
      description: "Established in 1880, Café Sperl is one of Vienna's most beautiful Jugendstil (Art Nouveau) coffee houses. The stunning interior with its ornate decorations, stucco ceilings, and marble tables has remained largely unchanged since 1900.",
      details: [
        "• Jugendstil (Art Nouveau) masterpiece",
        "• Unchanged interior since 1900",
        "• Famous for Sachertorte and apple strudel",
        "• Marble tables and ornate decorations",
        "• Traditional Viennese coffee culture",
        "• Literary history and intellectual gatherings"
      ],
      website: "https://www.cafesperl.at",
      price: "€3-7 for coffee and pastries",
      hours: "Daily 7:00 AM - 8:00 PM",
      tips: [
        "Interior is a work of art - take your time",
        "Try the Sperl Sachertorte (famous variety)",
        "Visit during breakfast for authentic experience",
        "Located in trendy 6th district",
        "No reservations - first come, first served"
      ]
    },
    cafe_hawelka: {
      title: "Café Hawelka",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Cafe_Hawelka_Wien.jpg/800px-Cafe_Hawelka_Wien.jpg",
      description: "A bohemian institution since 1939, Café Hawelka is famous for its Buchteln (sweet yeast dumplings) and intellectual atmosphere. The smoky, lived-in interior attracts artists, writers, and free spirits. It's a place where time seems to stand still.",
      details: [
        "• Bohemian atmosphere since 1939",
        "• Famous for Buchteln (sweet dumplings)",
        "• Intellectual and artistic clientele",
        "• Lived-in, authentic Viennese character",
        "• No music, just conversation",
        "• Traditional coffee house culture"
      ],
      website: "https://www.cafe-hawelka.at",
      price: "€3-6 for coffee and specialties",
      hours: "Daily 8:00 AM - 2:00 AM",
      tips: [
        "Don't miss the Buchteln - they're legendary",
        "Atmosphere is casual and authentic",
        "Long opening hours attract night owls",
        "Located in historic Dorotheergasse",
        "No reservations - come early or late"
      ]
    },
    cafe_demel: {
      title: "Café Demel",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Cafe_Demel_Wien.jpg/800px-Cafe_Demel_Wien.jpg",
      description: "Imperial heritage meets modern luxury at Café Demel, established in 1786 as the court confectioner to the Habsburgs. Located in the Kohlmarkt, it's famous for its luxurious pastries, chocolates, and elegant atmosphere.",
      details: [
        "• Imperial court confectioner since 1786",
        "• Famous for luxury chocolates and pastries",
        "• Elegant atmosphere in Kohlmarkt",
        "• Traditional Austrian confectionery",
        "• Historic connection to Habsburg court",
        "• Modern luxury with imperial tradition"
      ],
      website: "https://www.demel.at",
      price: "€5-12 for coffee and pastries",
      hours: "Daily 9:00 AM - 7:00 PM",
      tips: [
        "Try the Demel Sachertorte (royal version)",
        "Window shopping the luxury chocolates is free",
        "Located in Vienna's most expensive shopping street",
        "Elegant atmosphere with high-end clientele",
        "Perfect for special occasions or luxury treats"
      ]
    },
    cafe_pruckel: {
      title: "Café Prückel",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cafe_Pruckel_Wien.jpg/800px-Cafe_Pruckel_Wien.jpg",
      description: "A hidden gem in Vienna's 19th district, Café Prückel has been serving traditional Austrian cuisine since 1903. Known for its hearty portions, reasonable prices, and authentic local atmosphere, it's a favorite among locals.",
      details: [
        "• Traditional Austrian cuisine since 1903",
        "• Hearty portions at reasonable prices",
        "• Authentic local Viennese atmosphere",
        "• Schnitzel, goulash, and Wiener Meld",
        "• Traditional coffee house culture",
        "• Popular with local residents"
      ],
      website: "https://www.prueckel.at",
      price: "€8-15 for main courses",
      hours: "Daily 9:00 AM - 12:00 AM",
      tips: [
        "Try the Wiener Schnitzel - it's excellent",
        "Reasonable prices compared to city center",
        "Located in residential 19th district",
        "Authentic local experience",
        "Long opening hours for late dining"
      ]
    }
  };

  const data = attractionData[attraction];
  if (!data) return null;

  return (
    <Dialog open={!!attraction} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {data.title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <img
            src={data.image}
            alt={data.title}
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '16px'
            }}
          />
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            {data.description}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
          Key Highlights
        </Typography>
        <Box sx={{ mb: 3 }}>
          {data.details.map((detail, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2 }}>
              {detail}
            </Typography>
          ))}
        </Box>

        {(data.price || data.hours) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Practical Information
            </Typography>
            {data.price && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Price:</strong> {data.price}
              </Typography>
            )}
            {data.hours && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Hours:</strong> {data.hours}
              </Typography>
            )}
          </Box>
        )}

        {data.tips && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Visitor Tips
            </Typography>
            {data.tips.map((tip, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2 }}>
                • {tip}
              </Typography>
            ))}
          </Box>
        )}

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<LaunchIcon />}
            href={data.website}
            target="_blank"
            rel="noopener"
            sx={{ mt: 2 }}
          >
            Visit Official Website
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Vienna;
