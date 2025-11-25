import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useAppSelector } from '../common/hooks/useAppSelector.ts';
import { Header } from '@/common/components/Header/Header.tsx';
import { getTheme } from '@/common/theme/theme.ts';
import { selectThemeMode } from '@/app/app-slice.ts';
import { ErrorSnackbar } from '@/common/components';
import { Routing } from '@/common/routing';

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode);
  const theme = getTheme(themeMode);

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </ThemeProvider>
    </div>
  );
};
