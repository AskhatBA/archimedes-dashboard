import type { PatientGender } from './types';

export const PATIENT_GENDER_LABELS: Record<PatientGender, string> = {
  M: 'Мужской',
  F: 'Женский',
};

export const PATIENT_GENDER_OPTIONS = Object.entries(PATIENT_GENDER_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const PATIENT_GENDER_COLORS: Record<PatientGender, string> = {
  M: 'blue',
  F: 'pink',
};

export const PATIENT_PAGE_SIZE = 20;

/** The backend only ever stores `M`/`F`, but the column is a plain string. */
export const isKnownGender = (gender: string): gender is PatientGender =>
  gender === 'M' || gender === 'F';

export const genderLabel = (gender: string) =>
  isKnownGender(gender) ? PATIENT_GENDER_LABELS[gender] : gender;
