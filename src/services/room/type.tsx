export interface RoomItem {
  itemName: string;
  quantity: number;
}
export interface RoomImage {
    id: number;
    room_id: number;
    image_url: string;
    created_at: string;
}
export interface AddImagePayload {
    room_id: number;
    image_url: string;
}
export interface CreateRoomPayload {
  id?:number,
    room_number: number;
    location: string;
    capacity: number;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
    category: string;
}
export interface ObjectBody<T> {
  success: boolean;
  data: T
}

export interface Room {
  id: number;
  room_number: number;
  location: string;
  capacity: number;
  description: string;
    status: 'ACTIVE' | 'INACTIVE';
  category: string;
  items: RoomItem[];
  images: RoomImage[];
}
export interface RoomImage {
    id: number;
    url: string;
    roomId: number;
}
export type UpdateRoomPayload = Partial<CreateRoomPayload>;
// Room list-ийг хайх үеийн Query-н төрөл
export interface RoomQuery {
    keyword?: string;
    startDate?: string; // ISO Date String
    endDate?: string;
    capacity?: number;
}