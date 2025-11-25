// src/components/DashboardStats.tsx
import React from 'react';
import { Card, Group, Text, ThemeIcon, SimpleGrid } from '@mantine/core';
import { IconCalendarCheck, IconClockHour3, IconX, IconBuilding } from '@tabler/icons-react';
import { UserRole } from '../services/users/type';

interface DashboardStatsProps {
  userRole: UserRole;
}

// 💡 Түр зуурын (Dummy) статистик мэдээлэл
const getStatsData = (role: UserRole) => {
  if (role === 'ADMIN' || role === 'MANAGER') {
    return [
      { 
        title: "Шинэ Захиалга", 
        value: "4", 
        description: "Баталгаажуулалт хүлээж байна", 
        icon: IconClockHour3, 
        color: "yellow" 
      },
      { 
        title: "Нийт Өрөө", 
        value: "15", 
        description: "Боломжтой: 12", 
        icon: IconBuilding, 
        color: "blue" 
      },
      { 
        title: "Цуцлагдсан Захиалга", 
        value: "2", 
        description: "Сүүлийн 7 хоногт", 
        icon: IconX, 
        color: "red" 
      },
    ];
  } else { // CUSTOMER
    return [
      { 
        title: "Баталгаажсан", 
        value: "3", 
        description: "Ойрын 30 хоногт", 
        icon: IconCalendarCheck, 
        color: "green" 
      },
      { 
        title: "Хүлээгдэж буй", 
        value: "1", 
        description: "Баталгаажуулалт хүлээж байна", 
        icon: IconClockHour3, 
        color: "yellow" 
      },
      { 
        title: "Нийт Захиалга", 
        value: "8", 
        description: "Бүх цаг үеийн", 
        icon: IconBuilding, 
        color: "blue" 
      },
    ];
  }
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ userRole }) => {
  const data = getStatsData(userRole);

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" className="mb-8">
      {data.map((stat, index) => (
        <Card key={index} shadow="sm" padding="lg" radius="md" withBorder className="bg-white transition hover:shadow-lg">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="sm" c="dimmed" fw={500} tt="uppercase">
                {stat.title}
              </Text>
              <Text size="xl" fw={700} className="text-gray-900 mt-1">
                {stat.value}
              </Text>
            </div>
            <ThemeIcon color={stat.color} size="xl" radius="md" variant="light">
              <stat.icon size={28} />
            </ThemeIcon>
          </Group>
          <Text size="xs" c="dimmed" mt="xs">
            {stat.description}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default DashboardStats;