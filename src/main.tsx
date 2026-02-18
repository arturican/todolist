import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { App } from '@/app/App.tsx';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/todolist">
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
