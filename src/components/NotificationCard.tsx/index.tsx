import { Notification } from '@/services/notification/type';
// 💡 markNotificationAsSeen service-ийг импортлох шаардлагатай
// Таны service file-ийн байршлыг таамаглав:
import { markNotificationAsSeen } from '@/services/notification/index'; 

import { Badge, Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconCalendar, IconCheck, IconInfoCircle, IconMailOpened, IconWorld, IconX } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { mn } from 'date-fns/locale';
import React from 'react';

// 💡 Шинэ Prop: Уншсан болгох үйлдэл (Context эсвэл Parent Component-оос ирнэ)
interface NotificationCardProps {
    notification: Notification;
    // 💡 Энэ функц нь notification-ийг шинэчилсний дараа жагсаалтыг дахин ачаалах үүрэгтэй.
    onMarkAsSeen?: (notificationId: number) => void; 
}

// ... getIconAndColor, getTitle функцууд хэвээр үлдэнэ ...

const getIconAndColor = (type: Notification['type']) => {
    // ...
    switch (type) {
        case 'approval':
            return { icon: IconCheck, color: 'teal' };
        case 'rejection':
            return { icon: IconX, color: 'red' };
        case 'reservation':
            return { icon: IconCalendar, color: 'indigo' };
        case 'cancellation':
            return { icon: IconAlertTriangle, color: 'orange' };
        case 'global_announcement':
            return { icon: IconWorld, color: 'blue' };
        default:
            return { icon: IconInfoCircle, color: 'gray' };
    }
};

const getTitle = (type: Notification['type']): string => {
    // ...
    switch (type) {
        case 'approval': return 'Захиалга Батлагдсан';
        case 'rejection': return 'Захиалга Цуцлагдсан';
        case 'reservation': return 'Шинэ Захиалга';
        case 'cancellation': return 'Цуцлалт';
        case 'global_announcement': return 'Нийтээр Зарлах Мэдэгдэл';
        default: return 'Мэдэгдэл';
    }
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMarkAsSeen }) => {
    const { icon: IconComponent, color } = getIconAndColor(notification.type);
    const isUnseen = notification.status === 'unseen';

    // 💡 Card-ыг дарах үед ажиллах логик
    const handleCardClick = async () => {
        // Зөвхөн уншаагүй байгаа мэдэгдлийг л seen болгоно.
        if (isUnseen) {
            try {
                // 1. API-г дуудаж, төлөвийг seen болгоно
                await markNotificationAsSeen(notification.id);
                
                // 2. Эцэг компонентод мэдэгдэж, жагсаалтыг шинэчлүүлэх
                onMarkAsSeen && onMarkAsSeen(notification.id);

                // 💡 Mantine notifications ашиглан feedback өгч болно.
                // notifications.show({ message: 'Мэдэгдлийг уншсан болголоо' });

            } catch (error) {
                console.error("Мэдэгдлийг уншсан болгох үед алдаа гарлаа:", error);
                // notifications.show({ title: 'Алдаа', color: 'red', message: 'Түр зуурын алдаа гарлаа.' });
            }
        }
    };

    return (
        <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            withBorder
            // 💡 onClick эвэнтийг Card дээр нэмсэн
            onClick={handleCardClick}
            // 💡 Unseen үед Pointer-ийн курсор харуулах
            className={`transition-shadow duration-200 cursor-pointer ${isUnseen ? 'bg-white border-l-4 border-l-yellow-500 shadow-md hover:shadow-lg' : 'bg-gray-50 border-gray-200'}`}
        >
            <Group wrap="nowrap" align="flex-start">
                <ThemeIcon size="lg" radius="xl" color={color} variant={isUnseen ? "light" : "outline"}>
                    <IconComponent size={20} />
                </ThemeIcon>
                
                <Stack gap={4} className="flex-grow">
                    <Group justify="space-between" wrap="nowrap">
                        <Text fw={isUnseen ? 700 : 500} size="md" className="text-gray-900">
                            {getTitle(notification.type)}
                        </Text>
                        
                        {/* Төлөв болон Төрөл */}
                        <Group gap="xs" wrap="nowrap">
                            {notification.is_global && (
                                <Badge variant="outline" color="blue" size="sm" leftSection={<IconWorld size={12} />}>
                                    Глобал
                                </Badge>
                            )}
                            {isUnseen && (
                                <Badge color="yellow" size="sm" leftSection={<IconMailOpened size={12} />}>
                                    Уншаагүй
                                </Badge>
                            )}
                        </Group>
                    </Group>
                    
                    {/* Мэдэгдлийн мессеж */}
                    <Text size="sm" fw={isUnseen ? 600 : 400} className="text-gray-700 leading-normal">
                        {notification.message}
                    </Text>

                    {/* Цагийн мэдээлэл */}
                    <Text size="xs" c="dimmed" mt={5}>
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: mn })}
                    </Text>
                </Stack>
            </Group>
        </Card>
    );
};