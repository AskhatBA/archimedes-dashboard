import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { queryClient, theme } from '@/shared/lib';

type Props = { children: ReactNode };

export const AppProviders = ({ children }: Props) => (
  <MantineProvider theme={theme} defaultColorScheme="auto">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  </MantineProvider>
);
