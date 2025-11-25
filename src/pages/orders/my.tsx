// src/pages/orders/my.tsx

import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { Title, Text, Container, Loader, Center, Alert, Grid, Button, Stack, Group } from '@mantine/core';
import { IconAlertCircle, IconClock, IconListDetails, IconRefresh } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import { MainLayout } from '@/Layouts/MainLayout';
import { OrderCard } from '@/components/OrderCard'; 
import { getMyOrders, cancelOrder } from '@/services/orders'; 
import { Order } from '@/services/orders/type';
import dayjs from 'dayjs';

const MyOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedOrders = await getMyOrders();
            setOrders(fetchedOrders);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleCancelOrder = async (orderId: number) => {
        if (!confirm('Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?')) {
            return;
        }

        setCancellingId(orderId);
        try {
            await cancelOrder(orderId);
            notifications.show({
                title: 'Амжилттай цуцлагдлаа',
                message: `Захиалга #${orderId} амжилттай цуцлагдлаа.`,
                color: 'green',
            });
            fetchOrders(); 
        } catch (err: any) {
            notifications.show({
                title: 'Алдаа',
                message: err.message,
                color: 'red',
            });
        } finally {
            setCancellingId(null);
        }
    };


    if (loading) {
        return (
            <MainLayout>
                <Center className="min-h-[60vh]"><Loader size="lg" /></Center> {/* 💡 min-height-ийг томсгосон */}
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head>
                <title>Миний Захиалгууд | Өрөө Захиалгын Систем</title>
            </Head>
            
            {/* 💡 CONTAINER: padding-ийг илүү өгч, доторх зайг томсгосон */}
            <Container size="xl" className="py-12 md:py-16">
                
                {/* 1. Хуудасны Толгой (Tailwind-ээр Тодотгосон) */}
                <Group justify="space-between" align="flex-end" className="mb-10 border-b border-blue-100 pb-4">
                    <Stack gap={5}>
                        <Title order={1} className="text-4xl font-black text-gray-800 flex items-center gap-3"> {/* 💡 font-extrabold-ийг font-black болгосон, gap-ийг нэмсэн */}
                            <IconListDetails size={38} className="text-blue-600" /> {/* 💡 Icon-ийн өнгийг тодотгосон */}
                            Миний Захиалгууд
                        </Title>
                        <Text className="text-lg text-gray-500"> {/* 💡 c="dimmed"-ийг Tailwind-ийн class-аар сольсон */}
                            Таны өрөө захиалгын түүх болон одоогийн захиалгуудын төлөв.
                        </Text>
                    </Stack>
                    
                    {/* Шинэчлэх Товч */}
                    <Group gap="sm" className="hidden sm:flex items-center text-sm text-gray-500">
                        <IconClock size={20} />
                        <Text>Сүүлд шинэчилсэн: {dayjs().format('HH:mm:ss')}</Text>
                        <Button 
                            variant="subtle" 
                            color="blue"
                            size="sm" 
                            onClick={fetchOrders} 
                            leftSection={<IconRefresh size={18} />}
                            loading={loading}
                            className="ml-3"
                        >
                            Шинэчлэх
                        </Button>
                    </Group>
                </Group>

                {/* 2. Alert & Empty State */}
                {error && (
                    <Alert 
                        icon={<IconAlertCircle size={20} />} 
                        title="Уучлаарай, алдаа гарлаа" 
                        color="red"
                        className="mb-8 border-l-4 border-red-500" 
                    >
                        {error}
                        <Button 
                            onClick={fetchOrders} 
                            variant="light" 
                            color="red" 
                            mt="md" 
                            leftSection={<IconRefresh size={18} />}
                        >
                            Дахин ачаалах
                        </Button>
                    </Alert>
                )}
                
                {!loading && orders.length === 0 && !error && (
                    <Alert 
                        title="🤔 Захиалга олдсонгүй" 
                        color="orange"
                        className="mb-8 border-l-4 border-orange-500"
                    >
                        Та одоогоор идэвхтэй болон дууссан захиалга хийгээгүй байна.
                    </Alert>
                )}

                {/* 3. Захиалгын Жагсаалт (Mantine Grid + Tailwind Breakpoints) */}
                <Grid gutter="xl"> {/* 💡 Grid-ийн хоорондын зайг 'xl' болгож томсгосон */}
                    {orders.map((order) => (
                        <Grid.Col 
                            key={order.id} 
                            // sm: 6 (2 багана), lg: 4 (3 багана)
                            span={{ base: 12, sm: 6, lg: 4 }} 
                        > 
                            {/* 💡 OrderCard доторх Tailwind хэлбэржүүлэлтийг OrderCard-ийн файлд хийнэ. */}
                            <OrderCard 
                                order={order} 
                                onCancel={handleCancelOrder} 
                            />
                        </Grid.Col>
                    ))}
                </Grid>

            </Container>
        </MainLayout>
    );
};

export default MyOrdersPage;