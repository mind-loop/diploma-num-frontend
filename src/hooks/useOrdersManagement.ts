// src/hooks/useOrdersManagement.ts
import { useState, useEffect, useCallback } from 'react';
import { getOrders, updateOrderStatus } from '@/services/orders';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Order, OrderStatus } from '@/services/orders/type';

export const useOrdersManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Захиалгуудыг татах
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getOrders();
            setOrders(response.data);
        } catch (e: any) {
            setError(e.message || 'Захиалгуудыг татаж чадсангүй.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // 2. Төлөвөөр ангилах
    const categorizedOrders = orders.reduce(
        (acc, order) => {
            if (order.status === 'pending') {
                acc.pending.push(order);
            } else if (order.status === 'approved') {
                acc.approved.push(order);
            } else {
                acc.final.push(order); // rejected & cancelled
            }
            return acc;
        },
        { pending: [] as Order[], approved: [] as Order[], final: [] as Order[] }
    );

    // 3. Төлөв солих функц
    const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
        notifications.show({
            id: `status-update-${orderId}`,
            loading: true,
            title: 'Төлөвийг шинэчилж байна...',
            message: `Захиалга №${orderId} шинэ төлөв рүү шилжиж байна: ${newStatus}`,
            autoClose: false,
            withCloseButton: false,
        });
        try {
            const updatedOrder = await updateOrderStatus(orderId, { status: newStatus });

            // State-ийг шинэчлэх (local update)
            setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));

            notifications.update({
                id: `status-update-${orderId}`,
                color: 'green',
                title: 'Төлөв амжилттай солигдлоо',
                message: `Захиалга №${orderId} ${newStatus} төлөвт шилжлээ.`,
                autoClose: 3000,
            });
        } catch (e: any) {
            notifications.update({
                id: `status-update-${orderId}`,
                color: 'red',
                title: 'Алдаа гарлаа',
                message: e.message || 'Төлөвийг шинэчилж чадсангүй.',
                autoClose: 5000,
            });
            // Алдаа гарвал бүх датаг дахин татаж, алдаатай төлөвийг арилгах
            fetchOrders(); 
        }
    };

    return {
        ...categorizedOrders,
        loading,
        error,
        fetchOrders,
        handleStatusUpdate,
    };
};