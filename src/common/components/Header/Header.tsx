import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import {
  changeThemeModeAC,
  selectIsAppLoading,
  selectThemeMode,
} from '@/app/app-slice.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import AppBar from '@mui/material/AppBar';
import {
  Collapse,
  IconButton,
  LinearProgress,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import { NavButton } from '@/common/components/NavButton/NavButton.ts';
import Switch from '@mui/material/Switch';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  logoutTC,
  selectIsLoggedIn,
  selectName,
} from '@/features/auth/model/auth-slice.ts';
import { GITHUB_REPO_URL, PORTFOLIO_URL } from '@/common/config/links.ts';
import { Path } from '@/common/routing';
import styles from './Header.module.css';

type NavigationItem =
  | {
      key: string;
      label: string;
      to: string;
      onClick?: undefined;
    }
  | {
      key: string;
      label: string;
      to?: undefined;
      onClick: () => void;
    };

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode);
  const isAppLoading = useAppSelector(selectIsAppLoading);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width:768px)');
  const name = useAppSelector(selectName)?.match(/^[^@]+/)?.[0] ?? '';
  const themeLabel = themeMode === 'dark' ? 'Theme: Dark' : 'Theme: Light';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeMode = () => {
    dispatch(
      changeThemeModeAC({
        themeMode: themeMode === 'light' ? 'dark' : 'light',
      }),
    );
  };

  const signOutHandler = () => {
    dispatch(logoutTC());
  };

  const backToPortfolioHandler = () => {
    window.location.assign(PORTFOLIO_URL);
  };

  const viewSourceHandler = () => {
    window.open(GITHUB_REPO_URL, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [isDesktop, location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(current => !current);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigationItems: NavigationItem[] = [
    {
      key: 'faq',
      label: 'FAQ',
      to: Path.Faq,
    },
    {
      key: 'portfolio',
      label: 'Back to Portfolio',
      onClick: backToPortfolioHandler,
    },
    {
      key: 'github',
      label: 'Open Project on GitHub',
      onClick: viewSourceHandler,
    },
  ];

  const renderNavigationButtons = (afterClick?: () => void) =>
    navigationItems.map(item => {
      const handleClick = () => {
        item.onClick?.();
        afterClick?.();
      };

      if (item.to) {
        return (
          <NavButton
            key={item.key}
            className={styles.actionButton}
            component={Link}
            to={item.to}
            onClick={afterClick}
          >
            {item.label}
          </NavButton>
        );
      }

      return (
        <NavButton
          key={item.key}
          className={styles.actionButton}
          onClick={handleClick}
        >
          {item.label}
        </NavButton>
      );
    });

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      className={styles.appBar}
      sx={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text)',
        borderBottom: '1px solid var(--border)',
        borderRadius: 0,
      }}
    >
      <Toolbar disableGutters>
        <div className={`pageContainer ${styles.toolbar}`}>
          <div className={styles.brand}>
            <span>TodoList</span>
            <IconButton
              className={styles.burgerButton}
              onClick={toggleMenu}
              aria-label={
                isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-header-menu"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </div>

          <div className={styles.actions}>
            <div className={styles.metaRow}>
              {isLoggedIn && (
                <div className={styles.userGroup}>
                  <span className={styles.user}>{name}</span>
                  <NavButton
                    className={styles.signOutInline}
                    onClick={signOutHandler}
                  >
                    Sign out
                  </NavButton>
                </div>
              )}
              <div className={styles.themeControl}>
                <span className={styles.themeLabel}>{themeLabel}</span>
                <Switch
                  className={styles.themeSwitch}
                  color="default"
                  checked={themeMode === 'dark'}
                  onChange={changeMode}
                  inputProps={{
                    'aria-label': 'Switch between light and dark theme',
                  }}
                />
              </div>
            </div>
            <div className={styles.actionsGrid}>
              {renderNavigationButtons()}
            </div>
          </div>
        </div>
      </Toolbar>
      <Collapse in={isMenuOpen} timeout={220}>
        <div
          id="mobile-header-menu"
          className={`pageContainer ${styles.mobileMenu}`}
        >
          <div className={styles.mobileMenuGrid}>
            {renderNavigationButtons(closeMenu)}
          </div>
        </div>
      </Collapse>
      {isAppLoading && <LinearProgress />}
    </AppBar>
  );
};
