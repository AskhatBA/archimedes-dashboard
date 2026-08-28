import { useEffect } from 'react';
import {
  Alert,
  Button,
  Divider,
  Drawer,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { COVERAGE_OPTIONS, formatServices, parseServices } from '../constants';
import { resolveCheckupErrorMessage } from '../data';
import { useCreateCheckup, useUpdateCheckup } from '../hooks/use-checkups';
import type {
  Checkup,
  CheckupCoverage,
  CheckupFormValues,
  CheckupPayload,
} from '../types';

type Props = {
  opened: boolean;
  /** `null` opens the drawer in create mode. */
  checkup: Checkup | null;
  onClose: () => void;
};

const CODE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const schema = yup.object({
  title: yup.string().trim().required('Обязательное поле').max(200, 'Не более 200 символов'),
  code: yup
    .string()
    .trim()
    .required('Обязательное поле')
    .max(64, 'Не более 64 символов')
    .matches(CODE_REGEX, 'Только латиница в нижнем регистре, цифры и дефис'),
  price: yup
    .number()
    .typeError('Введите число')
    .integer('Только целое число')
    .min(0, 'Не может быть отрицательной')
    .required('Обязательное поле'),
  services: yup
    .string()
    .test('has-services', 'Добавьте хотя бы одну услугу', (value) =>
      parseServices(value ?? '').length > 0,
    ),
  sortOrder: yup
    .number()
    .typeError('Введите число')
    .integer('Только целое число')
    .min(0, 'Не может быть отрицательным'),
});

const emptyValues: CheckupFormValues = {
  code: '',
  title: '',
  price: '',
  services: '',
  description: '',
  duration: '',
  coverage: 'PERSONAL',
  popular: false,
  isActive: true,
  sortOrder: '',
};

const toFormValues = (checkup: Checkup | null): CheckupFormValues =>
  checkup
    ? {
        code: checkup.code,
        title: checkup.title,
        price: checkup.price,
        services: formatServices(checkup.services),
        description: checkup.description ?? '',
        duration: checkup.duration ?? '',
        coverage: checkup.coverage,
        popular: checkup.popular,
        isActive: checkup.isActive,
        sortOrder: checkup.sortOrder,
      }
    : emptyValues;

/** Empty optional text means "no value", which the backend stores as null, not "". */
const toPayload = (values: CheckupFormValues): CheckupPayload => ({
  code: values.code.trim(),
  title: values.title.trim(),
  price: Number(values.price),
  services: parseServices(values.services),
  description: values.description.trim() || null,
  duration: values.duration.trim() || null,
  coverage: values.coverage,
  popular: values.popular,
  isActive: values.isActive,
  // Left blank on a new check-up, so the backend appends it after the last one.
  ...(values.sortOrder === '' ? {} : { sortOrder: Number(values.sortOrder) }),
});

export const CheckupFormDrawer = ({ opened, checkup, onClose }: Props) => {
  const create = useCreateCheckup();
  const update = useUpdateCheckup();
  const isEdit = checkup !== null;

  const formik = useFormik<CheckupFormValues>({
    initialValues: toFormValues(checkup),
    validationSchema: schema,
    // The same drawer instance is reused for every row, so it has to adopt the values
    // of whichever check-up was opened.
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = toPayload(values);

        if (checkup) {
          await update.mutateAsync({ id: checkup.id, payload });
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
  const serviceCount = parseServices(formik.values.services).length;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      padding="lg"
      title={
        <Text fw={600} size="lg">
          {isEdit ? 'Редактирование чек-апа' : 'Новый чек-ап'}
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
              {resolveCheckupErrorMessage(mutation.error)}
            </Alert>
          )}

          <TextInput
            label="Название"
            name="title"
            placeholder="Чек-ап «Здоровые почки»"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title}
            radius="md"
            withAsterisk
          />

          <TextInput
            label="Код"
            name="code"
            placeholder="kidneys"
            description="Латиницей, через дефис. Используется в ссылках и при импорте прайс-листа — менять уже опубликованный код нежелательно."
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.code && formik.errors.code}
            radius="md"
            withAsterisk
          />

          <Group grow align="flex-start">
            <NumberInput
              label="Стоимость, ₸"
              name="price"
              placeholder="15400"
              value={formik.values.price}
              onChange={(value) => formik.setFieldValue('price', value)}
              onBlur={formik.handleBlur}
              error={formik.touched.price && formik.errors.price}
              min={0}
              step={100}
              thousandSeparator=" "
              radius="md"
              withAsterisk
            />
            <TextInput
              label="Длительность"
              name="duration"
              placeholder="1 день"
              value={formik.values.duration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              radius="md"
            />
          </Group>

          <Textarea
            label="Описание"
            name="description"
            placeholder="Короткий текст над списком услуг. Если пусто — блок в приложении скрыт."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autosize
            minRows={2}
            maxRows={5}
            radius="md"
          />

          <Textarea
            label="Услуги"
            name="services"
            description={`Одна услуга в строке. Можно вставить строку из прайс-листа через «;» — она разобьётся сама. Сейчас: ${serviceCount}`}
            placeholder={'Консультация терапевта\nУЗИ почек\nОбщий анализ крови'}
            value={formik.values.services}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.services && formik.errors.services}
            autosize
            minRows={5}
            maxRows={14}
            radius="md"
            withAsterisk
          />

          <Divider />

          <Group grow align="flex-start">
            <Select
              label="Тип программы"
              data={COVERAGE_OPTIONS}
              value={formik.values.coverage}
              onChange={(value) =>
                formik.setFieldValue('coverage', (value as CheckupCoverage) ?? 'PERSONAL')
              }
              allowDeselect={false}
              radius="md"
            />
            <NumberInput
              label="Порядок"
              name="sortOrder"
              description="Меньше — выше в списке. Пусто — в конец списка"
              value={formik.values.sortOrder}
              onChange={(value) => formik.setFieldValue('sortOrder', value)}
              onBlur={formik.handleBlur}
              error={formik.touched.sortOrder && formik.errors.sortOrder}
              min={0}
              step={10}
              radius="md"
            />
          </Group>

          <Switch
            label="Показывать бейдж «Популярное»"
            checked={formik.values.popular}
            onChange={(e) => formik.setFieldValue('popular', e.currentTarget.checked)}
            color="violet"
          />

          <Switch
            label="Опубликован в приложении"
            description="Выключенный чек-ап остаётся здесь, но пропадает из мобильного приложения"
            checked={formik.values.isActive}
            onChange={(e) => formik.setFieldValue('isActive', e.currentTarget.checked)}
            color="violet"
          />

          <Group justify="flex-end" gap="sm" mt="sm">
            <Button variant="default" radius="md" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" color="violet" radius="md" loading={formik.isSubmitting}>
              {isEdit ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};
