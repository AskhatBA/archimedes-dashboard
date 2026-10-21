import { Button, Group, SegmentedControl, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { OUTCOME_OPTIONS } from '../constants';
import type { AuthAttemptOutcome } from '../types';

type Props = {
  searchInput: string;
  isSearchIncomplete: boolean;
  outcome: AuthAttemptOutcome;
  onSearchInput: (value: string) => void;
  onOutcomeChange: (outcome: AuthAttemptOutcome) => void;
  onReset: () => void;
};

export const AuthAttemptsFilters = ({
  searchInput,
  isSearchIncomplete,
  outcome,
  onSearchInput,
  onOutcomeChange,
  onReset,
}: Props) => (
  <Group gap="sm" align="flex-start" wrap="wrap">
    <TextInput
      label="Поиск"
      placeholder="Телефон или ИИН"
      description={
        isSearchIncomplete ? 'Введите телефон полностью или ИИН из 12 цифр' : undefined
      }
      inputWrapperOrder={['label', 'input', 'description']}
      leftSection={<IconSearch size={16} />}
      value={searchInput}
      onChange={(e) => onSearchInput(e.currentTarget.value)}
      radius="md"
      w={260}
    />
    <SegmentedControl
      mt={25}
      data={OUTCOME_OPTIONS}
      value={outcome}
      onChange={(value) => onOutcomeChange(value as AuthAttemptOutcome)}
      radius="md"
    />
    {(searchInput || outcome !== 'all') && (
      <Button
        mt={25}
        variant="subtle"
        color="gray"
        radius="md"
        leftSection={<IconX size={16} />}
        onClick={onReset}
      >
        Сбросить
      </Button>
    )}
  </Group>
);
