import { PaymentAutostart, PaymentForm } from '@/modules/payment';
import { nativeContext } from '@/shared/lib';

export const PaymentScreen = () => {
  // Read once at mount: the native side injects its context before the page boots, and a
  // reload with the same context should restart the same payment intent.
  const { amount, description } = nativeContext();

  if (typeof amount === 'number' && amount > 0) {
    return <PaymentAutostart amount={amount} description={description} />;
  }

  return <PaymentForm />;
};
