export interface User {
    id?: string;
    email: string;
    password?: string;
    passwordHash?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: 'admin' | 'client' | 'hotel_admin';
}

export interface LoginResponse {
    accessToken: string;
}

export interface AuthError {
    message: string;
    error: string;
    statusCode: number;
}