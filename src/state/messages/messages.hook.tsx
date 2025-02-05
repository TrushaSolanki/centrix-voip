import { useQuery } from "@tanstack/react-query";
import { getAccountsMessages, getAccountsMessagesDetail } from "./messages.api";
import { useOrganizationStore } from "@/store/auth";

export const useGetAccountMessages = (pageQuery: any) => {
  const accountID = useOrganizationStore((state) => state.AccountId);
  return useQuery({
    queryKey: ["get-account-messages", pageQuery, accountID],
    queryFn: () => getAccountsMessages(pageQuery),
    // keepPreviousData: true,
    enabled: !!accountID,
  });
};

export const useGetAccountMessagesDetail = (id: string | undefined) => {
  const accountID = useOrganizationStore((state) => state.AccountId);
  return useQuery({
    queryKey: ["get-account-messages-detail", accountID, id],
    queryFn: () => getAccountsMessagesDetail(id),
    enabled: !!accountID && !!id,
  });
};
