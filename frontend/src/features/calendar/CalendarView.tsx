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
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
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

type ViewMode = 'list' | 'grid';
type TimeView = 'day' | 'week' | 'month';

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
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [timeView, setTimeView] = useState<TimeView>('month');

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

  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (timeView === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (timeView === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const getViewTitle = () => {
    if (timeView === 'day') {
      return currentDate.toLocaleDateString('de-AT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } else if (timeView === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString('de-AT', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('de-AT', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('de-AT', {
        month: 'long',
        year: 'numeric',
      });
    }
  };

  const getFilteredEvents = () => {
    const now = new Date();
    
    if (timeView === 'day') {
      return events.filter((event) => {
        const eventDate = new Date(event.start_time);
        return (
          eventDate.getDate() === currentDate.getDate() &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    } else if (timeView === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      return events.filter((event) => {
        const eventDate = new Date(event.start_time);
        return eventDate >= weekStart && eventDate < weekEnd;
      }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    } else {
      // Month view - show upcoming events
      return events
        .filter((event) => new Date(event.start_time) >= now)
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        .slice(0, 10);
    }
  };

  const renderGridView = (filteredEvents: CalendarEvent[]) => {
    if (filteredEvents.length === 0) {
      return (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CalendarTodayIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events for this {timeView}
          </Typography>
        </Paper>
      );
    }

    return (
      <Grid container spacing={2}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card
              sx={{
                borderLeft: 4,
                borderColor: event.color || CategoryColors[event.category] || '#757575',
                height: '100%',
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
                        textTransform: 'capitalize',
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
    );
  };

  const renderListView = (filteredEvents: CalendarEvent[]) => {
    if (filteredEvents.length === 0) {
      return (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CalendarTodayIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events for this {timeView}
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper>
        <Stack divider={<Divider />}>
          {filteredEvents.map((event) => (
            <Box
              key={event.id}
              sx={{
                p: 2,
                display: 'flex',
                gap: 2,
                borderLeft: 4,
                borderColor: event.color || CategoryColors[event.category] || '#757575',
                '&:hover': {
                  bgcolor: 'grey.50',
                },
              }}
            >
              <Box sx={{ minWidth: 80 }}>
                <Typography variant="body2" color="text.secondary">
                  {formatTime(event.start_time)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(event.start_time)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 0.5 }}>
                  <Typography variant="h6">{event.title}</Typography>
                  <Chip
                    label={event.category}
                    size="small"
                    sx={{
                      bgcolor: event.color || CategoryColors[event.category] || '#757575',
                      color: 'white',
                      textTransform: 'capitalize',
                    }}
                  />
                </Box>
                {event.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {event.description}
                  </Typography>
                )}
                {event.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {event.location}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>
    );
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

  const filteredEvents = getFilteredEvents();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
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

      {/* View Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          {/* Time View Selector */}
          <ToggleButtonGroup
            value={timeView}
            exclusive
            onChange={(_, newView) => newView && setTimeView(newView)}
            size="small"
          >
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>

          {/* Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
              {getViewTitle()}
            </Typography>
            <IconButton onClick={() => navigate(1)}>
              <ChevronRightIcon />
            </IconButton>
          </Box>

          {/* Display Mode Selector */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="grid">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Events Display */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {timeView === 'month' ? 'Upcoming Events' : `Events (${filteredEvents.length})`}
      </Typography>

      {viewMode === 'grid' ? renderGridView(filteredEvents) : renderListView(filteredEvents)}

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
              {events.filter((e) => new Date(e.start_time) >= new Date()).length}
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
