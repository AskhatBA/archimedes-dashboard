import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { useDraggable } from '@dnd-kit/core';
import { IconGripVertical } from '@tabler/icons-react';
import dayjs from 'dayjs';
import {
  PROGRAM_ORDER_CATEGORY_COLORS,
  PROGRAM_ORDER_CATEGORY_LABELS,
  formatTenge,
  pluralPrograms,
} from '../constants';
import type { ProgramOrder, ProgramOrderCategory } from '../types';

/** Same rule as the table: one badge per catalogue in the order, not one per program. */
const categoriesOf = (order: ProgramOrder): ProgramOrderCategory[] => [
  ...new Set(order.items.map((item) => item.category)),
];

type CardProps = {
  order: ProgramOrder;
  /** Set on the copy that follows the cursor, so it reads as lifted off the column. */
  overlay?: boolean;
};

/**
 * The card as it looks — split from the draggable wrapper so `DragOverlay` can render
 * the very same markup without registering a second draggable under the same id.
 */
export const ProgramOrderCardBody = ({ order, overlay }: CardProps) => (
  <Card
    withBorder
    radius="md"
    padding="sm"
    shadow={overlay ? 'md' : undefined}
    style={{ cursor: overlay ? 'grabbing' : 'pointer' }}
  >
    <Stack gap={8}>
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs">
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Text size="sm" fw={500} lineClamp={1}>
            {order.patientName ?? 'Профиль не заполнен'}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={1}>
            {order.patientIin ?? order.patientPhone}
          </Text>
        </Stack>
        <IconGripVertical size={16} opacity={0.35} style={{ flexShrink: 0 }} />
      </Group>

      <Group gap={6}>
        {categoriesOf(order).map((category) => (
          <Badge
            key={category}
            size="sm"
            variant="light"
            color={PROGRAM_ORDER_CATEGORY_COLORS[category]}
          >
            {PROGRAM_ORDER_CATEGORY_LABELS[category]}
          </Badge>
        ))}
      </Group>

      <Text size="xs" c="dimmed" lineClamp={2}>
        {order.items.map((item) => item.title).join(' · ')}
      </Text>

      <Group justify="space-between" align="center" wrap="nowrap">
        <Text size="sm" fw={600}>
          {formatTenge(order.total)}
        </Text>
        <Text size="xs" c="dimmed">
          {order.items.length} {pluralPrograms(order.items.length)} ·{' '}
          {dayjs(order.createdAt).format('D MMM')}
        </Text>
      </Group>
    </Stack>
  </Card>
);

type Props = CardProps & {
  onSelect: (order: ProgramOrder) => void;
  /** Tells the board a new press has begun, which is what clears its post-drop guard. */
  onPressStart: () => void;
  /** True while the write that this drag started is still in flight. */
  isMoving: boolean;
};

/**
 * A card is draggable by its whole surface *and* opens the drawer on click. The board
 * tells the two apart; all this has to do is announce the press, because a click that
 * follows one is the admin's, while the click a drop leaves behind follows no press.
 */
export const ProgramOrderCard = ({ order, onSelect, onPressStart, isMoving }: Props) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order.id,
    data: { order },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      // After the spread, so the sensor's own handler still runs but the press is
      // announced first.
      onPointerDown={(event) => {
        onPressStart();
        listeners?.onPointerDown?.(event);
      }}
      onClick={() => onSelect(order)}
      // The card being dragged stays in place as a ghost — `DragOverlay` draws the copy
      // that actually follows the cursor.
      style={{
        opacity: isDragging ? 0.35 : isMoving ? 0.55 : 1,
        outline: 'none',
        touchAction: 'none',
      }}
    >
      <ProgramOrderCardBody order={order} />
    </div>
  );
};
