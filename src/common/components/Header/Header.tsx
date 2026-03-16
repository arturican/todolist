import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import {
  changeThemeModeAC,
  selectIsAppLoading,
  selectThemeMode,
} from '@/app/app-slice.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import AppBar from '@mui/material/AppBar';
import { Collapse, IconButton, LinearProgress, Toolbar } from '@mui/material';
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

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode);
  const isAppLoading = useAppSelector(selectIsAppLoading);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const name = useAppSelector(selectName)?.match(/^[^@]+/)?.[0] ?? '';
  const themeLabel = themeMode === 'dark' ? 'Theme: Dark' : 'Theme: Light';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const changeMode = () => {
    dispatch(
      changeThemeModeAC({
        themeMode: themeMode === 'light' ? 'dark' : 'light',
      }),
    );
  };

  const signOutHandler = () => {
    setIsMenuOpen(false);
    dispatch(logoutTC());
  };

  const backToPortfolioHandler = () => {
    setIsMenuOpen(false);
    window.location.assign(PORTFOLIO_URL);
  };

  const viewSourceHandler = () => {
    setIsMenuOpen(false);
    window.open(GITHUB_REPO_URL, '_blank', 'noopener,noreferrer');
  };

  const toggleMenu = () => {
    setIsMenuOpen(current => !current);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
            <IconButton
              className={`${styles.brandIconButton} ${isMenuOpen ? styles.brandIconButtonActive : ''}`}
              onClick={toggleMenu}
              aria-label={
                isMenuOpen
                  ? 'Close quick actions menu'
                  : 'Open quick actions menu'
              }
              aria-controls="header-quick-actions"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <span>TodoList</span>
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
          </div>
        </div>
      </Toolbar>
      <Collapse in={isMenuOpen} timeout={220} unmountOnExit>
        <div
          id="header-quick-actions"
          className={`pageContainer ${styles.menuPanel}`}
        >
          <div className={styles.menuHeader}>
            <span className={styles.menuEyebrow}>Quick actions</span>
            <span className={styles.menuText}>
              Hidden header actions are collected here.
            </span>
          </div>
          <div className={styles.actionsGrid}>
            <NavButton
              className={styles.actionButton}
              component={Link}
              to={Path.Faq}
              onClick={closeMenu}
            >
              FAQ
            </NavButton>
            <NavButton
              className={styles.actionButton}
              onClick={backToPortfolioHandler}
            >
              Back to Portfolio
            </NavButton>
            <NavButton
              className={styles.actionButton}
              onClick={viewSourceHandler}
            >
              Open Project on GitHub
            </NavButton>
          </div>
        </div>
      </Collapse>
      {isAppLoading && <LinearProgress />}
    </AppBar>
  );
};
