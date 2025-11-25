// src/services/notification/type.ts

export type NotificationType = 'reservation' | 'approval' | 'rejection' | 'cancellation' | 'global_announcement';
export type NotificationStatus = 'seen' | 'unseen';

export interface Notification {
    id: number;
    type: NotificationType;
    message: string;
    status: NotificationStatus;
    is_global: boolean; // Глобал эсвэл хувийн мэдэгдэл
    user_id: number | null;
    created_at: string; // ISO Date String
}

export interface NotificationsResponse {
    success: boolean;
    unseenCount: number;
    count: number;
    data: Notification[];
}