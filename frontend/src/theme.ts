/**
 * Theme configuration with mobile-first responsive design
 */
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#FF6F00',
      light: '#ffa040',
      dark: '#c43e00',
    },
    success: {
      main: '#2E7D32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ED6C02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#D32F2F',
      light: '#ef5350',
      dark: '#c62828',
    },
    background: {
      default: '#f5f7fa',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h6: {
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1.125rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          '@media (max-width:600px)': {
            padding: '8px 16px',
            fontSize: '0.9rem',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '@media (max-width:600px)': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            paddingLeft: 16,
            paddingRight: 16,
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,      // iPhone SE, small phones
      sm: 600,    // iPhone 12/13/14, larger phones
      md: 900,    // iPad portrait
      lg: 1200,   // iPad landscape, desktop
      xl: 1536,   // Large desktop
    },
  },
});

export default theme;

