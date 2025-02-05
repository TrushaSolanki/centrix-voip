"use client";

import Link from "next/link";
import {
  BadgeCheck,
  ChevronUp,
  CreditCard,
  Loader2,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { removeCookie } from "@/lib/cookieManagment";
import { clearItems, removeItem } from "@/lib/localStorage";
import { useQueryClient } from "@tanstack/react-query";

export function NavUser({
  user,
  isLoading,
}: {
  isLoading: boolean;
  user: {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    initials: string;
    role: string;
  };
}) {
  const { isMobile } = useSidebar();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    clearItems();
    if (typeof window !== 'undefined') {
      window.sessionStorage.clear();
    }
    removeCookie("auth-token");
    removeCookie("AccountID");
    removeCookie("Organization");
    removeCookie("UserId");
    // Reset all queries and remove all cached data
    queryClient.clear();
    // 1. Reset all queries to their initial state
    queryClient.resetQueries();
    // 2. Remove all cached queries
    queryClient.removeQueries();
    router.push("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isLoading ? (
                <div className="flex items-center justify-center w-full">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={
                        user?.avatar ||
                        "https://avatar.iran.liara.run/public/boy"
                      }
                      alt={user?.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    {user && (
                      <span className="truncate font-semibold">{`${user?.firstName} ${user?.lastName}`}</span>
                    )}
                    {user && (
                      <span className="truncate text-xs">{user?.email}</span>
                    )}
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      user?.avatar || "https://avatar.iran.liara.run/public/boy"
                    }
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{`${user?.firstName} ${user?.lastName}`}</span>
                  <span className="truncate text-xs">{user?.role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href="/profile" className="flex w-full items-center">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  User Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings/billing"
                  className="flex w-full items-center"
                >
                  <CreditCard className="h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
