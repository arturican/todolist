import { createTheme } from '@mui/material/styles';
import type { ThemeMode } from '@/app/app-slice.ts';

export const getTheme = (themeMode: ThemeMode) => {
  const isDark = themeMode === 'dark';

  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    },
    shape: {
      borderRadius: 12,
    },
    palette: {
      mode: themeMode,
      primary: {
        main: '#2AABEE',
        dark: '#229ED9',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? '#0B111A' : '#C4C7C8',
        paper: isDark ? '#17212B' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#E6EDF3' : '#0F172A',
        secondary: isDark ? '#93A4B5' : '#6B7280',
      },
      divider: isDark ? '#243447' : '#E6EAF0',
    },
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Arial, sans-serif',
      fontSize: 16,
      body1: {
        fontSize: 'clamp(0.95rem, 0.9rem + 0.22vw, 1.05rem)',
        lineHeight: 1.5,
      },
      h3: {
        fontSize: 'clamp(1.15rem, 1.05rem + 0.4vw, 1.45rem)',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        lineHeight: 1.2,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#0B111A' : '#C4C7C8',
            color: isDark ? '#E6EDF3' : '#0F172A',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            minHeight: 'var(--tapMinSize)',
            paddingInline: 'clamp(0.75rem, 0.7rem + 0.3vw, 1rem)',
            whiteSpace: 'normal',
            overflowWrap: 'anywhere',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
          fullWidth: true,
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isDark ? '#1C2732' : '#F8FAFC',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2AABEE',
              borderWidth: 1,
              boxShadow: '0 0 0 3px rgba(42, 171, 238, 0.3)',
            },
          },
          notchedOutline: {
            borderColor: isDark ? '#243447' : '#E6EAF0',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            color: isDark ? '#E6EDF3' : '#0F172A',
            minHeight: 'var(--tapMinSize)',
            minWidth: 'var(--tapMinSize)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            border: `1px solid ${isDark ? '#243447' : '#E6EAF0'}`,
            boxShadow: isDark
              ? '0 1px 2px rgba(0,0,0,.22), 0 8px 20px rgba(0,0,0,.24)'
              : '0 1px 2px rgba(0,0,0,.06), 0 10px 30px rgba(0,0,0,.08)',
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: isDark ? '#93A4B5' : '#6B7280',
            '&.Mui-checked': {
              color: '#2AABEE',
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#243447' : '#D9ECF7',
          },
          bar: {
            backgroundColor: '#2AABEE',
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            '&.Mui-checked': {
              color: '#2AABEE',
            },
            '&.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#2AABEE',
            },
          },
        },
      },
    },
  });
};
