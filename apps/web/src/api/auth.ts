import { axiosInstance } from "../lib/axios";

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  email: string;
  username: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await axiosInstance.post("/auth/login", payload);
  return data as { access_token: string; refreshToken: string };
}

export async function register(payload: RegisterPayload) {
  const { data } = await axiosInstance.post("/auth/register", payload);
  return data as { success: boolean };
}

export async function refreshToken(body: { refreshToken: string }) {
  const { data } = await axiosInstance.post("/auth/refresh", body);
  return data as { access_token: string; refreshToken: string };
}

export async function logout() {
  const { data } = await axiosInstance.post("/auth/logout");
  return data as { success: boolean };
}
