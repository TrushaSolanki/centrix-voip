import API from "@/instance/api";
import { apiProxyInstance } from "@/instance/instance";
import { paramsToQueryString } from "@/lib/commanFunctions";
import { readCookie } from "@/lib/cookieManagment";

const AccountID = readCookie("AccountID");

export const getAccountsNumber = async (pageQuery: any) => {
  const query = paramsToQueryString(pageQuery);
  const response = await apiProxyInstance.get(
    API.dashboard.accountDetail + `/${AccountID}/phone-numbers` + query
  );
  return response.data;
};
