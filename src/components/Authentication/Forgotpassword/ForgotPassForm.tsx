"use client";
import React, { useCallback, useEffect, useState } from "react";
import CentrixButton from "../commoncomponent/CentrixButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { forgotPassEmail, resetPasswordApi } from "@/state/auth/auth.api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import CustomPasswordInput from "@/components/customComponent/CustomPasswordInput";
import { getItem, setItem } from "@/lib/localStorage";
import { useAuthStore } from "@/store/auth";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type FormData = z.infer<typeof formSchema>;

const ForgotPassForm = () => {
  const router = useRouter();
  const isEmailSend = getItem("conform-reset-email");
  const [emailverified, setemailVerified] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { completeStep } = useAuthStore();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isEmailSend && isEmailSend !== null && isEmailSend !== undefined) {
      setemailVerified(true);
    }
  }, [emailverified]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmitForm = async (values: FormData) => {
    setIsLoading(true);
    if (emailverified === false) {
      try {
        const emailResp = await forgotPassEmail(values);
        if (emailResp == true) {
          setemailVerified(true);
          setItem("reset-pass-email", values.email);
          setItem("conform-reset-email", true);
          completeStep("STEP_FORGOT_PASSWORD");
        }
      } catch (error: any) {
        console.error("Sent email error,:", error);
        error &&
          error?.response?.data?.errors.map((err: any, inx: any) =>
            toast({
              itemID: inx,
              title: err?.name ?? "",
              description: err.reason ?? "Sent email error, Try Again",
              variant: "destructive",
            })
          );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formlabel =
    "text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

  return (
    <div className="w-full max-w-[90%] md:max-w-[620px] mx-auto space-y-6 flex flex-col justify-center  p-6 ">
      {/* <CentrixButton /> */}
      {!isLoading ? (
        <h1 className="font-semibold text-2xl mt-7">
          {emailverified ? `What's next?` : `Password reset`}
        </h1>
      ) : (
        <Skeleton className="h-[30px] w-[150px] sm:w-[200px]" />
      )}

      {!isLoading ? (
        <p className="font-thin pe-20 mt-2 text-muted-foreground">
          {emailverified
            ? `If we find an account matching the provided information, you
          will receive an email with a link to reset your password.
          Please check your inbox and follow the instructions to
          complete the process.`
            : `Please enter your email address associated with your account. We will
        send you a password reset link if an account is found.`}
        </p>
      ) : (
        <Skeleton className="h-[80px] w-full" />
      )}
      {!emailverified && (
        <div className="mt-5 w-full">
          {/* Form setup */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitForm)}
              className="space-y-4"
            >
              {!isLoading ? (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className={formlabel}>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              ) : (
                <Skeleton className="h-[50px] w-full" />
              )}
              <div className="mt-4">
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Send link to email"
                  )}
                </Button>
              </div>
              <div className="flex justify-end">
                <span className="mr-1 text-xs font-thin text-muted-foreground">
                  Back to
                </span>
                <Link
                  href="/login"
                  className="text-xs font-thin text-[#15803d] hover:underline"
                >
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* {!isLoading && emailverified && (
        <Button
          onClick={() => {
            router.push("/login");
          }}
          className="w-full"
        >
          Go Back
        </Button>
      )} */}
    </div>
  );
};

export default ForgotPassForm;
