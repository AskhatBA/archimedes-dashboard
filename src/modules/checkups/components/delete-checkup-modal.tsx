import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { resolveCheckupErrorMessage } from '../data';
import { useDeleteCheckup } from '../hooks/use-checkups';
import type { Checkup } from '../types';

type Props = {
  checkup: Checkup | null;
  onClose: () => void;
};

export const DeleteCheckupModal = ({ checkup, onClose }: Props) => {
  const remove = useDeleteCheckup();

  const handleDelete = async () => {
    if (!checkup) {
      return;
    }

    try {
      await remove.mutateAsync(checkup);
      onClose();
    } catch {
      // Surfaced by the alert below.
    }
  };

  return (
    <Modal
      opened={checkup !== null}
      onClose={onClose}
      centered
      radius="lg"
      title={
        <Text fw={600} size="lg">
          Удалить чек-ап?
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
            {resolveCheckupErrorMessage(remove.error)}
          </Alert>
        )}

        <Text size="sm">
          «{checkup?.title}» будет удалён из каталога безвозвратно. Если чек-ап нужно
          лишь временно убрать из приложения — снимите его с публикации вместо удаления.
        </Text>

        <Group justify="flex-end" gap="sm">
          <Button variant="default" radius="md" onClick={onClose}>
            Отмена
          </Button>
          <Button
            color="red"
            radius="md"
            loading={remove.isPending}
            onClick={handleDelete}
          >
            Удалить
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
