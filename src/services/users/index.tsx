// src/services/users/index.ts
import { AxiosResponse } from 'axios';
import { api } from '../../lib/axiosInstance';
import { RegisterPayload, AuthResponse, User, MeResponse,LoginPayload, UpdatePasswordPayload, UpdatePasswordResponse } from './type';
/**
 * Хэрэглэгчийг шинээр бүртгэх
 * Endpoint: POST /api/v1/users/register
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const response = await api.post('/users/register', payload);
    return response.data as AuthResponse;
  } catch (error: any) {
    // Алдааг гадагш дамжуулах
    throw new Error(error.response?.data?.error?.message || 'Бүртгүүлэх үед алдаа гарлаа.');
  }
}

/**
 * Нэвтэрсэн хэрэглэгчийн мэдээллийг татах
 * Endpoint: GET /api/v1/users/me
 */
export async function getMe(): Promise<User> {
  try {
    const response = await api.get('/users/me');
    // Backend хариу: { success: true, data: User } тул data-г буцаана.
    return response.data.data as User;
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Хэрэглэгчийн мэдээллийг татаж чадсангүй.');
  }
}

// TODO: login, updatePassword, гэх мэт service-үүдийг нэмнэ.
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await api.post('/users/login', payload);
    return response.data as AuthResponse;
  } catch (error: any) {
    // Backend-ээс ирэх алдааг (жишээлбэл: Буруу нууц үг) дамжуулах
    throw new Error(error.response?.data?.error?.message || 'Нэвтрэх үед алдаа гарлаа.');
  }
}

export const updatePassword = async (payload: UpdatePasswordPayload): Promise<UpdatePasswordResponse> => {
    // Axios response-д токен буцаж ирж байгаа тул response.data-г буцаана.
    const response: AxiosResponse<UpdatePasswordResponse> = await api.put('/users/updatepassword', payload);
    return response.data;
};