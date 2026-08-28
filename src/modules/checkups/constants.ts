import type { CheckupCoverage } from './types';

export const COVERAGE_LABELS: Record<CheckupCoverage, string> = {
  PERSONAL: 'Персональный',
  FAMILY: 'Семейный',
};

export const COVERAGE_OPTIONS = Object.entries(COVERAGE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

/**
 * Services arrive as one blob of text from the form. The price list separates them with
 * `;`, the textarea with newlines — both are accepted so a spreadsheet cell can be
 * pasted in as-is.
 */
export const parseServices = (raw: string): string[] =>
  raw
    .split(/[\n;]/)
    .map((service) => service.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

export const formatServices = (services: string[]): string => services.join('\n');

export const formatPrice = (price: number) => `₸${price.toLocaleString('ru-RU')}`;
