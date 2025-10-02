import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import {
  getTokens,
  setTokens,
  clearTokens,
  isRefreshingToken,
  setRefreshingTokenPromise,
} from "./auth-helpers.ts";

const API_BASE_URL = "http://localhost:3001/api";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = getTokens();
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshing = isRefreshingToken();
        if (refreshing) {
          await refreshing;
        } else {
          const { refreshToken } = getTokens();
          if (!refreshToken) throw error;

          const promise = axios
            .post(
              `${API_BASE_URL}/auth/refresh`,
              { refreshToken },
              {
                headers: {
                  Authorization: `Bearer ${getTokens().accessToken ?? ""}`,
                },
              }
            )
            .then((res) => {
              const { accessToken: newAccess, refreshToken: newRefresh } =
                res.data;
              setTokens({ accessToken: newAccess, refreshToken: newRefresh });
            })
            .catch((e) => {
              clearTokens();
              throw e;
            })
            .finally(() => setRefreshingTokenPromise(null));

          setRefreshingTokenPromise(promise);
          await promise;
        }

        // Retry original request with new token
        const { accessToken: latestAccess } = getTokens();
        originalRequest.headers = originalRequest.headers ?? {};
        if (latestAccess)
          originalRequest.headers.Authorization = `Bearer ${latestAccess}`;
        return axiosInstance.request(originalRequest);
      } catch (e) {
        clearTokens();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
