import { AppProviders } from './providers/app-providers';
import { AppRouter } from './router/router';

export const App = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);
