import { useQuery } from "@tanstack/react-query";
import {
  getAccountsVoice,
  getAccountsVoiceDetail,
  getCallRecordingData,
  getRecordingDetail,
} from "./voice.api";
import { useOrganizationStore } from "@/store/auth";

export const useGetAccountVoice = (pageQuery: any) => {
  const accountID = useOrganizationStore((state) => state.AccountId);
  return useQuery({
    queryKey: ["get-account-voice", pageQuery, accountID],
    queryFn: () => getAccountsVoice(pageQuery),
    enabled: !!accountID,
  });
};

export const useGetAccountVoiceDetail = (id: string | undefined | null) => {
  const accountID = useOrganizationStore((state) => state.AccountId);
  return useQuery({
    queryKey: ["get-account-voice-detail", accountID, id],
    queryFn: () => getAccountsVoiceDetail(id),
    enabled: !!accountID && !!id,
  });
};

export const useGetRecording = (id: string | undefined) => {
  const accountID = useOrganizationStore((state) => state.AccountId);
  return useQuery({
    queryKey: ["get-recording-detail", accountID, id],
    queryFn: () => getRecordingDetail(id),
    enabled: !!accountID && !!id,
  });
};

export const useGetRecordingData = (id: string | undefined) => {
  const accountID = useOrganizationStore((state) => state.AccountId);
  return useQuery({
    queryKey: ["get-recording-audio-detail", accountID, id],
    queryFn: () => getCallRecordingData(id),
    enabled: !!accountID && !!id,
  });
};
