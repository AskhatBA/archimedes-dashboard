import {
  ActionIcon,
  Badge,
  Group,
  ScrollArea,
  Switch,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { formatAmount } from '../constants';
import type { TopupOption } from '../types';

type Props = {
  items: TopupOption[];
  /** Ids currently being toggled, so their switch shows the write in flight. */
  pendingIds: string[];
  onEdit: (option: TopupOption) => void;
  onDelete: (option: TopupOption) => void;
  onTogglePublished: (option: TopupOption) => void;
};

export const TopupOptionsTable = ({
  items,
  pendingIds,
  onEdit,
  onDelete,
  onTogglePublished,
}: Props) => (
  <ScrollArea>
    <Table verticalSpacing="sm" highlightOnHover miw={720}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th ta="right" w={160}>
            Сумма
          </Table.Th>
          <Table.Th>Подпись в приложении</Table.Th>
          <Table.Th w={110} ta="right">
            Порядок
          </Table.Th>
          <Table.Th w={140}>В приложении</Table.Th>
          <Table.Th w={96} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((option) => (
          <Table.Tr key={option.id}>
            <Table.Td ta="right">
              <Group gap={6} justify="flex-end" wrap="nowrap">
                <Text size="sm" fw={600}>
                  {formatAmount(option.amount)}
                </Text>
                {option.popular && (
                  <Badge size="xs" variant="light" color="violet">
                    Выгодно
                  </Badge>
                )}
              </Group>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c={option.label ? undefined : 'dimmed'}>
                {option.label ?? '—'}
              </Text>
            </Table.Td>
            <Table.Td ta="right">
              <Text size="sm" c="dimmed">
                {option.sortOrder}
              </Text>
            </Table.Td>
            <Table.Td>
              <Switch
                checked={option.isActive}
                onChange={() => onTogglePublished(option)}
                disabled={pendingIds.includes(option.id)}
                color="violet"
                size="sm"
                aria-label={option.isActive ? 'Снять с публикации' : 'Опубликовать'}
              />
            </Table.Td>
            <Table.Td>
              <Group gap={4} justify="flex-end" wrap="nowrap">
                <Tooltip label="Редактировать">
                  <ActionIcon
                    variant="subtle"
                    color="violet"
                    onClick={() => onEdit(option)}
                    aria-label="Редактировать"
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Удалить">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => onDelete(option)}
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
