import API from "@/instance/api";
import { apiProxyInstance, instance } from "@/instance/instance";

export const updateUserDetailsApi = async (payload: any): Promise<any> => {
  try {
    const resp = await apiProxyInstance.post(API.user.update, payload);
    if (resp.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};
export const addUserInAccount = async (payload: any): Promise<any> => {
  const { accountId, userId } = payload;
  try {
    const resp = await apiProxyInstance.post(
      `${API.user.add}/${accountId}/users/${userId}`,
      {}
    );
    if (resp.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};
