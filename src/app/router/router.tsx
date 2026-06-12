import { Navigate, Route, Routes } from 'react-router-dom';
import { OverviewScreen } from '@/screens/overview';
import { PaymentScreen } from '@/screens/payment';
import { SignInScreen } from '@/screens/sign-in';
import { useAuthStore } from '@/shared/lib';

const Protected = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/sign-in" replace />;
};

export const AppRouter = () => (
  <Routes>
    <Route path="/sign-in" element={<SignInScreen />} />
    <Route path="/payment" element={<PaymentScreen />} />
    <Route
      path="/"
      element={
        <Protected>
          <OverviewScreen />
        </Protected>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
