// 'use client'
import API from "@/instance/api";
import { apiProxyInstance } from "@/instance/instance";
// import  { apiProxyInstance, instance } from "@/instance/instance";

export const userLogin = async (payload: any): Promise<any> => {
  // send url in query string TO PROXY FILE
  try {
    const resp = await apiProxyInstance.post(API.auth.login, payload);
    if (!resp.data.error) {
      return { status: resp.status, data: resp.data, headers: resp.headers };
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const userRegister = async (payload: any): Promise<any> => {
  try {
    const resp = await apiProxyInstance.post(API.auth.signup, payload);
    if (!resp.data.error) {
      return resp.data.data;
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const userVerifyEmail = async (payload: any): Promise<any> => {
  try {
    const resp = await apiProxyInstance.post(API.auth.confirmEmail, payload);

    if (!resp.data.error) {
      return resp.data.data;
    } else {
      return resp.data;
    }
  } catch (error: any) {
    console.error("Email verification err", error?.message);
    throw error;
  }
};

export const resendVerifyEmail = async (payload: any): Promise<any> => {
  try {
    const resp = await apiProxyInstance.post(API.auth.resendEmail, payload);
    if (resp.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

export const userLogin2fa = async (payload: any): Promise<any> => {
  try {
    const resp = await apiProxyInstance.post(API.auth.login2fa, payload, {
      headers: { withCredentials: true },
    });
    if (resp) {
      return resp;
    }
  } catch (error) {
    console.error("login 2fa err:", error);
    throw error;
  }
};

export const user2fa = async (payload: any): Promise<any> => {
  try {
    const resp = await apiProxyInstance.post(API.auth.user2fa, payload);
    if (!resp.data.error) {
      return resp;
    }
  } catch (error) {
    console.error("User 2fa err:", error);
    throw error;
  }
};

export const forgotPassEmail = async (payload: any): Promise<any> => {
  try {
    const resp = await apiProxyInstance.post(API.auth.forgotPass, payload);
    if (resp.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

export const resetPasswordApi = async (payload: any): Promise<any> => {
  try {
    const resp = await apiProxyInstance.post(API.auth.resetPass, payload);
    if (resp.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

export const getUserDetail = async () => {
  const response = await apiProxyInstance.get(API.auth.userDetail);
  return response.data;
};
