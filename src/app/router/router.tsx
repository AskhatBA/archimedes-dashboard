import { Center, Loader, Stack, Text } from '@mantine/core';
import { Navigate, Route, Routes } from 'react-router-dom';
import { OverviewScreen } from '@/screens/overview';
import { CheckupsScreen } from '@/screens/checkups';
import { PatientsScreen } from '@/screens/patients';
import { ProgramOrdersScreen } from '@/screens/program-orders';
import { PaymentScreen } from '@/screens/payment';
import { RefundsScreen } from '@/screens/refunds';
import { PaymentResultScreen } from '@/screens/payment-result';
import { SignInScreen } from '@/screens/sign-in';
import { useAdminSession } from '@/modules/auth';

/**
 * Gates a route on a *verified* admin session. The stored token alone is not
 * enough — it is re-checked against `/auth/admin/me`, which only an ADMIN
 * account passes, so a token from the mobile app never reaches the dashboard.
 */
const Protected = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isChecking } = useAdminSession();

  if (isChecking) {
    return (
      <Center h="100svh">
        <Stack align="center" gap="sm">
          <Loader color="violet" />
          <Text size="sm" c="dimmed">
            Проверяем доступ…
          </Text>
        </Stack>
      </Center>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" replace />;
};

export const AppRouter = () => (
  <Routes>
    <Route path="/sign-in" element={<SignInScreen />} />
    <Route path="/payment" element={<PaymentScreen />} />
    {/* FreedomPay sends the payer back here with pg_order_id in the query string. */}
    <Route path="/payment/success" element={<PaymentResultScreen outcome="success" />} />
    <Route path="/payment/failure" element={<PaymentResultScreen outcome="failure" />} />
    <Route
      path="/"
      element={
        <Protected>
          <OverviewScreen />
        </Protected>
      }
    />
    <Route
      path="/patients"
      element={
        <Protected>
          <PatientsScreen />
        </Protected>
      }
    />
    <Route
      path="/checkups"
      element={
        <Protected>
          <CheckupsScreen />
        </Protected>
      }
    />
    <Route
      path="/program-orders"
      element={
        <Protected>
          <ProgramOrdersScreen />
        </Protected>
      }
    />
    <Route
      path="/refunds"
      element={
        <Protected>
          <RefundsScreen />
        </Protected>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
