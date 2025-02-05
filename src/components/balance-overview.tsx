"use client";
import {
  Activity,
  PhoneCall,
  PhoneMissed,
  Receipt,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetUserProfileData } from "@/state/auth/auth.hook";

export default function BalanceOverview({
  outstandingBalance = 4231.89,
  lastPaymentAmount = 1231.89,
  lastPaymentDate = "12th Oct 2024",
}: {
  outstandingBalance?: number;
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
}) {
  const { data } = useGetUserProfileData();
  // console.log("🚀 ~ data:", data)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Outstanding Invoices
          </CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              ${outstandingBalance.toFixed(2)}
            </div>
            {/* {outstandingBalance > 0 && (
              <Button size="sm" className="h-6 text-xs px-2 py-0">
                <DollarSign className="h-3 w-3 mr-1" />
                Pay Now
              </Button>
            )} */}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500">Last payment:</span> $
            {lastPaymentAmount.toFixed(2)} on {lastPaymentDate}
          </p>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Call Duration
          </CardTitle>
          <PhoneCall className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalCallDuration.toLocaleString()} minutes{" "}
          </div>
          <p className="text-xs text-muted-foreground">
            <span
              className={
                totalCallDurationChange >= 0
                  ? "text-emerald-500"
                  : "text-red-500"
              }
            >
              {totalCallDurationChange >= 0 ? "+" : ""}
              {totalCallDurationChange}%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Missed Calls</CardTitle>
          <PhoneMissed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{missedCalls}</div>
          <p className="text-xs text-muted-foreground">
            <span
              className={
                missedCallsChange <= 0 ? "text-emerald-500" : "text-red-500"
              }
            >
              {missedCallsChange >= 0 ? "+" : ""}
              {Math.abs(missedCallsChange)}%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Call Duration
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageCallDuration} minutes
          </div>
          <p className="text-xs text-muted-foreground">
            <span
              className={
                averageCallDurationChange >= 0
                  ? "text-emerald-500"
                  : "text-red-500"
              }
            >
              {averageCallDurationChange >= 0 ? "+" : ""}
              {averageCallDurationChange}%
            </span>{" "}
            since last month
          </p>
        </CardContent>
      </Card> */}
    </div>
  );
}
