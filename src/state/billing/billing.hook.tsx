import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addPaymentMethodApi,
  getInvoiceDetail,
  getPaymentMethodDetail,
} from "./billing.api";
import { toast } from "sonner";
import { useOrganizationStore } from "@/store/auth";

export const useGetInvoiceData = (params: any) => {
  const accountID = useOrganizationStore((state) => state.AccountId);
  return useQuery({
    queryKey: ["get-invoice-detail", accountID],
    queryFn: () => getInvoiceDetail(params),
    enabled: !!accountID,
  });
};

export const useGetPaymentMethodData = () => {
  const accountID = useOrganizationStore((state) => state.AccountId);
  return useQuery({
    queryKey: ["get-payment-method-detail", accountID],
    queryFn: () => getPaymentMethodDetail(),
    enabled: !!accountID,
  });
};

export const useAddPaymentMethod = (handleSuccess: any) => {
  return useMutation({
    mutationFn: (data) => addPaymentMethodApi(data),
    onError: (err: any) => {
      if (err && err?.response?.data?.message) {
        toast(err?.response?.data?.message);
      } else {
        toast("Error: Something went Wrong.");
      }
      return err;
    },
    onSuccess: (data) => {
      handleSuccess();
      toast("user profile updated successfully");
      return true;
    },
  });
};
