import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import AppBar from '@mui/material/AppBar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  changeThemeModeAC,
  selectIsAppLoading,
  selectThemeMode,
} from '@/app/app-slice.ts';
import { NavButton } from '@/common/components/NavButton/NavButton.ts';
import { GITHUB_REPO_URL, PORTFOLIO_URL } from '@/common/config/links.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { Path } from '@/common/routing';
import {
  logoutTC,
  selectIsLoggedIn,
  selectName,
} from '@/features/auth/model/auth-slice.ts';
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
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const themeMode = useAppSelector(selectThemeMode);
  const isAppLoading = useAppSelector(selectIsAppLoading);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const name = useAppSelector(selectName)?.match(/^[^@]+/)?.[0] ?? '';
  const isDesktopNavigation = useMediaQuery('(min-width:768px)');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const themeLabel = themeMode === 'dark' ? 'Theme: Dark' : 'Theme: Light';

  const changeMode = () => {
    dispatch(
      changeThemeModeAC({
        themeMode: themeMode === 'light' ? 'dark' : 'light',
      }),
    );
  };

  const signOutHandler = () => {
    setIsMobileMenuOpen(false);
    dispatch(logoutTC());
  };

  const backToPortfolioHandler = () => {
    window.location.assign(PORTFOLIO_URL);
  };

  const viewSourceHandler = () => {
    window.open(GITHUB_REPO_URL, '_blank', 'noopener,noreferrer');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(current => !current);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [isDesktopNavigation, pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen || isDesktopNavigation) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isDesktopNavigation, isMobileMenuOpen]);

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
      <ClickAwayListener
        onClickAway={() => {
          if (!isDesktopNavigation) {
            closeMobileMenu();
          }
        }}
      >
        <div className={styles.headerShell}>
          <Toolbar disableGutters>
            <div className={`pageContainer ${styles.toolbar}`}>
              <div className={styles.brand}>
                <span className={styles.brandMark} aria-hidden="true">
                  TL
                </span>
                <span>TodoList</span>
                <IconButton
                  className={styles.burgerButton}
                  onClick={toggleMobileMenu}
                  aria-label={
                    isMobileMenuOpen
                      ? 'Close mobile navigation menu'
                      : 'Open mobile navigation menu'
                  }
                  aria-haspopup="menu"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-header-menu"
                  data-testid="mobile-header-menu-button"
                >
                  {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
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

                <nav
                  className={styles.actionsGrid}
                  aria-label="Header navigation"
                  data-testid="desktop-header-navigation"
                >
                  {renderNavigationButtons()}
                </nav>
              </div>
            </div>
          </Toolbar>

          <Collapse
            in={!isDesktopNavigation && isMobileMenuOpen}
            timeout={220}
            unmountOnExit
          >
            <div className={`pageContainer ${styles.mobileMenuWrapper}`}>
              <nav
                id="mobile-header-menu"
                className={styles.mobileMenu}
                aria-label="Mobile navigation"
                data-testid="mobile-header-menu"
              >
                <div className={styles.mobileMenuGrid}>
                  {renderNavigationButtons(closeMobileMenu)}
                </div>
              </nav>
            </div>
          </Collapse>
        </div>
      </ClickAwayListener>

      {isAppLoading && <LinearProgress />}
    </AppBar>
  );
};
