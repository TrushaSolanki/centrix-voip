"use client";

import * as React from "react";
import { useEffect } from "react";
import { BriefcaseBusiness, ChevronDown, Loader2, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AddCompanyDialog } from "@/components/company-dialog";
import { useOrganizationStore } from "@/store/auth";
import { createCookie, readCookie } from "@/lib/cookieManagment";

export function CompanySwitcher({
  companies,
  iscompaniesDataPending,
}: {
  iscompaniesDataPending: Boolean;
  companies: {
    name: string;
    logo: React.ElementType;
    plan?: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeOrganization, setActiveOrganization] = React.useState<any>([]);
  const setAccountId = useOrganizationStore((state) => state.setAccountId);
  const setProvider = useOrganizationStore((state) => state.setProvider);
  const setOrganizationName = useOrganizationStore(
    (state) => state.setOrganizationName
  );

  useEffect(() => {
    if (companies?.length) {
      setActiveOrganization(companies[0]);
    }
  }, [companies]);
  useEffect(() => {
    if (activeOrganization) {
      setAccountId(activeOrganization?.id);
      setOrganizationName(activeOrganization?.name);
      setProvider(activeOrganization?.provider);
    }
  }, [activeOrganization, setAccountId, setOrganizationName]);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* <activeOrganization.logo className="size-4" /> */}
                <BriefcaseBusiness className="size-4" />
              </div>
              {iscompaniesDataPending ? (
                <div className="flex items-center justify-center w-full">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeOrganization?.name}
                  </span>
                  <span className="truncate text-xs">
                    {activeOrganization?.plan}
                  </span>
                </div>
              )}

              <ChevronDown />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Other Companies
            </DropdownMenuLabel>
            {iscompaniesDataPending ? (
              <div className="flex items-center justify-center w-full">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              companies?.map((company) => (
                <DropdownMenuItem
                  key={company?.name}
                  onClick={() => setActiveOrganization(company)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {/* <company.logo className="size-4 shrink-0" /> */}
                    <BriefcaseBusiness className="size-4 shrink-0" />
                  </div>
                  {company?.name}
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <AddCompanyDialog />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
