import axios, { InternalAxiosRequestConfig } from "axios";
import { useEffect } from "react";
import { useAuth } from "@contexts/AuthContext";

// ridwan added this, i'm still going to get the actual base url i would be using
export const axiosFetch = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL ?? "",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // i'm still going to change this based on the company's preference
  timeout: 25000,
});

// Additionally, i would also work on a retry count
// and maybe add APIs to be skipped in retries

const AxiosProvider = () => {
  const { token, refreshToken, setToken, setRefreshToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosFetch.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const authToken = token ?? "";

        if (authToken) {
          (config.headers as any)["Authorization"] = `Bearer ${authToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    let isRefreshing = false;
    let refreshSubscribers: Array<(token: string | null) => void> = [];

    const subscribeTokenRefresh = (cb: (token: string | null) => void) => {
      refreshSubscribers.push(cb);
    };

    const onRefreshed = (nextToken: string | null) => {
      refreshSubscribers.forEach((cb) => cb(nextToken));
      refreshSubscribers = [];
    };

    const responseInterceptor = axiosFetch.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config as
          | (InternalAxiosRequestConfig & { _retry?: boolean })
          | undefined;

        const status = error?.response?.status;
        const apiRes = error?.response?.data;

        console.log("Error api res: ", JSON.stringify(error));
        if (
          apiRes?.code !== "TOKEN_EXPIRED" ||
          !originalRequest ||
          originalRequest._retry
        ) {
          return Promise.reject(error);
        }

        // if (!refreshToken) {
        //   return Promise.reject(error);
        // }
        console.log("My Error", originalRequest);

        originalRequest._retry = true;
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((nextToken) => {
              if (!nextToken) {
                reject(error);
                return;
              }

              (originalRequest.headers as any)["Authorization"] =
                `Bearer ${nextToken}`;
              resolve(axiosFetch(originalRequest));
            });
          });
        }
        console.log(status);

        isRefreshing = true;

        try {
          const refreshResponse = await axiosFetch.get("/auth/refresh-token", {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log("refresh", refreshResponse);

          const nextAccessToken =
            refreshResponse?.data?.token ??
            refreshResponse?.data?.accessToken ??
            refreshResponse?.data?.data?.token ??
            refreshResponse?.data?.data?.accessToken ??
            null;

          const nextRefreshToken =
            refreshResponse?.data?.refreshToken ??
            refreshResponse?.data?.refresh_token ??
            refreshResponse?.data?.data?.refreshToken ??
            refreshResponse?.data?.data?.refresh_token ??
            refreshToken;

          if (nextAccessToken) {
            setToken(nextAccessToken);
          }

          if (nextRefreshToken) {
            setRefreshToken(nextRefreshToken);
          }

          onRefreshed(nextAccessToken);

          if (nextAccessToken) {
            (originalRequest.headers as any)["Authorization"] =
              `Bearer ${nextAccessToken}`;
            return axiosFetch(originalRequest);
          }

          return Promise.reject(error);
        } catch (refreshError) {
          // setToken(null);
          // setRefreshToken(null);
          onRefreshed(null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      },
    );

    return () => {
      axiosFetch.interceptors.request.eject(requestInterceptor);
      axiosFetch.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken, setRefreshToken, setToken, token]);

  return null;
};

export default AxiosProvider;
