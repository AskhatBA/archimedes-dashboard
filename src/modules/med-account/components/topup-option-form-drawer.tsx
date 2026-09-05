import { useEffect } from 'react';
import {
  Alert,
  Button,
  Divider,
  Drawer,
  Group,
  NumberInput,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { resolveMedAccountErrorMessage } from '../data';
import { useCreateTopupOption, useUpdateTopupOption } from '../hooks/use-topup-options';
import type { TopupOption, TopupOptionFormValues, TopupOptionPayload } from '../types';

type Props = {
  opened: boolean;
  /** `null` opens the drawer in create mode. */
  option: TopupOption | null;
  onClose: () => void;
};

const schema = yup.object({
  amount: yup
    .number()
    .typeError('Введите число')
    .integer('Только целое число тенге')
    .min(1, 'Должна быть больше нуля')
    .max(10_000_000, 'Не более 10 000 000 ₸')
    .required('Обязательное поле'),
  label: yup.string().trim().max(200, 'Не более 200 символов'),
  sortOrder: yup
    .number()
    .typeError('Введите число')
    .integer('Только целое число')
    .min(0, 'Не может быть отрицательным'),
});

const emptyValues: TopupOptionFormValues = {
  amount: '',
  label: '',
  popular: false,
  isActive: true,
  sortOrder: '',
};

const toFormValues = (option: TopupOption | null): TopupOptionFormValues =>
  option
    ? {
        amount: option.amount,
        label: option.label ?? '',
        popular: option.popular,
        isActive: option.isActive,
        sortOrder: option.sortOrder,
      }
    : emptyValues;

/** An empty caption means "no value", which the backend stores as null, not "". */
const toPayload = (values: TopupOptionFormValues): TopupOptionPayload => ({
  amount: Number(values.amount),
  label: values.label.trim() || null,
  popular: values.popular,
  isActive: values.isActive,
  // Left blank on a new amount, so the backend appends it after the last one.
  ...(values.sortOrder === '' ? {} : { sortOrder: Number(values.sortOrder) }),
});

export const TopupOptionFormDrawer = ({ opened, option, onClose }: Props) => {
  const create = useCreateTopupOption();
  const update = useUpdateTopupOption();
  const isEdit = option !== null;

  const formik = useFormik<TopupOptionFormValues>({
    initialValues: toFormValues(option),
    validationSchema: schema,
    // The same drawer instance is reused for every row, so it has to adopt the values of
    // whichever amount was opened.
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = toPayload(values);

        if (option) {
          await update.mutateAsync({ id: option.id, payload });
        } else {
          await create.mutateAsync(payload);
        }

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
      create.reset();
      update.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, resetForm]);

  const mutation = isEdit ? update : create;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      padding="lg"
      title={
        <Text fw={600} size="lg">
          {isEdit ? 'Редактирование суммы' : 'Новая сумма пополнения'}
        </Text>
      }
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <Stack gap="md">
          {mutation.isError && (
            <Alert
              color="red"
              variant="light"
              radius="md"
              icon={<IconAlertCircle size={18} />}
            >
              {resolveMedAccountErrorMessage(mutation.error)}
            </Alert>
          )}

          <NumberInput
            label="Сумма, ₸"
            name="amount"
            placeholder="100000"
            description="Ровно та сумма, которую спишут с карты. Повторяться в списке не может."
            value={formik.values.amount}
            onChange={(value) => formik.setFieldValue('amount', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.amount && formik.errors.amount}
            min={1}
            step={10000}
            thousandSeparator=" "
            radius="md"
            withAsterisk
          />

          <TextInput
            label="Подпись"
            name="label"
            placeholder="Хватит на приём терапевта"
            description="Необязательная строка под суммой в приложении."
            value={formik.values.label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.label && formik.errors.label}
            radius="md"
          />

          <NumberInput
            label="Порядок"
            name="sortOrder"
            placeholder="Оставьте пустым — добавим в конец"
            description="Чем меньше число, тем выше сумма в списке."
            value={formik.values.sortOrder}
            onChange={(value) => formik.setFieldValue('sortOrder', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.sortOrder && formik.errors.sortOrder}
            min={0}
            step={10}
            radius="md"
          />

          <Divider />

          <Switch
            label="Отметить как выгодную"
            description="Рисует бейдж «Выгодно» на карточке."
            checked={formik.values.popular}
            onChange={(event) =>
              formik.setFieldValue('popular', event.currentTarget.checked)
            }
            color="violet"
          />

          <Switch
            label="Показывать в приложении"
            description="Снятая с публикации сумма остаётся здесь, но пациенту не предлагается."
            checked={formik.values.isActive}
            onChange={(event) =>
              formik.setFieldValue('isActive', event.currentTarget.checked)
            }
            color="violet"
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
            >
              {isEdit ? 'Сохранить' : 'Добавить'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};
