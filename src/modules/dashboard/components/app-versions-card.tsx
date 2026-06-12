import { Badge, Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconBrandAndroid, IconBrandApple } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { AppVersionRow } from '../types';

type Props = { data: AppVersionRow[] };

export const AppVersionsCard = ({ data }: Props) => (
  <Card withBorder radius="lg" padding="lg" h="100%">
    <Stack gap="md" h="100%">
      <Stack gap={2}>
        <Text fw={600} size="lg">
          Версии мобильного приложения
        </Text>
        <Text size="sm" c="dimmed">
          Последние релизы по платформам
        </Text>
      </Stack>
      <Stack gap="sm">
        {data.map((v) => {
          const isIos = v.platform === 'IOS';
          return (
            <Group
              key={v.platform}
              justify="space-between"
              p="sm"
              wrap="nowrap"
              style={{
                border: '1px solid var(--mantine-color-default-border)',
                borderRadius: 'var(--mantine-radius-md)',
              }}
            >
              <Group gap={12} wrap="nowrap">
                <ThemeIcon
                  variant="light"
                  color={isIos ? 'gray' : 'green'}
                  size={40}
                  radius="md"
                >
                  {isIos ? (
                    <IconBrandApple size={22} />
                  ) : (
                    <IconBrandAndroid size={22} />
                  )}
                </ThemeIcon>
                <Stack gap={0}>
                  <Text fw={600}>
                    {isIos ? 'iOS' : 'Android'} · v{v.latestVersion}
                  </Text>
                  <Text size="xs" c="dimmed">
                    мин v{v.minSupportedVersion} ·{' '}
                    {dayjs(v.releasedAt).format('D MMM YYYY')}
                  </Text>
                </Stack>
              </Group>
              {v.forceUpdate ? (
                <Badge color="red" variant="light">
                  Обязательное
                </Badge>
              ) : (
                <Badge color="teal" variant="light">
                  Опциональное
                </Badge>
              )}
            </Group>
          );
        })}
      </Stack>
    </Stack>
  </Card>
);
