// src/components/Navbar.tsx
import React from 'react';
import { Group, Menu, Avatar, Text, ActionIcon, Badge, Button } from '@mantine/core';
import { IconBell, IconSettings, IconLogout, IconUserCircle, IconChevronDown } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const unreadNotifications = 3; // 💡 TODO: Context/API-аас татаж авна

  // Хэрэв нэвтрээгүй бол Navbar-ийн зарим хэсгийг нууна
  if (!isAuthenticated) {
    return (
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 px-6 border-b border-gray-200">
        <div className="flex items-center justify-between h-full">
            <Link href="/home" passHref >
                <Text size='xl' fw={700} c='blue' className="text-xl font-bold transition hover:text-blue-800">
                    NUM | LECTURE | ROOM | ORDER
                </Text>
            </Link>
            <Group gap="md">
                <Link href="/auth/login" passHref legacyBehavior>
                    <Button variant="outline" size="sm">Нэвтрэх</Button>
                </Link>
                <Link href="/auth/register" passHref legacyBehavior>
                    <Button variant="filled" size="sm">Бүртгүүлэх</Button>
                </Link>
            </Group>
        </div>
      </header>
    );
  }


  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 px-6 border-b border-gray-200">
      <div className="flex items-center justify-between h-full">
        
        <Link href="/dashboard" passHref legacyBehavior>
          <a className="text-xl font-bold text-blue-600 transition hover:text-blue-800">
            NUM Room Booking
          </a>
        </Link>

        <Group gap="md">
          {/* Notification Icon */}
          <ActionIcon 
            component={Link} 
            href="/notifications" 
            variant="light" 
            size="lg" 
            radius="xl" 
            aria-label="Notifications" 
            className="relative"
          >
            <IconBell size={20} />
            {unreadNotifications > 0 && (
              <Badge color="red" size="xs" variant="filled" className="absolute top-1 right-1 pointer-events-none">
                {unreadNotifications}
              </Badge>
            )}
          </ActionIcon>

          {/* User Menu */}
          <Menu shadow="md" width={220} position="bottom-end">
            <Menu.Target>
              <Group gap="xs" className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition">
                <Avatar color="blue" radius="xl" src={null}>
                  {user?.username?.[0] || 'U'}
                </Avatar>
                <Text size="sm" fw={500} className="hidden sm:inline">
                    {user?.username || 'Хэрэглэгч'}
                </Text>
                <IconChevronDown size={16} className="text-gray-500" />
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <Text size="sm" fw={500}>{user?.username || 'Guest'}</Text>
                <Text size="xs" c="dimmed" truncate>{user?.email}</Text>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item component='a' href='/dashboard' leftSection={<IconUserCircle size={18} />}>Профайл</Menu.Item>
              <Menu.Item component='a' href='/settings' leftSection={<IconSettings size={18} />}>Тохиргоо</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red" leftSection={<IconLogout size={18} />} onClick={logout}>
                Гарах
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </header>
  );
};