import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { CircularProgress, CssBaseline } from '@mui/material';
import { useAppSelector } from '../common/hooks/useAppSelector.ts';
import { Header } from '@/common/components/Header/Header.tsx';
import { getTheme } from '@/common/theme/theme.ts';
import { selectThemeMode } from '@/app/app-slice.ts';
import { ErrorSnackbar, Footer } from '@/common/components';
import { Routing } from '@/common/routing';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { useEffect, useState } from 'react';
import { initializeAppTC } from '@/features/auth/model/auth-slice.ts';

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const themeMode = useAppSelector(selectThemeMode);
  const theme = getTheme(themeMode);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initializeAppTC()).finally(() => {
      setIsInitialized(true);
    });
  }, []);
  if (!isInitialized) {
    return (
      <div className="circularProgressContainer">
        <CircularProgress size={150} thickness={3} />
      </div>
    );
  }
  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <main className="appMain">
          <Routing />
        </main>
        <Footer />
        <ErrorSnackbar />
      </ThemeProvider>
    </div>
  );
};
