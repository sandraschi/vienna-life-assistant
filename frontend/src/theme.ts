/**
 * Theme configuration with mobile-first responsive design
 */
import { createTheme, alpha } from '@mui/material/styles';

const primaryMain = '#6366f1'; // Indigo 500
const secondaryMain = '#22d3ee'; // Cyan 400
const surfaceBg = '#020617'; // Deep Slate 950

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryMain,
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: secondaryMain,
      light: '#67e8f9',
      dark: '#0891b2',
    },
    background: {
      default: surfaceBg,
      paper: alpha('#0f172a', 0.8), // Slate 900 with transparency
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    divider: alpha('#1e293b', 0.5),
  },
  typography: {
    fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
    h1: { fontWeight: 900, tracking: -1 },
    h2: { fontWeight: 800, tracking: -0.5 },
    h6: { fontWeight: 700, letterSpacing: '0.05em' },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: surfaceBg,
          backgroundImage: `radial-gradient(circle at 50% 0%, ${alpha(primaryMain, 0.15)} 0%, transparent 50%), 
                            radial-gradient(circle at 0% 100%, ${alpha(secondaryMain, 0.1)} 0%, transparent 40%)`,
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: alpha('#0f172a', 0.8),
          backdropFilter: 'blur(12px)',
          border: `1px solid ${alpha('#1e293b', 0.5)}`,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 0 20px ${alpha(primaryMain, 0.3)}`,
          },
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${primaryMain} 30%, #4f46e5 90%)`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: surfaceBg,
          borderRight: `1px solid ${alpha('#1e293b', 0.5)}`,
          backdropFilter: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: alpha(primaryMain, 0.3),
            boxShadow: `0 20px 25px -5px ${alpha('#000', 0.5)}`,
          },
        },
      },
    },
  },
});

export default theme;

