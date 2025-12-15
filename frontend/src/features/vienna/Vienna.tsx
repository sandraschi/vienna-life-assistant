import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Chip,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Euro as EuroIcon,
  Museum as MuseumIcon,
  LocalCafe as CafeIcon,
  DirectionsBus as TransportIcon,
  Celebration as CelebrationIcon,
  Train as TrainIcon,
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

// Transport Component
const ViennaTransport: React.FC = () => (
  <Box>
    <Typography variant='h6' gutterBottom>
      🚇 Vienna Public Transport System
    </Typography>
    <Typography variant='body2'>
      Vienna's public transport is world-class with U-Bahn, S-Bahn, trams, and buses.
    </Typography>
  </Box>
);

// Festivals Component
const ViennaFestivals: React.FC = () => (
  <Box>
    <Typography variant='h6' gutterBottom>
      🎉 Vienna Festivals & Events
    </Typography>
    <Typography variant='body2'>
      From Christmas markets to the Danube Island Festival, Vienna offers year-round celebrations.
    </Typography>
  </Box>
);

// Attraction Detail Dialog
const AttractionDetailDialog: React.FC<{ attraction: string | null; onClose: () => void }> = ({ attraction: _attraction, onClose: _onClose }) => (
  <div>Attraction details would go here</div>
);

// Missing component stubs for Vienna tabs
const ViennaAttractions: React.FC<{ onAttractionClick: (attraction: string) => void }> = ({ onAttractionClick: _onAttractionClick }) => (
  <Box>Attractions component</Box>
);

const ViennaCoffeeHouses: React.FC<{ onAttractionClick: (attraction: string) => void }> = ({ onAttractionClick: _onAttractionClick }) => (
  <Box>Coffee houses component</Box>
);

const ViennaMuseums: React.FC<{ onAttractionClick: (attraction: string) => void }> = ({ onAttractionClick: _onAttractionClick }) => (
  <Box>Museums component</Box>
);

const ViennaPass: React.FC = () => (
  <Box>Vienna Pass component</Box>
);

const ViennaDayTrips: React.FC = () => (
  <Box>Day trips component</Box>
);

// ViennaTravelGuide content removed - integrated into main component

export default Vienna;
