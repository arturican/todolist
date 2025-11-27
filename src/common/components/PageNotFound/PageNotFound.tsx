import { Link } from 'react-router';
import styles from './PageNotFound.module.css';
import Button from '@mui/material/Button';
export const PageNotFound = () => (
  <>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <Button
      component={Link}
      to="/"
      variant={'contained'}
      color={'primary'}
      sx={{
        maxWidth: 400,
        margin: 'auto',
      }}
    >
      Вернуться на главную
    </Button>
  </>
);
