import { useEffect } from 'react';
import {
  Alert,
  Button,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { formatPhone } from '../constants';
import { resolvePatientErrorMessage } from '../data';
import { useUpdatePatient } from '../hooks/use-patients';
import type { Patient, PatientFormValues, PatientUpdatePayload } from '../types';

type Props = {
  opened: boolean;
  patient: Patient | null;
  onClose: () => void;
};

const IIN_REGEX = /^\d{12}$/;

const NAME_MAX_LENGTH = 100;

const schema = yup.object({
  lastName: yup
    .string()
    .trim()
    .required('Обязательное поле')
    .max(NAME_MAX_LENGTH, `Не более ${NAME_MAX_LENGTH} символов`),
  firstName: yup
    .string()
    .trim()
    .required('Обязательное поле')
    .max(NAME_MAX_LENGTH, `Не более ${NAME_MAX_LENGTH} символов`),
  patronymic: yup.string().trim().max(NAME_MAX_LENGTH, `Не более ${NAME_MAX_LENGTH} символов`),
  iin: yup
    .string()
    .required('Обязательное поле')
    .matches(IIN_REGEX, 'ИИН — ровно 12 цифр'),
});

const toFormValues = (patient: Patient | null): PatientFormValues => ({
  lastName: patient?.lastName ?? '',
  firstName: patient?.firstName ?? '',
  patronymic: patient?.patronymic ?? '',
  iin: patient?.iin ?? '',
});

/**
 * Only the fields the admin actually changed go out, so saving a form opened a while ago
 * cannot put back a value that was changed in the meantime.
 */
const toPayload = (
  values: PatientFormValues,
  initial: PatientFormValues,
): PatientUpdatePayload => {
  const payload: PatientUpdatePayload = {};

  for (const field of Object.keys(values) as (keyof PatientFormValues)[]) {
    const value = values[field].trim();

    if (value !== initial[field]) {
      payload[field] = value;
    }
  }

  return payload;
};

export const PatientFormDrawer = ({ opened, patient, onClose }: Props) => {
  const update = useUpdatePatient();
  const initialValues = toFormValues(patient);

  const formik = useFormik<PatientFormValues>({
    initialValues,
    validationSchema: schema,
    // The same drawer instance is reused for every row, so it has to adopt the values
    // of whichever patient was opened.
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!patient) {
        return;
      }

      const payload = toPayload(values, initialValues);

      if (Object.keys(payload).length === 0) {
        onClose();
        return;
      }

      try {
        await update.mutateAsync({ id: patient.id, payload });
        onClose();
      } catch {
        // Surfaced by the alert below; swallowed so formik can reset isSubmitting.
      }
    },
  });

  const { resetForm } = formik;

  // Closing the drawer must also drop the error banner and any half-typed edit, so the
  // next row does not open on top of the previous one's state.
  useEffect(() => {
    if (!opened) {
      resetForm();
      update.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, resetForm]);

  const iinChanged =
    patient !== null &&
    IIN_REGEX.test(formik.values.iin) &&
    formik.values.iin !== patient.iin;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      padding="lg"
      title={
        <Text fw={600} size="lg">
          Редактирование пациента
        </Text>
      }
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <Stack gap="md">
          {update.isError && (
            <Alert
              color="red"
              variant="light"
              radius="md"
              icon={<IconAlertCircle size={18} />}
            >
              {resolvePatientErrorMessage(update.error)}
            </Alert>
          )}

          <TextInput
            label="Фамилия"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && formik.errors.lastName}
            radius="md"
            withAsterisk
          />

          <TextInput
            label="Имя"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && formik.errors.firstName}
            radius="md"
            withAsterisk
          />

          <TextInput
            label="Отчество"
            name="patronymic"
            value={formik.values.patronymic}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.patronymic && formik.errors.patronymic}
            radius="md"
          />

          <TextInput
            label="ИИН"
            name="iin"
            inputMode="numeric"
            value={formik.values.iin}
            onChange={(e) =>
              formik.setFieldValue(
                'iin',
                e.currentTarget.value.replace(/\D/g, '').slice(0, 12),
              )
            }
            onBlur={formik.handleBlur}
            error={formik.touched.iin && formik.errors.iin}
            radius="md"
            ff="monospace"
            withAsterisk
          />

          {iinChanged && (
            <Alert
              color="yellow"
              variant="light"
              radius="md"
              icon={<IconInfoCircle size={18} />}
            >
              Профиль будет заново связан с пациентом МИС по новому ИИН — приёмы,
              история и анализы в приложении начнут браться из этой записи. Если в МИС
              нет пациента с таким ИИН, сохранение не пройдёт. Дата рождения и пол не
              меняются.
            </Alert>
          )}

          <Divider />

          <TextInput
            label="Телефон"
            value={patient ? formatPhone(patient.phone) : ''}
            description="Это логин пациента в приложении — здесь его изменить нельзя"
            radius="md"
            disabled
          />

          <Group justify="flex-end" gap="sm" mt="sm">
            <Button variant="default" radius="md" onClick={onClose}>
              Отмена
            </Button>
            <Button
              type="submit"
              color="violet"
              radius="md"
              loading={formik.isSubmitting}
              disabled={!formik.dirty}
            >
              Сохранить
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};
