import {
  ActionIcon,
  Badge,
  Group,
  ScrollArea,
  Stack,
  Switch,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { COVERAGE_LABELS, formatPrice } from '../constants';
import type { Checkup } from '../types';

type Props = {
  items: Checkup[];
  /** Ids currently being toggled, so their switch shows the write in flight. */
  pendingIds: string[];
  onEdit: (checkup: Checkup) => void;
  onDelete: (checkup: Checkup) => void;
  onTogglePublished: (checkup: Checkup) => void;
};

export const CheckupsTable = ({
  items,
  pendingIds,
  onEdit,
  onDelete,
  onTogglePublished,
}: Props) => (
  <ScrollArea>
    <Table verticalSpacing="sm" highlightOnHover miw={900}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Чек-ап</Table.Th>
          <Table.Th>Услуги</Table.Th>
          <Table.Th ta="right">Стоимость</Table.Th>
          <Table.Th>Тип</Table.Th>
          <Table.Th>В приложении</Table.Th>
          <Table.Th w={96} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((checkup) => (
          <Table.Tr key={checkup.id}>
            <Table.Td>
              <Stack gap={2}>
                <Group gap={6}>
                  <Text size="sm" fw={500}>
                    {checkup.title}
                  </Text>
                  {checkup.popular && (
                    <Badge size="xs" variant="light" color="violet">
                      Популярное
                    </Badge>
                  )}
                </Group>
                <Text size="xs" c="dimmed">
                  {checkup.code}
                  {checkup.duration ? ` · ${checkup.duration}` : ''}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Tooltip
                multiline
                w={320}
                withArrow
                label={checkup.services.join(' · ')}
                disabled={checkup.services.length === 0}
              >
                <Text size="sm" c="dimmed">
                  {checkup.services.length}
                </Text>
              </Tooltip>
            </Table.Td>
            <Table.Td ta="right">
              <Text size="sm" fw={600}>
                {formatPrice(checkup.price)}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{COVERAGE_LABELS[checkup.coverage]}</Text>
            </Table.Td>
            <Table.Td>
              <Switch
                checked={checkup.isActive}
                onChange={() => onTogglePublished(checkup)}
                disabled={pendingIds.includes(checkup.id)}
                color="violet"
                size="sm"
                aria-label={
                  checkup.isActive ? 'Снять с публикации' : 'Опубликовать'
                }
              />
            </Table.Td>
            <Table.Td>
              <Group gap={4} justify="flex-end" wrap="nowrap">
                <Tooltip label="Редактировать">
                  <ActionIcon
                    variant="subtle"
                    color="violet"
                    onClick={() => onEdit(checkup)}
                    aria-label="Редактировать"
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Удалить">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => onDelete(checkup)}
                    aria-label="Удалить"
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </ScrollArea>
);
