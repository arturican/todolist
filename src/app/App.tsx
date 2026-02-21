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
import { NavButton } from '@/common/components/NavButton/NavButton.ts';
import { PORTFOLIO_URL } from '@/common/config/links.ts';

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

  const backToPortfolioHandler = () => {
    window.location.assign(PORTFOLIO_URL);
  };

  if (!isInitialized) {
    return (
      <div className="circularProgressContainer">
        <CircularProgress size={88} thickness={4} />
      </div>
    );
  }

  return (
    <div className="app" data-theme={themeMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <main className="appMain">
          <Routing />
        </main>
        <div className="pageContainer appCtaRow">
          <NavButton className="appCtaButton" onClick={backToPortfolioHandler}>
            Back to Portfolio
          </NavButton>
        </div>
        <Footer />
        <ErrorSnackbar />
      </ThemeProvider>
    </div>
  );
};
