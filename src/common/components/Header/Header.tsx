import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { getTheme } from '@/common/theme/theme.ts';
import {
  changeThemeModeAC,
  selectStatus,
  selectThemeMode,
} from '@/app/app-slice.ts';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import AppBar from '@mui/material/AppBar';
import { LinearProgress, Toolbar } from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { NavButton } from '@/common/components/NavButton/NavButton.ts';
import Switch from '@mui/material/Switch';
import MenuIcon from '@mui/icons-material/Menu';
import { containerSX } from '@/common/styles/container.styles.ts';
import {
  logoutTC,
  selectIsLoggedIn,
  selectName,
} from '@/features/auth/model/auth-slice.ts';
import { Path } from '@/common/routing';
import { NavLink } from 'react-router';
import { GITHUB_REPO_URL, PORTFOLIO_URL } from '@/common/config/links.ts';

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode);
  const status = useAppSelector(selectStatus);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const name = useAppSelector(selectName)?.match(/^[^@]+/)?.[0] ?? '';

  const theme = getTheme(themeMode);
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
    <AppBar
      position="static"
      sx={{
        mb: '30px',
        backgroundColor: 'var(--app-bar-bg)',
        color: 'var(--app-bar-fg)',
        fontFamily: 'var(--app-bar-font-family)',
        fontSize: 'var(--app-bar-font-size)',
        fontWeight: 'var(--app-bar-font-weight)',
        letterSpacing: 'var(--app-bar-letter-spacing)',
      }}
    >
      <Toolbar>
        <Container maxWidth="lg" sx={containerSX}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            {isLoggedIn && (
              <>
                <span>{name}</span>
                <NavButton onClick={signOutHandler}>Sign out</NavButton>
              </>
            )}
            <NavButton
              component={NavLink}
              to={Path.Faq}
              background={theme.palette.primary.dark}
            >
              Faq
            </NavButton>
            <NavButton
              onClick={backToPortfolioHandler}
              background={theme.palette.primary.dark}
            >
              List Projects
            </NavButton>
            <NavButton onClick={viewSourceHandler}>
              View source on GitHub
            </NavButton>
            <Switch color={'default'} onChange={changeMode} />
          </div>
        </Container>
      </Toolbar>
      {status === 'loading' && <LinearProgress />}
    </AppBar>
  );
};
