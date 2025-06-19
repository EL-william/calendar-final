import { apiClient } from "./apiClient";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const authApi = {
  async register(data: RegisterRequest): Promise<{ userId: string }> {
    const response = await apiClient.post("/register", data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthTokens> {
    const response = await apiClient.post("/login", data);

    // Сохраняем access token в localStorage
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      // Логируем ошибку, но не блокируем logout
      console.error("Logout API error:", error);
    } finally {
      // Очищаем localStorage независимо от результата API
      localStorage.removeItem("accessToken");
    }
  },

  async refreshToken(): Promise<AuthTokens> {
    const response = await apiClient.post("/auth/refresh");

    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }

    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get("/user/profile");
    return response.data;
  },
};
