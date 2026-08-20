import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge, Button, Card, Center, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { IconCheck, IconClock, IconX } from '@tabler/icons-react';
import { NATIVE_ACTIONS, isEmbeddedInApp, postToNative } from '@/shared/lib';
import { usePaymentStatus } from '../hooks/use-payment-status';
import { LAST_PAYMENT_ID_KEY } from '../constants';
import type { PaymentStatus } from '../types';

type Props = {
  /** Which return URL FreedomPay used — a hint only; the backend is the source of truth. */
  outcome: 'success' | 'failure';
};

const PRESENTATION: Record<PaymentStatus, { color: string; label: string; icon: typeof IconCheck }> =
  {
    SUCCESS: { color: 'teal', label: 'Оплачено', icon: IconCheck },
    FAILED: { color: 'red', label: 'Платёж не прошёл', icon: IconX },
    PENDING: { color: 'yellow', label: 'Ожидает подтверждения', icon: IconClock },
  };

export const PaymentResult = ({ outcome }: Props) => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('pg_order_id') ?? sessionStorage.getItem(LAST_PAYMENT_ID_KEY);

  const { data, isLoading, isError } = usePaymentStatus(paymentId);

  // Until the backend confirms, fall back to whichever URL FreedomPay redirected to.
  const status: PaymentStatus = data?.status ?? (outcome === 'success' ? 'PENDING' : 'FAILED');
  const { color, label, icon: Icon } = PRESENTATION[status];

  const embedded = isEmbeddedInApp();

  // Hand the settled outcome to the native app, which shows its own toast and closes
  // the payment screen. Only final states are reported — PENDING is still in flight.
  useEffect(() => {
    if (!embedded || !data || data.status === 'PENDING') return;

    postToNative(NATIVE_ACTIONS.result, {
      status: data.status,
      paymentId: data.id,
      amount: data.amount,
    });
  }, [embedded, data]);

  return (
    <Center mih="100svh" p="md">
      <Card withBorder shadow="md" radius="lg" padding="xl" w="100%" maw={420}>
        <Stack gap="lg" align="center">
          <Group gap="xs">
            <Icon size={22} color={`var(--mantine-color-${color}-6)`} />
            <Title order={3}>{label}</Title>
          </Group>

          {!paymentId && (
            <Text c="dimmed" size="sm" ta="center">
              Не удалось определить платёж — идентификатор не передан.
            </Text>
          )}

          {isError && (
            <Text c="red" size="sm" ta="center">
              Не удалось получить статус платежа.
            </Text>
          )}

          {data && (
            <Stack gap={6} w="100%">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Сумма
                </Text>
                <Text size="sm">{data.amount.toLocaleString('ru-RU')} ₸</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Назначение
                </Text>
                <Text size="sm">{data.description}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Статус
                </Text>
                <Badge color={color} variant="light">
                  {data.status}
                </Badge>
              </Group>
              {data.pgPaymentId && (
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Транзакция FreedomPay
                  </Text>
                  <Text size="sm">{data.pgPaymentId}</Text>
                </Group>
              )}
            </Stack>
          )}

          {isLoading && (
            <Group gap="xs">
              <Loader size="xs" />
              <Text size="sm" c="dimmed">
                Загружаем платёж…
              </Text>
            </Group>
          )}

          {!isLoading && status === 'PENDING' && (
            <Text size="sm" c="dimmed" ta="center">
              Платёж ещё обрабатывается. Результат придёт, как только банк подтвердит
              операцию — эту страницу можно закрыть.
            </Text>
          )}

          {embedded ? (
            <Button
              variant="light"
              color="violet"
              radius="md"
              fullWidth
              onClick={() => postToNative(NATIVE_ACTIONS.close)}
            >
              Закрыть
            </Button>
          ) : (
            <Button component={Link} to="/payment" variant="light" color="violet" radius="md" fullWidth>
              Вернуться к оплате
            </Button>
          )}
        </Stack>
      </Card>
    </Center>
  );
};
