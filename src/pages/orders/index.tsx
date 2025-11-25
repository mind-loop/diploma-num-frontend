// src/pages/orders.tsx
import React, { useState } from 'react';
import { NextPage } from 'next';
import { Container, Title, Tabs, Stack, Grid, Center, Loader, Alert, ScrollArea } from '@mantine/core';
import { IconClock, IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';
import { MainLayout } from '@/Layouts/MainLayout';
import { useOrdersManagement } from '@/hooks/useOrdersManagement';
import OrderAdminCard from '@/components/OrderAdminCard';
import { Order } from '@/services/orders/type';

const OrdersPage: NextPage = () => {
    const { 
        pending, 
        approved, 
        final, 
        loading, 
        error, 
        handleStatusUpdate 
    } = useOrdersManagement();

    const renderOrderList = (orders: Order[], status: 'pending' | 'approved' | 'final') => {
        if (orders.length === 0) {
            return (
                <Alert color="blue" variant="light" title="Захиалга байхгүй">
                    {status === 'pending' ? 'Хүлээгдэж буй захиалга байхгүй.' : 
                     status === 'approved' ? 'Баталгаажсан захиалга байхгүй.' : 
                     'Татгалзсан/Цуцалсан захиалга байхгүй.'}
                </Alert>
            );
        }

        return (
            // ScrollArea нь Tab-ийн доторх агуулгыг хянахад тустай
            <ScrollArea h={700} offsetScrollbars scrollbarSize={8}>
                <Grid gutter="lg">
                    {orders.map((order) => (
                        <Grid.Col key={order.id} span={{ base: 12, sm: 6, lg: 4 }}>
                            <OrderAdminCard 
                                order={order} 
                                onStatusChange={handleStatusUpdate} 
                            />
                        </Grid.Col>
                    ))}
                </Grid>
            </ScrollArea>
        );
    };

    return (
        <MainLayout>
            <Container size="xl" className="py-8">
                <Title order={1} className="text-3xl font-bold text-indigo-700 mb-6">
                    Захиалгын Удирдлага (Админ)
                </Title>

                {loading && (
                    <Center h={400}><Loader size="lg" /></Center>
                )}

                {error && !loading && (
                    <Alert icon={<IconAlertCircle size={24} />} title="Алдаа гарлаа" color="red">
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <Tabs defaultValue="pending">
                        <Tabs.List>
                            <Tabs.Tab value="pending" leftSection={<IconClock size={20} />} color="yellow">
                                Хүлээгдэж буй ({pending.length})
                            </Tabs.Tab>
                            <Tabs.Tab value="approved" leftSection={<IconCheck size={20} />} color="teal">
                                Баталгаажсан ({approved.length})
                            </Tabs.Tab>
                            <Tabs.Tab value="final" leftSection={<IconX size={20} />} color="gray">
                                Төгссөн/Цуцалсан ({final.length})
                            </Tabs.Tab>
                        </Tabs.List>

                        <Stack gap="xl" mt="lg">
                            <Tabs.Panel value="pending">
                                {renderOrderList(pending, 'pending')}
                            </Tabs.Panel>
                            
                            <Tabs.Panel value="approved">
                                {renderOrderList(approved, 'approved')}
                            </Tabs.Panel>
                            
                            <Tabs.Panel value="final">
                                {renderOrderList(final, 'final')}
                            </Tabs.Panel>
                        </Stack>
                    </Tabs>
                )}
            </Container>
        </MainLayout>
    );
};

export default OrdersPage;