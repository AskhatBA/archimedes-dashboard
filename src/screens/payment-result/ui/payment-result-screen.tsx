import { PaymentResult } from '@/modules/payment';

type Props = {
  outcome: 'success' | 'failure';
};

export const PaymentResultScreen = ({ outcome }: Props) => <PaymentResult outcome={outcome} />;
