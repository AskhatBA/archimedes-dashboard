import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconMoodEmpty,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';
import { CheckupFormDrawer } from './components/checkup-form-drawer';
import { CheckupsTable } from './components/checkups-table';
import { DeleteCheckupModal } from './components/delete-checkup-modal';
import { useCheckups, useUpdateCheckup } from './hooks/use-checkups';
import type { Checkup } from './types';

export const Checkups = () => {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Checkup | null>(null);
  // Separate from `editing` because the create form has no check-up to edit.
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Checkup | null>(null);

  const { data, isPending, isFetching, isError, error, refetch } = useCheckups();
  const update = useUpdateCheckup();

  // The catalogue is a dozen rows, so filtering client-side beats a round trip.
  const query = search.trim().toLowerCase();
  const items = (data ?? []).filter(
    (checkup) =>
      !query ||
      checkup.title.toLowerCase().includes(query) ||
      checkup.code.toLowerCase().includes(query),
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (checkup: Checkup) => {
    setEditing(checkup);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const togglePublished = (checkup: Checkup) => {
    update.mutate({ id: checkup.id, payload: { isActive: !checkup.isActive } });
  };

  const togglingId =
    update.isPending && update.variables ? [update.variables.id] : [];

  return (
    <Stack gap="lg">
      <Card withBorder radius="lg" padding="lg">
        <Stack gap="md">
          <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm">
            <TextInput
              label="Поиск"
              placeholder="Название или код"
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              radius="md"
              w={280}
            />
            <Button
              leftSection={<IconPlus size={16} />}
              color="violet"
              radius="md"
              onClick={openCreate}
            >
              Добавить чек-ап
            </Button>
          </Group>

          {isError && (
            <Alert
              color="red"
              variant="light"
              radius="md"
              icon={<IconAlertTriangle size={18} />}
              title="Не удалось загрузить чек-апы"
            >
              <Stack gap={6} align="flex-start">
                <Text size="sm">
                  {error instanceof Error ? error.message : 'Неизвестная ошибка'}
                </Text>
                <Text
                  size="sm"
                  c="red"
                  fw={600}
                  style={{ cursor: 'pointer' }}
                  onClick={() => refetch()}
                >
                  Повторить
                </Text>
              </Stack>
            </Alert>
          )}

          {isPending && (
            <Center mih={220}>
              <Loader color="violet" />
            </Center>
          )}

          {!isPending && !isError && items.length === 0 && (
            <Center mih={220}>
              <Stack align="center" gap={6}>
                <IconMoodEmpty size={32} opacity={0.4} />
                <Text size="sm" c="dimmed">
                  {query ? 'Ничего не найдено' : 'Каталог пока пуст'}
                </Text>
              </Stack>
            </Center>
          )}

          {!isPending && items.length > 0 && (
            <Stack gap="md" style={{ opacity: isFetching ? 0.6 : 1 }}>
              <CheckupsTable
                items={items}
                pendingIds={togglingId}
                onEdit={openEdit}
                onDelete={setDeleting}
                onTogglePublished={togglePublished}
              />
              <Text size="sm" c="dimmed">
                Всего {(data ?? []).length} · опубликовано{' '}
                {(data ?? []).filter((checkup) => checkup.isActive).length}
              </Text>
            </Stack>
          )}
        </Stack>
      </Card>

      <CheckupFormDrawer opened={formOpen} checkup={editing} onClose={closeForm} />
      <DeleteCheckupModal checkup={deleting} onClose={() => setDeleting(null)} />
    </Stack>
  );
};
