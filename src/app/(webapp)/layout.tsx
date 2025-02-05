import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import StripeProviders from "@/lib/StripeProviders";

export default async function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <StripeProviders>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </StripeProviders>

  );
}
