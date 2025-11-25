import { RoomImage } from "../room/type";
export type OrderStatus =  'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
// 💡 API-аас ирэх захиалгын мэдээллийн interface
export interface RoomDetailsInOrder {
   room_number: number;
    location: string;
    capacity: number;
    images: { id: number; room_id: number; image_url: string }[];
}
export interface Order {
  id: number;
  status: OrderStatus
  start_time: string; // ISO 8601
  end_time: string;   // ISO 8601
  orderDate: string;  // ISO 8601
  purpose: string;
  room_id: number;
  user_id: number;
  room: RoomDetailsInOrder;
}
// 💡 Захиалга үүсгэх Payload
export interface CreateOrderPayload {
  room_id: number;
  start_time: string;
  end_time: string;
  purpose: string;
}
export interface OrdersResponse {
    success: boolean;
    count: number;
    data: Order[];
}
export interface UpdateStatusPayload {
    status: OrderStatus; 
}