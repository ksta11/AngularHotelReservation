export interface User {
    id?: number;
    email: string;
    password?: string;
    name?: string;
    role?: 'admin' | 'client';
}

export interface LoginResponse {
    token: string;
    user: User;
} 