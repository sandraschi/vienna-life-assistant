import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Grid,
  IconButton,
  Alert,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import { calendarAPI } from '../../services/api';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  category: string;
  location?: string;
  color?: string;
}

const CategoryColors: Record<string, string> = {
  personal: '#1976D2',
  benny: '#4CAF50',
  shopping: '#FF9800',
  'self-care': '#9C27B0',
  appointment: '#F44336',
  other: '#757575',
};

export default function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await calendarAPI.getEvents();
      setEvents(response.events || []);
    } catch (err) {
      setError('Failed to load calendar events');
      console.error('Calendar load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('de-AT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-AT', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter((event) => new Date(event.start_time) >= now)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 10);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Loading calendar...
        </Typography>
      </Box>
    );
  }

  const upcomingEvents = getUpcomingEvents();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarTodayIcon />
          Your Calendar
        </Typography>
        <Button
          variant="outlined"
          startIcon={<TodayIcon />}
          onClick={goToToday}
        >
          Today
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Month Navigation */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={() => changeMonth(-1)}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h5">
            {currentDate.toLocaleDateString('de-AT', {
              month: 'long',
              year: 'numeric',
            })}
          </Typography>
          <IconButton onClick={() => changeMonth(1)}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Upcoming Events */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Upcoming Events ({upcomingEvents.length})
      </Typography>

      {upcomingEvents.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CalendarTodayIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No upcoming events
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your calendar is clear!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {upcomingEvents.map((event) => (
            <Grid item xs={12} md={6} key={event.id}>
              <Card
                sx={{
                  borderLeft: 4,
                  borderColor: event.color || CategoryColors[event.category] || '#757575',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s',
                  },
                }}
              >
                <CardContent>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Typography variant="h6" component="div">
                        {event.title}
                      </Typography>
                      <Chip
                        label={event.category}
                        size="small"
                        sx={{
                          bgcolor: event.color || CategoryColors[event.category] || '#757575',
                          color: 'white',
                        }}
                      />
                    </Box>

                    {event.description && (
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<CalendarTodayIcon />}
                        label={formatDate(event.start_time)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${formatTime(event.start_time)} - ${formatTime(event.end_time)}`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    {event.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Stats */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Calendar Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="h4" color="primary">
              {events.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Events
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h4" color="success.main">
              {upcomingEvents.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upcoming
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h4" color="warning.main">
              {events.filter((e) => e.category === 'benny').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Benny Events
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h4" color="error.main">
              {events.filter((e) => e.category === 'appointment').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Appointments
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

