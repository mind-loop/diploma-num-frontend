// src/services/users/type.ts

/**
 * Хэрэглэгчийн үндсэн мэдээлэл (JWT болон /users/me-ээс ирэх)
 */
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER';

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  companyName?: string;
  regDate: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    phone: string;
    companyName?: string; // Заавал биш
}

export interface LoginPayload {
    email: string;
    password: string;
}
export interface AuthResponse {
    success: true;
    token: string;
}


export interface MeResponse {
    success: true;
    data: User;
}

export interface UpdatePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface UpdatePasswordResponse {
    success: boolean;
    token: string;
}