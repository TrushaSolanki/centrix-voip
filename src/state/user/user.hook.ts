import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { addUserInAccount, updateUserDetailsApi } from "./user.api";

export const useUpdateUserDetails = (handleSuccess: any) => {
  return useMutation({
    mutationFn: (data) => updateUserDetailsApi(data),
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

export const useAddUserInAccount = (handleSuccess: any) => {
  return useMutation({
    mutationFn: (data) => addUserInAccount(data),
    onError: (err: any) => {
      if (err && err?.response?.data?.message) {
        toast(err?.response?.data?.message);
      } else {
        toast("Error: Something went Wrong.");
      }
      return err;
    },
    onSuccess: (data) => {
      handleSuccess(data);
      toast("user profile updated successfully");
      return true;
    },
  });
};
