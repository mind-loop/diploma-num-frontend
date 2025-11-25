// src/services/orders/index.ts
import axios from '@/services/axios'; // Axios instance-ийг зөв импорт хийнэ
import { notifications } from '@mantine/notifications';
import { CreateOrderPayload, Order, OrdersResponse, UpdateStatusPayload } from './type';
import { api } from '@/lib/axiosInstance';


/**
 * Хэрэглэгчийн захиалгуудыг татах service
 * Endpoint: GET /api/v1/orders/my (эсвэл /api/v1/orders?userId=X)
 */
export async function getMyOrders(): Promise<Order[]> {
  try {
    const response = await axios.get('/orders/my'); // Таамагласан endpoint
    // API хариу: { success: true, count: N, data: [Order, ...] }
    return response.data.data; 
  } catch (error: any) {
    const errorMsg = error.response?.data?.error?.message || 'Захиалгын жагсаалтыг татахад алдаа гарлаа.';
    notifications.show({ title: 'Алдаа', message: errorMsg, color: 'red' });
    throw new Error(errorMsg);
  }
}

/**
 * Захиалга үүсгэх service
 * Endpoint: POST /api/v1/orders
 */
export async function createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; message: string; data: Order }> {
  try {
    const response = await axios.post('/orders', payload);
    return response.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.error?.message || 'Захиалга үүсгэх үед алдаа гарлаа.';
    notifications.show({ title: 'Алдаа', message: errorMsg, color: 'red' });
    throw new Error(errorMsg);
  }
}

// 💡 Захиалгыг цуцлах service (Admin/Customer)
export async function cancelOrder(orderId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.patch(`/orders/${orderId}/cancel`); // Таамагласан endpoint
    return response.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.error?.message || 'Захиалгыг цуцлахад алдаа гарлаа.';
    notifications.show({ title: 'Алдаа', message: errorMsg, color: 'red' });
    throw new Error(errorMsg);
  }
}

// 💡 Захиалгыг баталгаажуулах service (Зөвхөн Admin/Manager)
export async function approveOrder(orderId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.patch(`/orders/${orderId}/approve`); // Таамагласан endpoint
    return response.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.error?.message || 'Захиалгыг баталгаажуулахад алдаа гарлаа.';
    notifications.show({ title: 'Алдаа', message: errorMsg, color: 'red' });
    throw new Error(errorMsg);
  }
}

export const getOrders = async (): Promise<OrdersResponse> => {
    // 💡 Түр зуурын API дуудлага (Шүүлтүүр нэмж болно)
    const response = await api.get<OrdersResponse>(`/orders`);
    return response.data;
};

/**
 * Захиалгын төлөвийг өөрчлөх
 */
export const updateOrderStatus = async (orderId: number, payload: UpdateStatusPayload): Promise<Order> => {
    // PUT {{local}}/orders/:id/status
    const response = await api.put<Order>(`/orders/${orderId}/status`, payload);
    return response.data;
};