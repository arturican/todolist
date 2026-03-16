import Button from '@mui/material/Button';
import { Link } from 'react-router';
import { Path } from '@/common/routing';
import { GITHUB_REPO_URL } from '@/common/config/links.ts';
import styles from './FaqPage.module.css';

const faqItems = [
  {
    question: 'How do I sign in to the demo app?',
    answer:
      'Use the built-in demo account: username admin and password admin. After sign-in, the app restores your lists and tasks from the backend API.',
  },
  {
    question: 'Why do some buttons become disabled while I edit tasks?',
    answer:
      'The interface now blocks only the item that is currently being updated. This protects you from duplicate delete and update requests, while the rest of the page stays interactive.',
  },
  {
    question: 'What happens if my session expires?',
    answer:
      'The client clears the expired token, resets local state, and sends you back to the login flow instead of continuing to make unauthorized requests in the background.',
  },
  {
    question: 'How are filters and task states supposed to work?',
    answer:
      'Each todolist can show all, active, or completed tasks. Completed tasks stay in the list until you delete them, and filters only change what is visible, not the stored data.',
  },
];

export const FaqPage = () => {
  return (
    <section className={`pageContainer ${styles.page}`}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Help Center</span>
        <h1 className={styles.title}>
          Everything important about this TodoList app
        </h1>
        <p className={styles.lead}>
          A quick guide for logging in, working with tasks, understanding
          loading states, and avoiding the most common surprises while testing
          the frontend.
        </p>

        <div className={styles.heroGrid}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardTitle}>Demo credentials</div>
            <div className={styles.heroCardValue}>admin / admin</div>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardTitle}>Data flow</div>
            <div className={styles.heroCardValue}>
              React + Redux + Express API
            </div>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.faqList}>
          {faqItems.map(item => (
            <details key={item.question} className={styles.faqItem}>
              <summary className={styles.summary}>{item.question}</summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </div>

        <aside className={styles.sidePanel}>
          <div className={styles.panelCard}>
            <h2 className={styles.panelTitle}>Quick checks</h2>
            <ul className={styles.list}>
              <li>Create a new todolist and add several tasks.</li>
              <li>
                Rename a task and try double-clicking actions during loading.
              </li>
              <li>Switch filters to verify active and completed states.</li>
              <li>Log out and back in to confirm the session flow.</li>
            </ul>
          </div>

          <div className={styles.panelCard}>
            <h2 className={styles.panelTitle}>Where to go next</h2>
            <p className={styles.answer}>
              Return to the main page to test the app, or open the repository if
              you want to inspect the implementation details behind the current
              UI.
            </p>
            <div className={styles.actions}>
              <Button component={Link} to={Path.Main} variant="contained">
                Open Todos
              </Button>
              <Button
                component="a"
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                variant="outlined"
              >
                View Source
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
