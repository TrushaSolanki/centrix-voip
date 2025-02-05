"use client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { userVerifyEmail } from "@/state/auth/auth.api";
import { Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import {  useSearchParams } from "next/navigation";
import { useRouter } from 'next-nprogress-bar';
import { useCallback, useEffect, useRef, useState } from "react";

export default function VerifyEmailLink() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const codeVal = searchParams && searchParams?.get("code");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!hasVerified.current && codeVal) {
      hasVerified.current = true;
      verifyEmail(codeVal);
    } else if (!codeVal) {
      router.push("/login");
    }
  }, [codeVal, router]);


  // useEffect(() => {
  //   if (codeVal !== null && codeVal !== undefined && codeVal !== "") {
  //     if (isVerified === false) {
  //       verifyEmail(codeVal);
  //     }
  //   } else {
  //     router.push("/login");
  //   }
  // }, [codeVal]);

  const verifyEmail = useCallback(async(codeVal: any | string) => {
    if(isVerified!==true){
      try {
      await userVerifyEmail({ code: codeVal });
      setIsVerified(true);
    } catch (error: any) {
      console.error("Error verifying email:", error);
      error &&
        error?.response?.data?.errors.map((err: any, inx: any) =>
          toast({
            itemID: inx,
            title: err?.name ?? "",
            description: err.reason ?? "Error verifying email, Try Again",
            variant: "destructive",
          })
        );
    } finally {
      setIsLoading(false);
    }
    }
    
  },[isVerified]);

  return (
    <div className="w-full max-w-[90%] md:max-w-[620px] mx-auto space-y-6 flex flex-col text-center justify-center p-6">
      <h1 className="text-3xl font-bold">Email Verification</h1>
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        ) : isVerified ? (
          <div
            className={`rounded-full bg-green-100 p-4 ${
              isVerified ? "animate-scale-in" : ""
            }`}
          >
            <Check className="w-8 h-8 text-primary" strokeWidth={3} />
          </div>
        ) : (
          <div
            className={`rounded-full bg-red-100 p-4 ${
              isVerified ? "animate-scale-in" : ""
            }`}
          >
            <X className="w-8 h-8 text-red-500" strokeWidth={3} />
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="text-xl text-muted-foreground">Verifying your email...</p>
      ) : isVerified ? (
        <>
          <p className="text-xl text-muted-foreground">
            Thank you for verifying your email address
          </p>
          <p className="text-muted-foreground pb-6">
            Your account is now active and you can start using our services.
          </p>
        </>
      ) : (
        <p className="text-xl text-muted-foreground">Verification failed</p>
      )}

      {isVerified && (
        <div className="animate-fade-in w-full flex justify-center">
          <Button
            size="lg"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Continue to Login
          </Button>
        </div>
      )}
    </div>
  );
}
