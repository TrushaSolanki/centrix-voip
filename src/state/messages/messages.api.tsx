import API from "@/instance/api";
import { apiProxyInstance } from "@/instance/instance";
import { paramsToQueryString } from "@/lib/commanFunctions";
import { readCookie } from "@/lib/cookieManagment";

const AccountID = readCookie("AccountID");

export const getAccountsMessages = async (pageQuery: any) => {
  const query = paramsToQueryString(pageQuery);
  const response = await apiProxyInstance.get(
    API.dashboard.accountDetail + `/${AccountID}/messages` + query
  );
  return response.data;
};

export const getAccountsMessagesDetail = async (id: string | undefined) => {
  const AccountID = readCookie("AccountID");
  const response = await apiProxyInstance.get(
    API.dashboard.accountDetail + `/${AccountID}/messages/${id}`
  );
  return response.data;
};
