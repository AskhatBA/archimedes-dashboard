import { useRef, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { IconAlertCircle } from '@tabler/icons-react';
import {
  PROGRAM_ORDER_DRAG_ACTIVATION_DISTANCE,
  PROGRAM_ORDER_STATUS_COLORS,
  PROGRAM_ORDER_STATUS_COLUMN_LABELS,
  PROGRAM_ORDER_STATUS_HINTS,
  formatTenge,
} from '../constants';
import { resolveProgramOrderErrorMessage } from '../data';
import {
  useUpdateProgramOrder,
  type ProgramOrderBoardColumn,
} from '../hooks/use-program-orders';
import { ProgramOrderCard, ProgramOrderCardBody } from './program-order-card';
import type { ProgramOrder, ProgramOrderStatus } from '../types';

const COLUMN_WIDTH = 300;

type ColumnProps = {
  column: ProgramOrderBoardColumn;
  /** The order whose move is still being written, if it is one of this column's cards. */
  movingId: string | undefined;
  onLoadMore: () => void;
  onSelect: (order: ProgramOrder) => void;
  onPressStart: () => void;
};

const BoardColumn = ({
  column,
  movingId,
  onLoadMore,
  onSelect,
  onPressStart,
}: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.status });
  const color = PROGRAM_ORDER_STATUS_COLORS[column.status];

  return (
    <Card
      withBorder
      radius="lg"
      padding="sm"
      w={COLUMN_WIDTH}
      miw={COLUMN_WIDTH}
      // The drop target is the whole column, empty space included — otherwise the first
      // card in an empty column would have nowhere to land.
      ref={setNodeRef}
      style={{
        alignSelf: 'stretch',
        backgroundColor: isOver
          ? 'var(--mantine-color-violet-light)'
          : 'var(--mantine-color-body)',
        transition: 'background-color 120ms ease',
      }}
    >
      <Stack gap="sm" h="100%">
        <Stack gap={4}>
          <Group justify="space-between" wrap="nowrap">
            <Group gap={8} wrap="nowrap">
              <Text size="sm" fw={600}>
                {PROGRAM_ORDER_STATUS_COLUMN_LABELS[column.status]}
              </Text>
              <Badge size="sm" variant="light" color={color}>
                {column.total.toLocaleString('ru-RU')}
              </Badge>
            </Group>
            {column.isFetching && <Loader size={14} color={color} />}
          </Group>
          <Text size="xs" c="dimmed">
            {column.totalAmount > 0
              ? formatTenge(column.totalAmount)
              : PROGRAM_ORDER_STATUS_HINTS[column.status]}
          </Text>
        </Stack>

        <ScrollArea.Autosize mah={560} type="auto" offsetScrollbars>
          <Stack gap="sm" pr={4}>
            {column.items.length === 0 && (
              <Center mih={120}>
                <Text size="xs" c="dimmed">
                  Перетащите заявку сюда
                </Text>
              </Center>
            )}
            {column.items.map((order) => (
              <ProgramOrderCard
                key={order.id}
                order={order}
                onSelect={onSelect}
                onPressStart={onPressStart}
                isMoving={order.id === movingId}
              />
            ))}
            {column.items.length < column.total && (
              <Button variant="subtle" size="xs" radius="md" onClick={onLoadMore}>
                Показать ещё
              </Button>
            )}
          </Stack>
        </ScrollArea.Autosize>
      </Stack>
    </Card>
  );
};

type Props = {
  columns: ProgramOrderBoardColumn[];
  onSelect: (order: ProgramOrder) => void;
  onLoadMore: (status: ProgramOrderStatus) => void;
};

export const ProgramOrdersBoard = ({ columns, onSelect, onLoadMore }: Props) => {
  const [activeOrder, setActiveOrder] = useState<ProgramOrder | null>(null);
  // Releasing a drag also fires a `click` on whatever ends up under the cursor, which
  // would open that card's drawer on top of the board. The flag swallows exactly that one
  // click: it is raised on drop and lowered by the next press, so a click the admin
  // actually made — which always follows a press — is never the one that gets eaten.
  const dragJustEnded = useRef(false);
  const update = useUpdateProgramOrder();

  const sensors = useSensors(
    // Without a distance threshold every click on a card would start a drag and the
    // details drawer could never open.
    useSensor(PointerSensor, {
      activationConstraint: { distance: PROGRAM_ORDER_DRAG_ACTIVATION_DISTANCE },
    }),
    useSensor(KeyboardSensor),
  );

  const handlePressStart = () => {
    dragJustEnded.current = false;
  };

  const handleSelect = (order: ProgramOrder) => {
    if (dragJustEnded.current) {
      dragJustEnded.current = false;

      return;
    }

    onSelect(order);
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveOrder((active.data.current?.order as ProgramOrder | undefined) ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveOrder(null);
    dragJustEnded.current = true;

    const order = active.data.current?.order as ProgramOrder | undefined;
    const target = over?.id as ProgramOrderStatus | undefined;

    if (!order || !target || order.status === target) return;

    // The card is in the target column before the request goes out: the mutation moves it
    // inside the cache the columns are rendered from, so there is one card, in one place,
    // the whole time.
    update.mutate({ id: order.id, payload: { status: target } });
  };

  return (
    <Stack gap="sm">
      {update.isError && (
        <Alert
          color="red"
          variant="light"
          radius="md"
          icon={<IconAlertCircle size={18} />}
          title="Не удалось перенести заявку"
        >
          {resolveProgramOrderErrorMessage(update.error)}
        </Alert>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveOrder(null)}
      >
        <ScrollArea type="auto" offsetScrollbars>
          <Group align="stretch" gap="md" wrap="nowrap" pb={4}>
            {columns.map((column) => (
              <BoardColumn
                key={column.status}
                column={column}
                movingId={update.isPending ? update.variables?.id : undefined}
                onLoadMore={() => onLoadMore(column.status)}
                onSelect={handleSelect}
                onPressStart={handlePressStart}
              />
            ))}
          </Group>
        </ScrollArea>

        <DragOverlay dropAnimation={null}>
          {activeOrder && (
            <div style={{ width: COLUMN_WIDTH - 32 }}>
              <ProgramOrderCardBody order={activeOrder} overlay />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </Stack>
  );
};
