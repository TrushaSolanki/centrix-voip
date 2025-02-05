import { useQuery } from "@tanstack/react-query";
import { getAccountsNumber } from "./phone-number.api";
import { useOrganizationStore } from "@/store/auth";

export const useGetAccountNumber = (pageQuery: any) => {
  const accountID = useOrganizationStore((state) => state.AccountId);
  return useQuery({
    queryKey: ["get-account-number", pageQuery, accountID],
    queryFn: () => getAccountsNumber(pageQuery),
    enabled: !!accountID,
  });
};
