import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { formatAmount } from '../constants';
import { resolveMedAccountErrorMessage } from '../data';
import { useDeleteTopupOption } from '../hooks/use-topup-options';
import type { TopupOption } from '../types';

type Props = {
  option: TopupOption | null;
  onClose: () => void;
};

export const DeleteTopupOptionModal = ({ option, onClose }: Props) => {
  const remove = useDeleteTopupOption();

  const handleDelete = async () => {
    if (!option) {
      return;
    }

    try {
      await remove.mutateAsync(option);
      onClose();
    } catch {
      // Surfaced by the alert below.
    }
  };

  return (
    <Modal
      opened={option !== null}
      onClose={onClose}
      centered
      radius="lg"
      title={
        <Text fw={600} size="lg">
          Удалить сумму?
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
            {resolveMedAccountErrorMessage(remove.error)}
          </Alert>
        )}

        <Text size="sm">
          {option ? formatAmount(option.amount) : ''} исчезнет из списка безвозвратно. Уже
          оплаченные пополнения на эту сумму останутся в очереди — они хранят свою сумму
          сами. Если её нужно лишь временно убрать из приложения — снимите с публикации
          вместо удаления.
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
