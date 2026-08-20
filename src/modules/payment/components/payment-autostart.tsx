import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { Button, Card, Center, Loader, Stack, Text, Title } from '@mantine/core';
import { NATIVE_ACTIONS, postToNative } from '@/shared/lib';
import { useInitPayment } from '../hooks/use-init-payment';
import { LAST_PAYMENT_ID_KEY } from '../constants';

const errorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  return error instanceof Error ? error.message : 'Не удалось инициировать платёж';
};

type Props = {
  amount: number;
  description?: string;
};

/**
 * Headless payment start for the mobile app: the amount already came from the native
 * side, so there is nothing to ask the user — create the payment and hand them straight
 * to FreedomPay.
 */
export const PaymentAutostart = ({ amount, description }: Props) => {
  const { mutateAsync } = useInitPayment();
  const [error, setError] = useState<unknown>(null);

  // Creating a payment is not idempotent — each call books a new order with FreedomPay,
  // so the first run is latched and never repeated for this mount.
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // `mutateAsync` rather than `mutate` with callbacks: StrictMode unsubscribes the
    // mutation observer between its two effect passes, and React Query drops the
    // callbacks passed to `mutate` when that happens — the payment would be created and
    // the payer never redirected. This promise settles regardless of the observer.
    mutateAsync({ amount, ...(description ? { description } : {}) })
      .then((data) => {
        // FreedomPay does pass pg_order_id back on the return redirect, but keeping the
        // id here means the result screen still works if those parameters go missing.
        sessionStorage.setItem(LAST_PAYMENT_ID_KEY, data.paymentId);
        window.location.href = data.paymentUrl;
      })
      .catch((reason: unknown) => {
        setError(reason);
        postToNative(NATIVE_ACTIONS.toast, {
          message: errorMessage(reason),
          type: 'error',
        });
      });
  }, [mutateAsync, amount, description]);

  if (error) {
    return (
      <Center mih="100svh" p="md">
        <Card withBorder shadow="md" radius="lg" padding="xl" w="100%" maw={420}>
          <Stack gap="lg" align="center">
            <Title order={4}>Не удалось начать оплату</Title>
            <Text c="dimmed" size="sm" ta="center">
              {errorMessage(error)}
            </Text>
            <Button
              variant="light"
              color="violet"
              radius="md"
              fullWidth
              onClick={() => postToNative(NATIVE_ACTIONS.close)}
            >
              Закрыть
            </Button>
          </Stack>
        </Card>
      </Center>
    );
  }

  return (
    <Center mih="100svh" p="md">
      <Stack gap="md" align="center">
        <Loader color="violet" />
        <Text c="dimmed" size="sm">
          Переходим к оплате…
        </Text>
      </Stack>
    </Center>
  );
};
