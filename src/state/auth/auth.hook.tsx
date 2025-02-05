import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserDetail } from "./auth.api";

export const useGetUserProfileData = () => {
  return useQuery({
    queryKey: ["get-users-detail"],
    queryFn: () => getUserDetail(),
  });
};
