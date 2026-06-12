import { Box, Button, Center, Stack, Text, Title } from '@mantine/core';
import { useRef } from 'react';
import { samplePaymentPayload } from './data';
import type { PaymentFormPayload } from './types';

const PAYMENT_GATEWAY_URL = 'https://test3ds.bcc.kz:5445/cgi-bin/cgi_link';

type Props = {
  payload?: PaymentFormPayload;
};

export const PaymentForm = ({ payload = samplePaymentPayload }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Center mih="100svh" p="md">
      <Stack gap="lg" align="center" maw={420} w="100%">
        <Stack gap={4} align="center">
          <Title order={3}>Оплата заказа №{payload.ORDER}</Title>
          <Text c="dimmed" size="sm">
            Сумма: {payload.AMOUNT} {payload.CURRENCY === '398' ? 'KZT' : ''}
          </Text>
        </Stack>
        <Box w="100%">
          <Button
            fullWidth
            size="md"
            radius="md"
            color="violet"
            onClick={() => formRef.current?.submit()}
          >
            Оплатить
          </Button>
        </Box>
        <form ref={formRef} method="POST" action={PAYMENT_GATEWAY_URL} hidden>
          {Object.entries(payload).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      </Stack>
    </Center>
  );
};

export { samplePaymentPayload } from './data';
export type { PaymentFormPayload } from './types';