import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import { App } from './app';
import './index.css';

dayjs.locale('ru');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
