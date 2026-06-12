import type { ReactNode } from 'react';
import {
  ActionIcon,
  AppShell,
  Avatar,
  Badge,
  Box,
  Burger,
  Group,
  Menu,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconActivityHeartbeat,
  IconBell,
  IconCalendarStats,
  IconCash,
  IconChevronDown,
  IconDeviceMobile,
  IconLayoutDashboard,
  IconLogout,
  IconMoonStars,
  IconSearch,
  IconSettings,
  IconStethoscope,
  IconSun,
  IconUserHeart,
  IconUsers,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/lib';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

type NavItem = {
  label: string;
  icon: typeof IconLayoutDashboard;
  active?: boolean;
  badge?: string;
};

const navItems: NavItem[] = [
  { label: 'Обзор', icon: IconLayoutDashboard, active: true },
  { label: 'Пациенты', icon: IconUserHeart },
  { label: 'Врачи', icon: IconStethoscope },
  { label: 'Приёмы', icon: IconCalendarStats, badge: '247' },
  { label: 'Страховые возмещения', icon: IconCash },
  { label: 'Уведомления', icon: IconBell, badge: '12' },
  { label: 'Версии приложения', icon: IconDeviceMobile },
  { label: 'Пользователи', icon: IconUsers },
];

export const DashboardShell = ({ title, subtitle, children }: Props) => {
  const [opened, { toggle }] = useDisclosure();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/sign-in');
  };

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="lg"
    >
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Group gap="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group gap={10}>
              <Box
                style={{
                  background:
                    'linear-gradient(135deg, var(--mantine-color-violet-6), var(--mantine-color-cyan-5))',
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'white',
                }}
              >
                <IconActivityHeartbeat size={20} />
              </Box>
              <Stack gap={0}>
                <Text fw={700} size="md" lh={1}>
                  Archimedes
                </Text>
              </Stack>
            </Group>
          </Group>
          <Group gap="sm">
            <TextInput
              placeholder="Поиск пациентов, врачей…"
              leftSection={<IconSearch size={16} />}
              w={280}
              visibleFrom="md"
              radius="md"
            />
            <Tooltip label="Сменить тему">
              <ActionIcon
                variant="default"
                size="lg"
                radius="md"
                onClick={() => toggleColorScheme()}
                aria-label="Сменить тему"
              >
                {colorScheme === 'dark' ? (
                  <IconSun size={18} />
                ) : (
                  <IconMoonStars size={18} />
                )}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Уведомления">
              <ActionIcon
                variant="default"
                size="lg"
                radius="md"
                aria-label="Уведомления"
              >
                <IconBell size={18} />
              </ActionIcon>
            </Tooltip>
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <Group gap={8} style={{ cursor: 'pointer' }}>
                  <Avatar color="violet" radius="xl" size={34}>
                    AD
                  </Avatar>
                  <Stack gap={0} visibleFrom="sm">
                    <Text size="sm" fw={600} lh={1}>
                      Админ
                    </Text>
                    <Text size="xs" c="dimmed">
                      admin@archimedes.kz
                    </Text>
                  </Stack>
                  <IconChevronDown size={14} />
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Настройки
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                >
                  Выйти
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap={4}>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                active={item.active}
                label={item.label}
                leftSection={<item.icon size={18} stroke={1.6} />}
                rightSection={
                  item.badge ? (
                    <Badge size="sm" variant="light" color="violet">
                      {item.badge}
                    </Badge>
                  ) : null
                }
                color="violet"
                variant="filled"
                style={{ borderRadius: 8 }}
              />
            ))}
          </Stack>
        </AppShell.Section>
        <AppShell.Section>
          <Box
            p="sm"
            style={{
              border: '1px solid var(--mantine-color-default-border)',
              borderRadius: 'var(--mantine-radius-md)',
            }}
          >
            <Group gap={8} mb={6}>
              <Box
                w={8}
                h={8}
                style={{
                  background: 'var(--mantine-color-teal-5)',
                  borderRadius: '50%',
                }}
              />
              <Text size="xs" fw={600}>
                Все системы в норме
              </Text>
            </Group>
            <Text size="xs" c="dimmed">
              API · OneSignal · синхронизация МИС
            </Text>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={2} fw={700}>
              {title}
            </Title>
            {subtitle && (
              <Text c="dimmed" size="sm">
                {subtitle}
              </Text>
            )}
          </Stack>
          {children}
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};
