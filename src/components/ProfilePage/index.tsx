"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { readCookie } from "@/lib/cookieManagment";
import { useGetUserProfileData } from "@/state/auth/auth.hook";
import { useGetAccountData } from "@/state/dashboard/dashboard.hook";
import { Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";
import { EditCompany } from "../userdetail-dialog";

function UserProfile() {
  const {
    data: UserProfileData,
    isPending: UserProfileDataPending,
    isError: UserProfileDataError,
    refetch: UserProfileDataRefetch,
  } = useGetUserProfileData();

  const Organization = readCookie("Organization");

  const {
    data: UserAccountData,
    isPending: UserAccountDataPending,
    isError: UserAccountDataError,
  } = useGetAccountData();

  return (
    <div >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-xl">User and Tenant Info</h1>
            <EditCompany UserProfileDataRefetch={UserProfileDataRefetch} />
          </div>
        </CardHeader>
        <CardContent>
          {UserProfileDataPending ? (
            <div className="flex items-center justify-center h-[100px]">
              <Loader2 className="animate-spin" />
            </div>
            // ) : UserProfileDataError ? (
            //   <div className="flex items-center justify-center h-[100px]">
            //     {UserProfileDataError}
            //   </div>
          ) : (
            <div className="flex flex-wrap gap-4 md:gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 align-top">
                  <span><b>Email:</b></span>
                  <p>
                    {UserProfileData?.email ? UserProfileData?.email : "-"}
                  </p>
                </div>
                <div className="flex gap-4 align-top">
                  <span><b>Password:</b></span>
                  <p>{`********`}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 align-top">
                  <span><b>Name:</b></span>
                  <p>
                    {UserProfileData?.firstName && UserProfileData?.lastName
                      ? `${UserProfileData?.firstName} ${UserProfileData?.lastName}`
                      : "-"}
                  </p>
                </div>

                <div className="flex gap-4 align-top">
                  <span><b>Organization:</b></span>
                  <p>
                    {Organization !== "undefine" && Organization
                      ? Organization
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          ></SidebarMenuButton>
        </DropdownMenuTrigger>
      </DropdownMenu>
      <Card className="mt-4">
        <CardHeader>
          <h1 className="text-xl mb-2">Accounts</h1>
          <p className="text-gray-500">
            The list of accounts to which you are a member.
          </p>
        </CardHeader>

        <CardContent>
          <div>
            <Table>
              <TableHeader>
                <TableRow className="font-semibold">
                  <TableCell>Name</TableCell>
                  {/* <TableCell>Role</TableCell> */}
                  <TableCell>ID</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {UserAccountDataPending ? (
                  <div className="flex items-center justify-center h-[100px]">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : UserAccountDataError ? (
                  <div className="flex items-center justify-center h-[100px]">
                    {UserAccountDataError}
                  </div>
                ) : (
                  UserAccountData?.map((data: any) => {
                    return (
                      <TableRow key={data.id}>
                        <TableCell>{data.name}</TableCell>
                        <TableCell>{data.id}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserProfile;
