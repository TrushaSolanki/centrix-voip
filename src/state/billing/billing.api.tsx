import API from "@/instance/api";
import { apiProxyInstance } from "@/instance/instance";
import { readCookie } from "@/lib/cookieManagment";

const AccountID = readCookie("AccountID");

export const getInvoiceDetail = async (paramas: any) => {
  let queryString = `?Limit=${paramas?.Limit}`
  if (paramas?.Status !== null && paramas?.Status !== '' && paramas?.Status !== undefined) {
    queryString += `&Status=${paramas?.Status}`
  }
  if (paramas?.StartingAfter !== null && paramas?.StartingAfter !== '' && paramas?.StartingAfter !== undefined) {
    queryString += `&StartingAfter=${paramas?.StartingAfter}`
  }
  if (paramas?.EndingBefore !== null && paramas?.EndingBefore !== '' && paramas?.EndingBefore !== undefined) {
    queryString += `&EndingBefore=${paramas?.EndingBefore}`
  }
  const response = await apiProxyInstance.get(
    API.dashboard.accountDetail + `/${AccountID}/invoices` + queryString
  );
  return response.data;
};

export const getPaymentMethodDetail = async () => {
  const response = await apiProxyInstance.get(
    API.dashboard.accountDetail + `/${AccountID}/payment-methods`
  );
  return response.data;
};

export const addPaymentMethodApi = async (payload: any): Promise<any> => {
  try {
    const resp = await apiProxyInstance.post(
      `${API.payment.addPaymentMethod}/${AccountID}/payment-methods`,
      payload
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
