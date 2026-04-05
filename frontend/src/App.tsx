import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  alpha,
  Container,
  IconButton,
  Drawer
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useState } from 'react'
import theme from './theme'
import { Sidebar } from './components/Layout/Sidebar'

// Feature Imports
import TodoList from './features/todos/TodoList'
import ShoppingOffers from './features/shopping/ShoppingOffers'
import LLMManager from './features/llm/LLMManager'
import MediaDashboard from './features/media/MediaDashboard'
import MediaLibrary from './features/media/MediaLibrary'
import CalendarView from './features/calendar/CalendarView'
import ExpenseTracker from './features/expenses/ExpenseTracker'
import { ChatBot } from './features/chat/ChatBot'
import Vienna from './features/vienna/Vienna'
import KnowledgeBase from './features/knowledge/KnowledgeBase'
import DataAnalytics from './features/analytics/DataAnalytics'
import CreativeStudio from './features/creative/CreativeStudio'
import HomeSecurity from './features/security/HomeSecurity'
import VirtualWorlds from './features/virtual/VirtualWorlds'
import RoboticsAutomation from './features/robotics/RoboticsAutomation'
import AudioProduction from './features/audio/AudioProduction'
import Technical from './features/technical/Technical'
import { JournalDashboard } from './features/journal/JournalDashboard'

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setMobileOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0: return <CalendarView />;
      case 1: return <TodoList />;
      case 2: return <ShoppingOffers />;
      case 3: return <ExpenseTracker />;
      case 4: return <MediaDashboard />;
      case 5: return <MediaLibrary />;
      case 6: return <JournalDashboard />;
      case 7: return <LLMManager />;
      case 8: return <ChatBot />;
      case 9: return <Vienna />;
      case 10: return <KnowledgeBase />;
      case 11: return <DataAnalytics />;
      case 12: return <CreativeStudio />;
      case 13: return <HomeSecurity />;
      case 14: return <VirtualWorlds />;
      case 15: return <RoboticsAutomation />;
      case 16: return <AudioProduction />;
      case 17: return <Technical />;
      default: return <CalendarView />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        </Drawer>

        <Box component="main" sx={{
          flexGrow: 1,
          ml: { md: '280px' },
          width: { md: `calc(100% - 280px)` },
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Status Bar */}
          <Box sx={{
            p: { xs: 2, md: 3 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            bgcolor: alpha('#020617', 0.8)
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  {activeTab === 0 ? 'Overview' : 'Control Center'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Vienna Life Assistant — SOTA Edition
                </Typography>
              </Box>
            </Box>

            <Box sx={{
              px: 2,
              py: 0.5,
              borderRadius: '20px',
              bgcolor: alpha('#10b981', 0.1),
              border: '1px solid',
              borderColor: alpha('#10b981', 0.2),
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{ w: 8, h: 8, bgcolor: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, letterSpacing: 1 }}>
                VIENNA-LIVE-MCP ONLINE
              </Typography>
            </Box>
          </Box>

          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{
              animation: 'fadeIn 0.5s ease-out',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}>
              {renderContent()}
            </Box>
          </Container>

          {/* Footer Branding */}
          <Box sx={{ p: 4, mt: 'auto', textAlign: 'center', opacity: 0.5 }}>
            <Typography variant="caption" sx={{ letterSpacing: 2, fontWeight: 500 }}>
              © 2026 VIENNA LIFE INFRASTRUCTURE ENGINE
            </Typography>
          </Box>
        </Box>
      </Box>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </ThemeProvider>
  )
}

export default App
