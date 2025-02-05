// services/api.js
import { toast } from "@/hooks/use-toast";
import { removeCookie, readCookie } from "@/lib/cookieManagment";
import { getItem } from "@/lib/localStorage";
import axios from "axios";
// Proxy server instance
const apiProxyInstance = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

apiProxyInstance.interceptors.request.use(
  async (config) => {
    const session = readCookie("auth-token")
      ? readCookie("auth-token")
      : getItem("accessToken");
    if (session) {
      config.headers.Authorization = `Bearer ${session}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiProxyInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.status === 401) {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        window.sessionStorage.clear();
      }
      removeCookie("AccountID");
      removeCookie("Organization");
      removeCookie("auth-token");
      removeCookie("UserId");
      window.location.href = "/login";
    }
    toast({
      title: error?.response?.data?.status,
      description: error?.response?.data?.reason,
    });
    return Promise.reject(error);
  }
);

// Api instance without proxy server/midllware
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const session = readCookie("auth-token")
      ? readCookie("auth-token")
      : getItem("accessToken");
    if (session) {
      config.headers.Authorization = `Bearer ${session}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.status === 401) {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        window.sessionStorage.clear();
      }
      removeCookie("AccountID");
      removeCookie("Organization");
      removeCookie("auth-token");
      removeCookie("UserId");
      window.location.href = "/login";
    }
    toast({
      title: error?.response?.data?.status,
      description: error?.response?.data?.reason,
    });
    return Promise.reject(error);
  }
);

export { apiProxyInstance, instance };
