"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { forgotPassEmail, resetPasswordApi } from "@/state/auth/auth.api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";
import CustomPasswordInput from "@/components/customComponent/CustomPasswordInput";
import { getItem, removeItem } from "@/lib/localStorage";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// define password schema for strong validation
const formSchema = z.object({
  NewPassword: z
    .string()
    .min(8, { message: "At least 8 characters" })
    .refine((password) => /[A-Z]/.test(password), {
      message: "At least one uppercase letter",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "At least one lowercase letter",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "At least one number",
    })
    .refine((password) => /[^A-Za-z0-9]/.test(password), {
      message: "At least one special character",
    }),
});

type FormData = z.infer<typeof formSchema>;

const PasswordResetForm = () => {
  const searchParams = useSearchParams();
  const resetCode = searchParams.get("code");
  const resetEmail = getItem("reset-pass-email");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passVal, setPassVal] = useState("");
  const [isResetPass, setIsResetPass] = useState(false);
  const router = useRouter();
  const refTurnstile = useRef<TurnstileInstance>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (resetCode === null || resetCode === undefined || resetCode === "") {
      router.push("/forgot-password");
    }
  }, [resetCode]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      NewPassword: "",
    },
  });

  const handleSubmitForm = async (values: FormData) => {
    setIsLoading(true);
    const payload = {
      Email: resetEmail,
      ResetCode: resetCode,
      NewPassword: passVal,
    };
    try {
      const resp = await resetPasswordApi(payload);
      if (resp == true) {
        setPassVal("");
        form.reset();
        setIsResetPass(true);
        removeItem("reset-pass-email");
        removeItem("conform-reset-email");
        toast({
          title: "You successfully reset your password.",
        });
      }
    } catch (error: any) {
      console.error("Error verifying email:", error);
      error &&
        error?.response?.data?.errors.map((err: any, inx: any) =>
          toast({
            itemID: inx,
            title: err?.name ?? "",
            description: err.reason ?? "Error reset password, Try Again",
            variant: "destructive",
          })
        );
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setVerificationToken(null);
      setCanSubmit(false);
    }
  };

  const formlabel =
    "text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setPassVal(value);
      form.clearErrors();
      form.setValue("NewPassword", value);
    },
    []
  );

  const handleExpire = () => {
    setCanSubmit(false);
    if (refTurnstile.current) {
      refTurnstile.current.reset(); // Reset the widget
    }
  };

  return (
    <div className="w-full max-w-[90%] md:max-w-[620px] mx-auto space-y-6 flex flex-col justify-center  p-6 ">
      {/* <CentrixButton /> */}
      {isResetPass ? (
        <>
          {" "}
          <h1 className="font-semibold text-2xl mt-7">Password reset</h1>
          <p className="font-thin pe-20 mt-2 text-muted-foreground">
            Your password has been changed successfully.You can continue login
            with your new password.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-semibold text-2xl mt-7">Set new password</h1>
          <p className="font-thin pe-20 mt-2 text-muted-foreground">
            Please enter your new password in the field below. Make sure it
            meets the required criteria for security. Once you've entered a
            strong password, click 'Set Password' to complete the reset process.
          </p>
        </>
      )}
      <div className="mt-5 w-full">
        {/* Form setup */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className="space-y-4"
          >
            {isResetPass === false ? (
              <>
                {" "}
                <FormField
                  control={form.control}
                  name="NewPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className={formlabel}>
                        Reset Password
                      </FormLabel>
                      <FormControl>
                        <CustomPasswordInput
                          name="NewPassword"
                          onChange={handleInputChange}
                          showValidators={true}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    Verify you are human by completing the action below
                  </p>
                  <Turnstile
                    id="register-turnstile"
                    ref={refTurnstile}
                    siteKey={SITE_KEY!}
                    onSuccess={(verificationToken: string) => {
                      setVerificationToken(verificationToken);
                      setCanSubmit(true);
                    }}
                    onExpire={handleExpire}
                    options={{
                      theme: "light",
                    }}
                  />
                </div>
                <div className="mt-4">
                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={
                      isLoading || canSubmit === false || !verificationToken
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      `Set password`
                    )}
                  </Button>
                </div>
                <div className="flex justify-end">
                  <span className="mr-1 text-xs font-thin text-muted-foreground">
                    Back to
                  </span>
                  <Link
                    href="/login"
                    onClick={() => {
                      setPassVal("");
                      form.reset();
                      removeItem("reset-pass-email");
                      removeItem("conform-reset-email");
                    }}
                    className="text-xs font-thin text-[#15803d] hover:underline"
                  >
                    Login
                  </Link>
                </div>
              </>
            ) : (
              <Button
                onClick={() => {
                  router.push("/login");
                  setPassVal("");
                  form.reset();
                  removeItem("reset-pass-email");
                  removeItem("conform-reset-email");
                }}
                className="w-full"
              >
                Return to Login
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PasswordResetForm;
