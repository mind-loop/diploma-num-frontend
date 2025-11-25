// src/components/OrderCard.tsx
import React from 'react';
import { Card, Text, Group, Badge, Stack, Image, Title, Button } from '@mantine/core';
import { IconMapPin, IconCalendarEvent, IconCheck, IconX } from '@tabler/icons-react';
import { Order, OrderStatus } from '@/services/orders/type';
import moment from 'moment';

interface OrderCardProps {
    order: Order;
    // 💡 Энэ функцээр төлөв солино
    onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
}

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case 'pending': return 'yellow';
        case 'approved': return 'teal';
        case 'rejected': return 'red';
        case 'cancelled': return 'gray';
        default: return 'gray';
    }
};

export const OrderAdminCard: React.FC<OrderCardProps> = ({ order, onStatusChange }) => {
    const isActionable = order.status === 'pending'; // Зөвхөн pending үед л үйлдэл хийнэ

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start" mb="md">
                <Title order={4} className="text-lg font-semibold">Захиалга №{order.id}</Title>
                <Badge color={getStatusColor(order.status)} variant="filled">
                    {order.status ? order.status.toUpperCase() : 'N/A'}
                </Badge>
            </Group>

            <Group wrap="nowrap" align="stretch" className="mb-3">
                <Image
                    src={order.room.images?.[0]?.image_url || 'https://via.placeholder.com/100?text=Room'}
                    h={100}
                    w={100}
                    fit="cover"
                    radius="md"
                    alt={`Өрөө ${order.room.room_number}`}
                    fallbackSrc="https://via.placeholder.com/100"
                />
                <Stack gap={4} className="flex-grow">
                    <Text fw={600}>Өрөө №{order.room.room_number}</Text>
                    <Group gap="xs" className="text-sm text-gray-600">
                        <IconMapPin size={14} className='text-blue-500' />
                        <Text>{order.room.location}</Text>
                    </Group>
                    <Group gap="xs" className="text-sm text-gray-600">
                        <IconCalendarEvent size={14} className='text-blue-500' />
                        {/* 💡 Датаг форматлахын тулд momentJS эсвэл dayjs-ийг импорт хийх */}
                        <Text>{moment(order.start_time).format('YYYY/MM/DD HH:mm')} - {moment(order.end_time).format('YYYY/MM/DD HH:mm')}</Text>
                    </Group>
                </Stack>
            </Group>
            
            <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                **Зорилго:** {order.purpose}
            </Text>
            
            {/* Админы үйлдэл */}
            {isActionable && (
                <Group grow mt="sm">
                    <Button
                        leftSection={<IconCheck size={16} />}
                        color="teal"
                        onClick={() => onStatusChange(order.id, 'approved')}
                    >
                        Зөвшөөрөх
                    </Button>
                    <Button
                        leftSection={<IconX size={16} />}
                        color="red"
                        variant="light"
                        onClick={() => onStatusChange(order.id, 'rejected')}
                    >
                        Татгалзах
                    </Button>
                </Group>
            )}
        </Card>
    );
};
export default OrderAdminCard;