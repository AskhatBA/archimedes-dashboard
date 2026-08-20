import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Box, Button, Card, Center, NumberInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useInitPayment } from '../hooks/use-init-payment';
import { LAST_PAYMENT_ID_KEY } from '../constants';

const errorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  return error instanceof Error ? error.message : 'Не удалось инициировать платёж';
};

export const PaymentForm = () => {
  const [amount, setAmount] = useState<number | string>('');
  const [description, setDescription] = useState('');
  const initPayment = useInitPayment();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const body = {
      amount: Number(amount),
      ...(description.trim() ? { description: description.trim() } : {}),
    };

    initPayment.mutate(body, {
      onSuccess: (data) => {
        // FreedomPay does pass pg_order_id back on the return redirect, but keeping the id
        // here means the result screen still works if those parameters ever go missing.
        sessionStorage.setItem(LAST_PAYMENT_ID_KEY, data.paymentId);
        window.location.href = data.paymentUrl;
      },
    });
  };

  return (
    <Center mih="100svh" p="md">
      <Card withBorder shadow="md" radius="lg" padding="xl" w="100%" maw={420}>
        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={3}>Пополнение баланса</Title>
            <Text c="dimmed" size="sm">
              Введите сумму для оплаты
            </Text>
          </Stack>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack gap="md">
              <NumberInput
                label="Сумма (KZT)"
                placeholder="5000"
                min={1}
                value={amount}
                onChange={setAmount}
                required
              />
              <TextInput
                label="Описание (необязательно)"
                placeholder="Пополнение баланса"
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
              {initPayment.isError && (
                <Text c="red" size="sm">
                  {errorMessage(initPayment.error)}
                </Text>
              )}
              <Button
                type="submit"
                fullWidth
                size="md"
                radius="md"
                color="violet"
                loading={initPayment.isPending}
                disabled={!amount || Number(amount) <= 0}
              >
                Оплатить
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Card>
    </Center>
  );
};
