import { api } from '@/lib/axiosInstance';
import { NotificationsResponse } from './type';

/**
 * Хэрэглэгчийн мэдэгдлүүдийн жагсаалтыг татаж авах service.
 * @returns NotificationsResponse (Жагсаалт, уншаагүй тоо)
 */
export const getMyNotifications = async (): Promise<NotificationsResponse> => {
    // Таны контроллер: exports.getMyNotifications
    const response = await api.get<NotificationsResponse>('/notifications'); 
    return response.data;
};

/**
 * Бүх мэдэгдлийн төлөвийг "seen" (уншсан) болгох service.
 * Таны API-д /notifications/mark-all-as-seen гэсэн PUT/PATCH endpoint байх шаардлагатай.
 */
export const markAllNotificationsAsSeen = async (): Promise<{ success: boolean }> => {
    // API-ийн endpoint-ийг таамаглав
    const response = await api.patch('/notifications/mark-all-as-seen'); 
    return response.data;
};

export const markNotificationAsSeen = async (id: number): Promise<{ success: boolean, data: Notification }> => {
    // Таны өгсөн endpoint загварыг ашиглав
    const response = await api.put(`/notifications/${id}/seen`);
    return response.data;
};