import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateOrganizationApi, getAccountsDetail } from "./dashboard.api";
import { toast } from "sonner";

export const useGetAccountData = () => {
  return useQuery({
    queryKey: ["get-account-detail"],
    queryFn: () => getAccountsDetail(),
  });
};

export const useCreateOrganization = (handleSuccess: any) => {
  return useMutation({
    mutationFn: (data) => CreateOrganizationApi(data),
    onError: (err: any) => {
      if (err && err?.response?.data?.message) {
        toast(err?.response?.data?.message);
      } else {
        toast("Error: Something went Wrong.");
      }
      return err;
    },
    onSuccess: (data) => {
      toast("user profile created");
      handleSuccess(data);
      return data;
    },
  });
};
