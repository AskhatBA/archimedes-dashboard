import type { PaymentFormPayload } from './types';

export const samplePaymentPayload: PaymentFormPayload = {
  AMOUNT: '582',
  CURRENCY: '398',
  ORDER: '74573996',
  DESC: 'TRTYPE=0 test transaction (Challenge Flow + Fingerprint)',
  MERCHANT: '00000001',
  MERCH_NAME: 'TOO MERCHANT',
  MERCH_URL: 'https://merchantdomain.kz',
  COUNTRY: 'KZ',
  BRANDS: 'VISA, Mastercard',
  TERMINAL: '88888881',
  TIMESTAMP: '20260603075033',
  MERCH_GMT: '0',
  TRTYPE: '0',
  BACKREF: 'https://merchantdomain.kz/back/to/merchant/site',
  LANG: 'ru',
  NONCE: '039AB284EA835E96FA048A1AC969D2A5',
  P_SIGN: '1E760D20814E052257E547614E561D13D9722A82',
  MK_TOKEN: 'MERCH',
  NOTIFY_URL: 'https://archimedes.kz/',
  CLIENT_IP: '0.0.0.0',
  M_INFO:
    'ewoJImJyb3dzZXJTY3JlZW5IZWlnaHQiOiIxOTIwIiwKCSJicm93c2VyU2NyZWVuV2lkdGgiOiIxMDgwIiwKCSJtb2JpbGVQaG9uZSI6ewoJCSJjYyI6ICI3IiAsCgkJInN1YnNjcmliZXIiOiI3NDc1NTU4ODg4IgoJfSwKCSJiaWxsQWRkckxpbmUxIjoi0JDQtNGA0LXRgSwgODgiCn0=',
};
