import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { formatPhone } from '../constants';
import { resolvePatientErrorMessage } from '../data';
import { useDeletePatient } from '../hooks/use-patients';
import type { Patient } from '../types';

type Props = {
  patient: Patient | null;
  onClose: () => void;
};

export const DeletePatientModal = ({ patient, onClose }: Props) => {
  const remove = useDeletePatient();

  const close = () => {
    remove.reset();
    onClose();
  };

  const handleDelete = async () => {
    if (!patient) {
      return;
    }

    try {
      await remove.mutateAsync(patient);
      close();
    } catch {
      // Surfaced by the alert below.
    }
  };

  return (
    <Modal
      opened={patient !== null}
      onClose={close}
      centered
      radius="lg"
      title={
        <Text fw={600} size="lg">
          Удалить профиль пациента?
        </Text>
      }
    >
      <Stack gap="md">
        {remove.isError && (
          <Alert
            color="red"
            variant="light"
            radius="md"
            icon={<IconAlertCircle size={18} />}
          >
            {resolvePatientErrorMessage(remove.error)}
          </Alert>
        )}

        <Text size="sm">
          Профиль «{patient?.fullName}» (ИИН {patient?.iin}) будет удалён безвозвратно.
        </Text>

        <Text size="sm" c="dimmed">
          Учётная запись с телефоном {patient ? formatPhone(patient.phone) : ''} останется
          вместе с приёмами, платежами и заказами: пациент сможет войти в приложение и
          заполнить профиль заново.
        </Text>

        <Group justify="flex-end" gap="sm">
          <Button variant="default" radius="md" onClick={close}>
            Отмена
          </Button>
          <Button
            color="red"
            radius="md"
            loading={remove.isPending}
            onClick={handleDelete}
          >
            Удалить профиль
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
