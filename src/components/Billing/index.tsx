"use client";

import { useMemo, useState } from "react";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceHistoryList from "./InvoiceHistory";
import PaymentMethod from "./PaymentMethod";
import PaymentMethodsList from "./PaymentMethod";

export default function BillingMainPage() {

  return (
    <div className="container mx-auto lg:py-10 sm:p-3">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Billing</h1>
      {/* <p className="text-lg text-muted-foreground">
            Manage Your Team's Access and Security Settings
          </p> */}
      <div className="mt-6 w-full">
        <Tabs defaultValue="invoice" orientation="vertical">
          <TabsList>
            <TabsTrigger value="invoice">Invoices</TabsTrigger>
          </TabsList>
          <TabsList>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
          <TabsContent value="invoice">
            <InvoiceHistoryList />
          </TabsContent>
          <TabsContent value="payment">
            <PaymentMethodsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
