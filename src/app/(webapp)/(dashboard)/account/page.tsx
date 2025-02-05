"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PageHeader } from "@/components/page-header";

const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Current password must be at least 8 characters." }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function MyAccount() {
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [totpDialogOpen, setTotpDialogOpen] = useState(false);
  const [isPersonalInfoSaving, setIsPersonalInfoSaving] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [isTotpLoading, setIsTotpLoading] = useState(false);
  const handleTotpDialogOpen = (isOpen: boolean) => {
    setTotpDialogOpen(isOpen);
    if (isOpen) {
      setTotpCode("");
      setTotpError(null);
    }
  };
  const [totpError, setTotpError] = useState<string | null>(null);
  const { toast } = useToast();

  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "user@example.com",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmitPersonalInfo(values: z.infer<typeof personalInfoSchema>) {
    setIsPersonalInfoSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsPersonalInfoSaving(false);
      toast({
        title: "Personal Information Updated",
        description: "Your personal information has been updated successfully.",
      });
    }, 1000);
  }

  function onSubmitPassword(values: z.infer<typeof passwordSchema>) {
    setIsPasswordChanging(true);
    // Simulate API call
    setTimeout(() => {
      setIsPasswordChanging(false);
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      });
    }, 1000);
  }

  // Mock function to validate TOTP code
  const validateTOTP = () => {
    if (totpCode.length !== 6) {
      setTotpError("Please enter a 6-digit code.");
      return;
    }

    setIsTotpLoading(true);
    // Simulating API call to validate TOTP
    setTimeout(() => {
      if (totpCode === "123456") {
        // This is a mock validation, replace with actual API call
        setTotpEnabled(true);
        setTotpDialogOpen(false);
        setTotpError(null);
        toast({
          title: "Two-Factor Authentication Enabled",
          description: "Your account is now secured with 2FA.",
        });
      } else {
        setTotpError("Invalid verification code. Please try again.");
      }
      setIsTotpLoading(false);
    }, 1000);
  };

  const sessions = [
    {
      id: 1,
      location: "New York, USA",
      ip: "192.168.1.1",
      startTime: "2023-04-01 10:00",
      status: "Current",
    },
    {
      id: 2,
      location: "London, UK",
      ip: "192.168.1.2",
      startTime: "2023-03-28 15:30",
      status: "Active",
    },
    {
      id: 3,
      location: "Tokyo, Japan",
      ip: "192.168.1.3",
      startTime: "2023-03-25 09:15",
      status: "Expired",
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Account Overview"
        subtitle="Manage Your Profile and Security Settings"
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 space-y-4">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here.
              </CardDescription>
            </CardHeader>
            <Form {...personalInfoForm}>
              <form
                onSubmit={personalInfoForm.handleSubmit(onSubmitPersonalInfo)}
              >
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={personalInfoForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={personalInfoForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isPersonalInfoSaving}>
                    {isPersonalInfoSaving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
        <div className="col-span-1 space-y-4">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password here.</CardDescription>
            </CardHeader>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isPasswordChanging}>
                    {isPasswordChanging && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Change Password
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>

      </div>
    </div>
  );
}
