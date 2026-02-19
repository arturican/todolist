import styles from './Footer.module.css';
import { GITHUB_REPO_URL } from '@/common/config/links.ts';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <a
            className={styles.link}
            href="mailto:arturican@gmail.com"
            aria-label="Email arturican@gmail.com"
          >
            Email: arturican@gmail.com
          </a>
        </li>
        <li className={styles.item}>
          <a
            className={styles.link}
            href="https://t.me/m_arturican"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram @m_arturican"
          >
            Telegram: @m_arturican
          </a>
        </li>
        <li className={styles.item}>
          <a
            className={styles.link}
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open repository on GitHub"
          >
            Repo: GitHub
          </a>
        </li>
      </ul>
    </footer>
  );
};
