"use client";

import * as React from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  Home,
  MessageSquareMore,
  Phone,
  Hash,
  Settings,
  ChevronRight,
  LifeBuoy,
  Send,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { CompanySwitcher } from "@/components/company-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useGetAccountData } from "@/state/dashboard/dashboard.hook";
import Link from "next/link";
import { useGetUserProfileData } from "@/state/auth/auth.hook";
import { toast } from "@/hooks/use-toast";
import { useOrganizationStore } from "@/store/auth";

// Define types for structured data
interface Company {
  name: string;
  logo: React.ComponentType;
  plan: string;
}

interface User {
  name: string;
  email: string;
  initials: string;
  role: string;
}

// Simplified data object with only relevant items
const data = {
  user: {
    name: "Victor Berroa",
    email: "victor@email.com",
    initials: "VB",
    role: "Administrator",
    avatar: "https://avatar.iran.liara.run/public/boy",
  } as User,
  companies: [
    { name: "Business ABC", logo: BriefcaseBusiness, plan: "Essential" },
    { name: "Acme Corp.", logo: BriefcaseBusiness, plan: "Elite" },
    { name: "Acme Inc.", logo: BriefcaseBusiness, plan: "Pro" },
  ] as Company[],
};

// Sidebar navigation items with Settings submenu
const sidebarItems = [
  // { title: "Home", url: "/home", icon: Home },
  { title: "Phone Numbers", url: "/phone-numbers", icon: Hash },
  { title: "Messaging", url: "/messaging", icon: MessageSquareMore },
  { title: "Voice", url: "/voice", icon: Phone },

  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  //   items: [
  //     { title: "Team Access", url: "/settings/team-access" },
  //     { title: "Billing", url: "/settings/billing" },
  //   ],
  // },
];

const navSecondary = [
  { title: "Help", url: "#", icon: LifeBuoy },
  { title: "Feedback", url: "#", icon: Send },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const setAccountId = useOrganizationStore((state) => state.setAccountId);
  const setOrganizationName = useOrganizationStore(
    (state) => state.setOrganizationName
  );
  const setUserId = useOrganizationStore((state) => state.setUserId);
  const pathname = usePathname();
  const { data: UserProfileData, isPending: UserProfileDataPending } =
    useGetUserProfileData();
  const { data: companiesData, isPending: companiesDataPending } =
    useGetAccountData();

  const isActive = (url: string) => {
    if (url === "#") return false;
    return pathname.startsWith(url);
  };
  useEffect(() => {
    if (UserProfileData) {
      setUserId(
        UserProfileData.id,
        UserProfileData.firstName,
        UserProfileData.lastName
      );
    }
  }, [UserProfileData]);

  useEffect(() => {
    if (companiesData?.length) {
      if (companiesData[0].id && companiesData[0].name) {
        setAccountId(companiesData[0].id);
        setOrganizationName(companiesData[0].name);
      } else {
        toast({
          title: "Error",
          description: "Active organization id not found or name not found",
        });
      }
    }
  }, [companiesData]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanySwitcher
          iscompaniesDataPending={companiesDataPending}
          companies={companiesData}
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Main Sidebar Menu */}
            <SidebarMenu>
              {sidebarItems && sidebarItems.map((item: any) =>
                item && item?.items ? (
                  <Collapsible key={item.title} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton isActive={isActive(item.url)}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item && item?.items && item?.items.map((subItem: any) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(subItem.url)}
                              >
                                <Link href={subItem.url}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item?.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="sm"
                    isActive={isActive(item.url)}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      {/* User Profile */}
      <SidebarFooter>
        <NavUser isLoading={UserProfileDataPending} user={UserProfileData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
