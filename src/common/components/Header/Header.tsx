import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import {
  changeThemeModeAC,
  selectStatus,
  selectThemeMode,
} from '@/app/app-slice.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import AppBar from '@mui/material/AppBar';
import { LinearProgress, Toolbar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { NavButton } from '@/common/components/NavButton/NavButton.ts';
import Switch from '@mui/material/Switch';
import MenuIcon from '@mui/icons-material/Menu';
import {
  logoutTC,
  selectIsLoggedIn,
  selectName,
} from '@/features/auth/model/auth-slice.ts';
import { Path } from '@/common/routing';
import { NavLink } from 'react-router';
import { GITHUB_REPO_URL, PORTFOLIO_URL } from '@/common/config/links.ts';
import styles from './Header.module.css';

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode);
  const status = useAppSelector(selectStatus);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const name = useAppSelector(selectName)?.match(/^[^@]+/)?.[0] ?? '';

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

  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar>
        <div className={`pageContainer ${styles.toolbar}`}>
          <div className={styles.brand}>
            <IconButton color="inherit" className={styles.menuButton}>
              <MenuIcon />
            </IconButton>
            <span>TodoList</span>
          </div>

          <div className={styles.actions}>
            {isLoggedIn && (
              <>
                <span className={styles.user}>{name}</span>
                <NavButton onClick={signOutHandler}>Sign out</NavButton>
              </>
            )}
            <NavButton component={NavLink} to={Path.Faq}>
              FAQ
            </NavButton>
            <NavButton onClick={backToPortfolioHandler}>
              List Projects
            </NavButton>
            <NavButton onClick={viewSourceHandler}>View Source</NavButton>
            <Switch
              className={styles.themeSwitch}
              color="default"
              checked={themeMode === 'dark'}
              onChange={changeMode}
              inputProps={{ 'aria-label': 'Toggle dark mode' }}
            />
          </div>
        </div>
      </Toolbar>
      {status === 'loading' && <LinearProgress />}
    </AppBar>
  );
};
