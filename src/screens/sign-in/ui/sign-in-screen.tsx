import { Navigate } from 'react-router-dom';
import { Box, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconActivityHeartbeat } from '@tabler/icons-react';
import { SignInForm, useAdminSession } from '@/modules/auth';

export const SignInScreen = () => {
  const { isAuthenticated } = useAdminSession();

  // Someone who is already signed in has no business on the login page.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background:
          'radial-gradient(circle at 20% 20%, var(--mantine-color-violet-1), transparent 40%), radial-gradient(circle at 80% 80%, var(--mantine-color-cyan-1), transparent 40%)',
      }}
    >
      <Card withBorder shadow="md" radius="lg" padding="xl" w={400}>
        <Stack gap="lg">
          <Group gap={10}>
            <Box
              style={{
                background:
                  'linear-gradient(135deg, var(--mantine-color-violet-6), var(--mantine-color-cyan-5))',
                width: 40,
                height: 40,
                borderRadius: 12,
                display: 'grid',
                placeItems: 'center',
                color: 'white',
              }}
            >
              <IconActivityHeartbeat size={22} />
            </Box>
            <Stack gap={0}>
              <Title order={4}>Archimedes</Title>
              <Text size="xs" c="dimmed">
                Дашборд аналитики здоровья
              </Text>
            </Stack>
          </Group>
          <Stack gap={4}>
            <Title order={3}>Вход</Title>
            <Text size="sm" c="dimmed">
              Панель администратора. Доступ только по служебной учётной записи.
            </Text>
          </Stack>
          <SignInForm />
        </Stack>
      </Card>
    </Box>
  );
};
