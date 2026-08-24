import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAdminLogin } from '../hooks';
import { resolveAuthErrorMessage } from '../data';
import type { AdminLoginValues } from '../types';

const schema = yup.object({
  email: yup.string().email('Некорректный email').required('Обязательное поле'),
  password: yup.string().required('Обязательное поле'),
});

const initialValues: AdminLoginValues = { email: '', password: '' };

export const SignInForm = () => {
  const navigate = useNavigate();
  const login = useAdminLogin();

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await login.mutateAsync(values);
        navigate('/', { replace: true });
      } catch {
        // Surfaced by the alert above; swallowed so formik can reset isSubmitting.
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Stack gap="md">
        {login.isError && (
          <Alert
            color="red"
            variant="light"
            radius="md"
            icon={<IconAlertCircle size={18} />}
          >
            {resolveAuthErrorMessage(login.error)}
          </Alert>
        )}
        <TextInput
          label="Email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="you@archimedes.kz"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email}
        />
        <PasswordInput
          label="Пароль"
          name="password"
          autoComplete="current-password"
          placeholder="Ваш пароль"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && formik.errors.password}
        />
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
  );
};
