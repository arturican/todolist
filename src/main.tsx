import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { App } from '@/app/App.tsx';
import { BrowserRouter } from 'react-router';

const normalizedBase = import.meta.env.BASE_URL.replace(/\/+$/, '');
const routerBasename = normalizedBase === '' ? undefined : normalizedBase;

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={routerBasename}>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
