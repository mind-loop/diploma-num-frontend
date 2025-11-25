import React, { useState } from 'react';
import { Card, Image, Text, Group, Badge, Button, Stack, Title, Tooltip, ActionIcon } from '@mantine/core';
import { IconUsers, IconMapPin, IconCalendarPlus, IconTrash, IconPencil } from '@tabler/icons-react';
import { Room } from '@/services/room/type';
import { useRouter } from 'next/router';

interface RoomCardProps {
    room: Room;
    onBookClick?: (roomId: number) => void;
    onDeleteClick?: (roomId: number) => Promise<void>; // Устгах функц
    isAdmin: boolean;
}

const getStatusColor = (status: Room['status']) => {
    return status === 'ACTIVE' ? 'teal' : 'red';
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onBookClick, onDeleteClick, isAdmin }) => {
    const router = useRouter();
    // 💡 Устгах төлөвийг Card дотор удирдаж байна.
    const [isDeleting, setIsDeleting] = useState(false); 

    const handleLocalDelete = async () => {
        setIsDeleting(true);
        try {
           onDeleteClick &&  await onDeleteClick(room.id);
        } catch (e) {
            // onDeleteClick дотор notification гардаг тул энд юу ч хийхгүй байж болно.
        } finally {
            setIsDeleting(false); 
        }
    }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full flex flex-col justify-between">
            <Card.Section>
                <Image
                    src={room.images?.[0]?.image_url || 'https://via.placeholder.com/600x300?text=No+Image'}
                    alt={`Өрөө №${room.room_number}`}
                    height={120}
                    fallbackSrc="https://via.placeholder.com/600x300"
                    fit="cover"
                />
            </Card.Section>

            <Stack gap="xs" mt="md" className="flex-grow">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Title order={3} className="text-xl font-bold">Өрөө №{room.room_number}</Title>
                    <Badge color={getStatusColor(room.status)} variant="light" size="lg" className="whitespace-nowrap">
                        {room.status === 'ACTIVE' ? 'Нээлттэй' : 'Идэвхгүй'}
                    </Badge>
                </Group>
                
                <Group gap="xs" className="text-sm text-gray-600">
                    <IconMapPin size={16} className='text-indigo-600' />
                    <Text>{room.location}</Text>
                </Group>
                
                <Group gap="xs" className="text-sm text-gray-600">
                    <IconUsers size={16} className='text-indigo-600' />
                    <Text>{room.capacity} хүн</Text>
                </Group>

                <Badge color="blue" variant="outline" size="sm" className="w-fit">
                    {room.category}
                </Badge>
                
                <Text size="sm" c="dimmed" lineClamp={2} mt="xs">
                    {room.description}
                </Text>
            </Stack>

            {/* Үйлдэл хийх товчууд */}
            <Group justify="space-between" mt="md" wrap="nowrap">
                <Button 
                    onClick={() => onBookClick && onBookClick(room.id)}
                    variant="filled" 
                    color="indigo" 
                    leftSection={<IconCalendarPlus size={18} />}
                    disabled={room.status !== 'ACTIVE' || isDeleting}
                    // 💡 isAdmin биш бол бүх өргөнөөр (grow)
                    className={!isAdmin ? 'w-full' : 'flex-grow'} 
                >
                    Захиалах
                </Button>
                
                {isAdmin && (
                    <Group gap="xs" wrap="nowrap" ml="sm">
                        <Tooltip label="Засварлах" withArrow>
                            <ActionIcon
                                variant="light"
                                color="blue"
                                size="lg" // 💡 Хэмжээг томруулсан (sm-ээс lg болгосон)
                                onClick={() => router.push(`/rooms/edit/${room.id}`)}
                            >
                                <IconPencil size={20} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Устгах" withArrow>
                            <ActionIcon
                                variant="light"
                                color="red"
                                size="lg" // 💡 Хэмжээг томруулсан (sm-ээс lg болгосон)
                                onClick={handleLocalDelete}
                                loading={isDeleting}
                                disabled={isDeleting}
                            >
                                <IconTrash size={20} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                )}
            </Group>
        </Card>
    );
};