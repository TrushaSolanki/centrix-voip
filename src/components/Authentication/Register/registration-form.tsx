"use client";

import CustomPasswordInput from "@/components/customComponent/CustomPasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { clearItems, setItem } from "@/lib/localStorage";
import { userRegister } from "@/state/auth/auth.api";
import { useAuthStore } from "@/store/auth";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { InfoIcon, Loader2 } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { z } from "zod";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// define password schema for strong validation
const passwordSchema = z
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
  });

// Define the validation schema using Zod
const formSchema = z
  .object({
    FirstName: z.string().min(3, "First name must be at least 3 characters"),
    LastName: z.string().min(3, "Last name must be at least 3 characters"),
    Email: z.string().email("Invalid email address"),
    Password: passwordSchema,
    ConfirmPassword: z.string(),
    PhoneNumber: z
      .string()
      .regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number - Use +E.164 format"),
    AccountName: z
      .string()
      .min(4, "Account name must be at least 4 characters"),
  })
  .refine((data) => data.Password === data.ConfirmPassword, {
    message: "Passwords does not match",
    path: ["ConfirmPassword"],
  });

// Infer the TypeScript type from the Zod schema
type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const router = useRouter(); // Initialize the router
  const { toast } = useToast();
  // State to hold form data
  const [formData, setFormData] = useState<FormData>({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    PhoneNumber: "",
    AccountName: "",
  });

  // State to hold form validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  // State to track form submission status
  const [isLoading, setIsLoading] = useState(false);
  const { completeStep } = useAuthStore();
  const refTurnstile = useRef<TurnstileInstance>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // remove unnecessary values (token etc.) to prevent apis errors of user cookies or token
    clearItems();
    setIsLoading(true);
    setErrors({});
    try {
      // Validate form data against the schema
      const validatedData = formSchema.parse(formData);
      await userRegister(validatedData);
      // Encode Email value in query parameter in case any contains special character
      router.push(
        `/manually-email-verification?email=${encodeURIComponent(
          formData.Email
        )}`
      );
      setItem("timer", (180).toString());
      completeStep("STEP_REGISTRATION");
      // Here you would typically send the data to your server

      // If everything is successful, redirect to the verify email page
      // router.push('/register/verify-email')
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(
          error.flatten().fieldErrors as Partial<Record<keyof FormData, string>>
        );
      } else if (error instanceof Error) {
        // toast({ title: error.message, variant: "destructive" });
        const respErr: any = error;
        respErr &&
          respErr?.response?.data?.errors.map((err: any, inx: any) =>
            toast({
              itemID: inx,
              title: err?.name ?? "",
              description: err.reason ?? "Somthing went wrong, Try Again",
              variant: "destructive",
            })
          );
      }
      // setVerificationToken(null);
    } finally {
      setIsLoading(false);
      setCanSubmit(false);
    }
  };

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear the error for this field as the user types
      setErrors((prev) => ({ ...prev, [name]: undefined }));

      // Special handling for ConfirmPassword
      if (name === "Password" || name === "ConfirmPassword") {
        setErrors((prev) => ({ ...prev, ConfirmPassword: undefined }));
      }
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
    <div className="container lg:max-w-[640px] my-auto mx-auto px-4 py-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Register New Account</h1>
      <p className="text-base text-muted-foreground mb-6">
        Enter your details to create a new account. Please provide a valid
        email, a secure password, and have an authenticator app (such as Google
        Authenticator or Microsoft Authenticator) ready for two-step
        authentication.
      </p>

      {/* {generalError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hold on!</AlertTitle>
          <AlertDescription>{generalError}</AlertDescription>
        </Alert>
      )} */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name and Last Name fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="FirstName">First Name</Label>
            <Input
              id="FirstName"
              name="FirstName"
              autoComplete="given-name"
              placeholder="Add First Name"
              value={formData.FirstName}
              onChange={handleInputChange}
              aria-invalid={errors.FirstName ? "true" : "false"}
              aria-describedby={
                errors.FirstName ? "FirstName-error" : undefined
              }
            />
            {errors.FirstName && (
              <p id="FirstName-error" className="text-sm text-red-500">
                {errors.FirstName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="LastName">Last Name</Label>
            <Input
              id="LastName"
              name="LastName"
              placeholder="Add Last Name"
              autoComplete="family-name"
              value={formData.LastName}
              onChange={handleInputChange}
              aria-invalid={errors.LastName ? "true" : "false"}
              aria-describedby={errors.LastName ? "LastName-error" : undefined}
            />
            {errors.LastName && (
              <p id="LastName-error" className="text-sm text-red-500">
                {errors.LastName}
              </p>
            )}
          </div>
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="Email">Email address</Label>
          <Input
            id="Email"
            name="Email"
            autoComplete="username"
            placeholder="m@example.com"
            type="email"
            value={formData.Email}
            onChange={handleInputChange}
            aria-invalid={errors.Email ? "true" : "false"}
            aria-describedby={errors.Email ? "Email-error" : undefined}
          />
          {errors.Email && (
            <p id="Email-error" className="text-sm text-red-500">
              {errors.Email}
            </p>
          )}
        </div>

        {/* Phone Number and Account Name fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mt-2">
              <Label htmlFor="PhoneNumber">Phone Number</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0"
                      aria-label="Phone number format information"
                    >
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Use +E.164 format. IE: +12123457845</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="PhoneNumber"
              name="PhoneNumber"
              autoComplete="tel"
              placeholder="Add Phone Number"
              type="tel"
              value={formData.PhoneNumber}
              onChange={handleInputChange}
              aria-invalid={errors.PhoneNumber ? "true" : "false"}
              aria-describedby={
                errors.PhoneNumber ? "PhoneNumber-error" : undefined
              }
            />
            {errors.PhoneNumber && (
              <p id="PhoneNumber-error" className="text-sm text-red-500">
                {errors.PhoneNumber}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="AccountName">Account Name</Label>
            <Input
              id="AccountName"
              name="AccountName"
              placeholder="Add Account Name"
              autoComplete="off"
              value={formData.AccountName}
              onChange={handleInputChange}
              aria-invalid={errors.AccountName ? "true" : "false"}
              aria-describedby={
                errors.AccountName ? "AccountName-error" : undefined
              }
            />
            {errors.AccountName && (
              <p id="AccountName-error" className="text-sm text-red-500">
                {errors.AccountName}
              </p>
            )}
          </div>
        </div>

        {/* Password and Confirm Password fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="Password">Password</Label>
            <CustomPasswordInput
              name="Password"
              onChange={handleInputChange}
              showValidators={true}
            />
            {errors.Password && (
              <p id="Password-error" className="text-sm text-red-500">
                {errors.Password}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ConfirmPassword">Confirm Password</Label>
            <CustomPasswordInput
              name="ConfirmPassword"
              onChange={handleInputChange}
              showValidators={false}
            />
            {errors.ConfirmPassword && (
              <p id="ConfirmPassword-error" className="text-sm text-red-500">
                {errors.ConfirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-3">
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

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !verificationToken}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Register"
          )}
        </Button>

        {/* Login link */}
        <div className="flex justify-end mt-3">
          <span className="mr-1 text-xs font-thin text-muted-foreground">
            Already have an account?
          </span>
          <Link
            href="/login"
            className="text-xs text-[#15803d] font-thin hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
