// src/services/rooms/index.ts
// ... импортууд

import { api } from "@/lib/axiosInstance";
import axios from "../axios";
import { AddImagePayload, CreateRoomPayload, ObjectBody, Room, RoomImage, UpdateRoomPayload } from "./type";


export const getRooms = async (): Promise<Room[]> => {
  const res = await axios.get("/rooms");
  return res.data.data; // backend-ийн format-д тохируул
};

export const createRoom = async (payload: CreateRoomPayload): Promise<Room> => {
    const response = await api.post<Room>('/rooms', payload);
    
    return response.data; 
};
export const deleteRoom = async (roomId: number): Promise<void> => {
    await api.delete(`/rooms/${roomId}`); 
};
export const getRoomById = async (roomId: number): Promise<Room> => {
    const response = await api.get<ObjectBody<Room>>(`/rooms/${roomId}`);
    return response.data.data;
};

export const updateRoom = async (roomId: number, payload: UpdateRoomPayload): Promise<Room> => {
    const response = await api.put<Room>(`/rooms/${roomId}`, payload);
    return response.data;
};
export const addRoomImage = async (payload: AddImagePayload): Promise<RoomImage> => {
    // Endpoint: {{local}}/roomImages
    const response = await api.post<RoomImage>(`/roomImages`, payload);
    return response.data;
};

export const deleteRoomImage = async (imageId: number): Promise<{ success: boolean }> => {
    // Endpoint: {{local}}/roomImages/:id
    const response = await api.delete<{ success: boolean }>(`/roomImages/${imageId}`);
    return response.data;
};