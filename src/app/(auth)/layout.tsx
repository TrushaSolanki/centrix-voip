import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

export default async function AuthLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={<div><Loader2 className="mr-2 h-4 w-4 animate-spin text-muted" /></div>}>
        {children}
        <Toaster />
      </Suspense>
    </div>
  );
}
