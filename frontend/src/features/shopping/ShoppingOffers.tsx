import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  LocalOffer as OfferIcon,
} from '@mui/icons-material';
import { shoppingApi } from '../../services/api';

interface Offer {
  id: string;
  store: string;
  product_name: string;
  discounted_price: number;
  original_price?: number;
  discount_percentage: number;
  category: string;
  image_url?: string;
  valid_from: string;
  valid_until: string;
}

export default function ShoppingOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>('all');

  useEffect(() => {
    loadOffers();
    loadStats();
  }, [selectedStore]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const params: any = { page_size: 50 };
      if (selectedStore !== 'all') {
        params.store = selectedStore;
      }
      const response = await shoppingApi.getOffers(params);
      setOffers(response.data.offers);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await shoppingApi.getStats();
      setStats(response.data);
    } catch (err) {
      // Stats are optional
    }
  };

  const handleScrape = async (useMock: boolean = false) => {
    try {
      setScraping(true);
      await shoppingApi.scrapeOffers({ use_mock: useMock });
      await loadOffers();
      await loadStats();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to scrape offers');
    } finally {
      setScraping(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Stats */}
      {stats && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            🛒 Weekly Store Offers
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={4}>
              <Typography variant="h4" fontWeight="bold">{stats.total_offers}</Typography>
              <Typography variant="body2">Total Offers</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h4" fontWeight="bold">{stats.spar_offers}</Typography>
              <Typography variant="body2">Spar</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h4" fontWeight="bold">{stats.billa_offers}</Typography>
              <Typography variant="body2">Billa</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Tabs value={selectedStore} onChange={(_, v) => setSelectedStore(v)}>
          <Tab label="All Stores" value="all" />
          <Tab label="Spar" value="spar" />
          <Tab label="Billa" value="billa" />
        </Tabs>
        
        <Box display="flex" gap={1}>
          <Tooltip title="Load sample offers">
            <Button
              variant="outlined"
              onClick={() => handleScrape(true)}
              disabled={scraping}
              startIcon={scraping ? <CircularProgress size={16} /> : <OfferIcon />}
            >
              Load Sample
            </Button>
          </Tooltip>
          <Tooltip title="Scrape real offers (may not work without proper setup)">
            <Button
              variant="contained"
              onClick={() => handleScrape(false)}
              disabled={scraping}
              startIcon={scraping ? <CircularProgress size={16} /> : <RefreshIcon />}
            >
              Scrape Offers
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Offers Grid */}
      {offers.length === 0 ? (
        <Paper elevation={2} sx={{ p: 8, textAlign: 'center' }}>
          <OfferIcon sx={{ fontSize: 80, color: 'primary.main', opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No offers available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Click "Load Sample" to load sample offers, or "Scrape Offers" to fetch real data
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleScrape(true)}
            startIcon={<OfferIcon />}
          >
            Load Sample Offers
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {offers.map((offer) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={offer.id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {offer.image_url && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={offer.image_url}
                    alt={offer.product_name}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Chip 
                      label={offer.store.toUpperCase()} 
                      size="small" 
                      color={offer.store === 'spar' ? 'success' : 'info'}
                      sx={{ fontWeight: 600 }}
                    />
                    {offer.discount_percentage > 0 && (
                      <Chip 
                        label={`-${offer.discount_percentage}%`} 
                        size="small" 
                        color="error"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>
                  
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', minHeight: 48 }}>
                    {offer.product_name}
                  </Typography>
                  
                  <Chip 
                    label={offer.category} 
                    size="small" 
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  
                  <Box display="flex" alignItems="baseline" gap={1} mt={2}>
                    <Typography variant="h5" color="error" fontWeight="bold">
                      €{offer.discounted_price.toFixed(2)}
                    </Typography>
                    {offer.original_price && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        €{offer.original_price.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Valid until {new Date(offer.valid_until).toLocaleDateString('de-AT')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

