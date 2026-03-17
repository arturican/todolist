import { Link } from 'react-router';
import styles from './PageNotFound.module.css';
import Button from '@mui/material/Button';

export const PageNotFound = () => (
  <div className={`pageContainer ${styles.wrapper}`}>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>Page not found</h2>
    <Button
      className={styles.button}
      component={Link}
      to="/"
      variant="contained"
      color="primary"
    >
      Back to Home
    </Button>
  </div>
);
