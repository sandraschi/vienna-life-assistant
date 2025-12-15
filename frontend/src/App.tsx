import { Container, Typography, Box, Paper, Tab, Tabs, AppBar, Toolbar } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PsychologyIcon from '@mui/icons-material/Psychology'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import HomeIcon from '@mui/icons-material/Home'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useState } from 'react'
import TodoList from './features/todos/TodoList'
import ShoppingOffers from './features/shopping/ShoppingOffers'
import LLMManager from './features/llm/LLMManager'
import MediaDashboard from './features/media/MediaDashboard'
import CalendarView from './features/calendar/CalendarView'
import ExpenseTracker from './features/expenses/ExpenseTracker'
import { ChatBot } from './features/chat/ChatBot'
import Vienna from './features/vienna/Vienna'

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
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState(1); // Start on Todos tab

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Hero Header - Mobile Optimized */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 0,
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 3 }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <CalendarTodayIcon sx={{ 
              fontSize: { xs: 50, sm: 60, md: 80 }, 
              mb: { xs: 1, sm: 2 }, 
              opacity: 0.9 
            }} />
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Vienna Life Assistant
            </Typography>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom
              sx={{ 
                opacity: 0.95,
                fontWeight: 400,
                mb: 2
              }}
            >
              Your personal life management companion
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.9,
                fontSize: '1.1rem'
              }}
            >
              📅 Calendar • ✅ Todos • 🛒 Shopping • 💰 Expenses • 🤖 AI Chat
            </Typography>
          </Box>
        </Container>
      </Paper>

      {/* Main Content - Mobile Optimized */}
      <Container maxWidth="lg" sx={{ mt: { xs: -2, sm: -3, md: -4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
        <Paper 
          elevation={8}
          sx={{ 
            borderRadius: { xs: 2, sm: 3 },
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          {/* Tabs - Mobile Optimized */}
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              bgcolor: 'background.paper',
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
            <Tab 
              icon={<CalendarTodayIcon />} 
              iconPosition="start"
              label="Calendar" 
              sx={{ textTransform: 'none' }}
            />
            <Tab 
              icon={<CheckCircleIcon />} 
              iconPosition="start"
              label="Todos" 
              sx={{ textTransform: 'none' }}
            />
            <Tab 
              icon={<ShoppingCartIcon />} 
              iconPosition="start"
              label="Shopping" 
              sx={{ textTransform: 'none' }}
            />
            <Tab 
              icon={<AttachMoneyIcon />} 
              iconPosition="start"
              label="Expenses" 
              sx={{ textTransform: 'none' }}
            />
            <Tab 
              icon={<PsychologyIcon />} 
              iconPosition="start"
              label="LLM" 
              sx={{ textTransform: 'none' }}
            />
            <Tab 
              icon={<SmartToyIcon />} 
              iconPosition="start"
              label="AI Chat" 
              sx={{ textTransform: 'none' }}
            />
            <Tab
              icon={<HomeIcon />}
              iconPosition="start"
              label="Media & Home"
              sx={{ textTransform: 'none' }}
            />
            <Tab
              icon={<LocationOnIcon />}
              iconPosition="start"
              label="Vienna"
              sx={{ textTransform: 'none' }}
            />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '60vh' }}>
            <TabPanel value={activeTab} index={0}>
              <CalendarView />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <TodoList />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <ShoppingOffers />
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              <ExpenseTracker />
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
              <LLMManager />
            </TabPanel>

            <TabPanel value={activeTab} index={5}>
              <ChatBot />
            </TabPanel>

            <TabPanel value={activeTab} index={6}>
              <MediaDashboard />
            </TabPanel>

            <TabPanel value={activeTab} index={7}>
              <Vienna />
            </TabPanel>
          </Box>
        </Paper>

        {/* Footer Status */}
        <Paper 
          elevation={0}
          sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: 'transparent',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.875rem',
              opacity: 0.7
            }}
          >
            🚀 Phase 3 (Beta) | ✅ Todos • 🛒 Shopping • 🤖 AI Chat • 🧠 LLM • 🏠 Media Hub • 🇦🇹 Vienna |
            Status: <strong>Beta AI Assistant</strong>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default App
