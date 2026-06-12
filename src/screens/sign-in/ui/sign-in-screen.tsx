import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Anchor,
  Box,
  Button,
  Card,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconActivityHeartbeat } from '@tabler/icons-react';
import { useAuthStore } from '@/shared/lib';

const schema = yup.object({
  email: yup.string().email('Некорректный email').required('Обязательное поле'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Обязательное поле'),
});

export const SignInScreen = () => {
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      console.log('sign in', values);
      setToken('demo-token');
      navigate('/');
    },
  });

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
              С возвращением. Пожалуйста, введите ваши данные.
            </Text>
          </Stack>
          <form onSubmit={formik.handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Email"
                name="email"
                placeholder="you@archimedes.kz"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
              />
              <PasswordInput
                label="Пароль"
                name="password"
                placeholder="Ваш пароль"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
              />
              <Group justify="space-between">
                <Anchor size="sm" c="violet">
                  Забыли пароль?
                </Anchor>
              </Group>
              <Button
                type="submit"
                loading={formik.isSubmitting}
                fullWidth
                color="violet"
                radius="md"
                size="md"
              >
                Войти
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Box>
  );
};
