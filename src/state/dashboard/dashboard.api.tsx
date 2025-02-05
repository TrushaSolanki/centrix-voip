import API from "@/instance/api";
import { apiProxyInstance } from "@/instance/instance";

export const getAccountsDetail = async () => {
  const response = await apiProxyInstance.get(API.dashboard.accountDetail);
  return response.data;
};

export const CreateOrganizationApi = async (payload: any): Promise<any> => {
  try {
    const resp = await apiProxyInstance.post(
      API.dashboard.accountDetail,
      payload
    );
    if (resp.status === 200) {
      return resp.data;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};
