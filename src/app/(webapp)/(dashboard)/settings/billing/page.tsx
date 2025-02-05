// import BillingMainPage from '@/components/Billing'
// import React from 'react'

// function page() {
//   return (
//    <BillingMainPage/>
//   )
// }

// export default page
"use client"

import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaymentMethods from "@/components/settings/billing/payment-methods"
import InvoiceHistory from "@/components/settings/billing/invoice-history"

export default function BillingPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <PageHeader title="Billing" subtitle="Manage your organization billing information and view invoices" />
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-methods">
          <PaymentMethods />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoiceHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
