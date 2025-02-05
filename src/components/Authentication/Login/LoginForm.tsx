"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import { clearItems, setItem } from "@/lib/localStorage";
import { userLogin } from "@/state/auth/auth.api";
import { useAuthStore } from "@/store/auth";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useRouter } from "next-nprogress-bar";

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { completeStep } = useAuthStore();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const refTurnstile = useRef<TurnstileInstance>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null
  );

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setSuccessMessage(null);
    // remove unnecessary values (token etc.) to prevent api errors
    clearItems();
    try {
      const response = await userLogin({
        email: data.email,
        password: data.password,
      });
      const { status } = response;
      const token = response.data.accessToken;
      if (token) {
        setItem("accessToken", token); // Store token in localStorage
      }
      completeStep("STEP_LOGIN"); // Mark login as complete
      if (status === 202) {
        router.push(`/two-factor-login`);
      } else if (status === 200) {
        router.push(
          `/two-factor-authentication?email=${encodeURIComponent(data.email)}`
        );
      } else {
        // console.log("Unexpected login status");
      }
      // Redirect or update UI for successful login
    } catch (e: any) {
      const errorMessages: Record<string, string> = {
        ACCOUNT_LOCKED: "Your account has been locked. Please contact support.",
        NETWORK_ERROR:
          "Unable to connect to the server. Please try again later.",
        SESSION_EXPIRED: "Your session has expired. Please log in again.",
        INVALID_CREDENTIALS: "The email or password you entered is incorrect.",
        "2FA_REQUIRED": "Please enter your two-factor authentication code.",
      };
      if (errorMessages[e?.code]) {
        toast({
          title: errorMessages[e?.code] || "An unexpected error occurred",
          variant: "destructive",
        });
      } else {
        toast({ title: e?.response?.data?.title, variant: "destructive" });
      }
      // setVerificationToken(null);
    } finally {
      setIsLoading(false);
      setCanSubmit(false);
    }
  }

  const handleExpire = () => {
    setCanSubmit(false);
    if (refTurnstile.current) {
      refTurnstile.current.reset(); // Reset the widget
    }
  };

  return (
    <div className="w-full max-w-[90%] md:max-w-[620px] mx-auto space-y-6 flex flex-col justify-center p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold mb-2">Login</h1>
        <p className="text-gray-500">
          Enter your email below to login to your account
        </p>
      </div>
      {/* {error && ( 
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert> 
      )}  */}
      {successMessage && (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-end">
            <Link
              className="text-xs hover:text-[#15803d] font-thin text-muted-foreground hover:underline"
              href="/forgot-password"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="flex flex-col gap-2 space-y-2">
            <p className="text-sm">
              Verify you are human by completing the action below
            </p>
            <Turnstile
              id="turnstile-1"
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

          <Button className="w-full" disabled={isLoading || !verificationToken}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
      <div className="flex justify-end text-xs font-thin text-muted-foreground">
        <span className="mr-1">Not registered?</span>
        <Link
          className="text-xs text-[#15803d] font-thin hover:underline"
          href="/register"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
