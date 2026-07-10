import api from "@/lib/api/axios";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  User,
} from "@/types/auth";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/api/auth/login", payload);
  return res.data;
};

export const register = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/api/auth/register", payload);
  return res.data;
};

export const getProfile = async (): Promise<User> => {
  const res = await api.get<{ data: User }>("/api/auth/profile");
  return res.data.data;
};

export const updateProfile = async (
  payload: Partial<Pick<User, "name" | "phone">>
): Promise<User> => {
  const res = await api.put<{ data: User }>("/api/auth/profile", payload);
  return res.data.data;
};
