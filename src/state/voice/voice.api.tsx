import API from "@/instance/api";
import { apiProxyInstance } from "@/instance/instance";
import { paramsToQueryString } from "@/lib/commanFunctions";
import { readCookie } from "@/lib/cookieManagment";

const AccountID = readCookie("AccountID");

export const getAccountsVoice = async (pageQuery: any) => {
  const query = paramsToQueryString(pageQuery);
  const response = await apiProxyInstance.get(
    API.dashboard.accountDetail + `/${AccountID}/calls` + query
  );
  return response.data;
};

export const getAccountsVoiceDetail = async (id: string | undefined | null) => {
  const AccountID = readCookie("AccountID");
  const response = await apiProxyInstance.get(
    API.dashboard.accountDetail + `/${AccountID}/calls/${id}`
  );
  return response.data;
};

export const getRecordingDetail = async (id: string | undefined) => {
  const response = await apiProxyInstance.get(
    API.dashboard.accountDetail + `/${AccountID}/calls/${id}/recordings`
  );
  return response.data;
};

// https://api.centrixcc.com/accounts/fe83afff-9fcb-45a2-aba1-789dde99ff50/recordings/ef573c49-06cf-4a62-89e6-fade4fcc3d46.mp3
export const getCallRecordingData = async (id: string | undefined) => {
  const response = await apiProxyInstance.get(
    API.dashboard.accountDetail + `/${AccountID}/calls/${id}.mp3`,
    {
      responseType: "arraybuffer",
    }
  );
  return response.data;
};
