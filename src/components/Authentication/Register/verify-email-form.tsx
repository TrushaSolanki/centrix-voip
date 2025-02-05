"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { resendVerifyEmail, userVerifyEmail } from "@/state/auth/auth.api";
import { AlertTriangle, Loader2, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import VerifyEmailValid from "@/components/Authentication/commoncomponent/verify-email-valid";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { getItem, removeItem, setItem } from "@/lib/localStorage";
import withStepGuard from "@/lib/stepAuthGuard";
function AccountActivation() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const timerNum = getItem("timer");
  const [otp, setOtp] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showFailedAlert, setShowFailedAlert] = useState(false);
  const [showWrongCodeAlert, setShowWrongCodeAlert] = useState(false);
  const [timer, setTimer] = useState<any>(timerNum ? timerNum : 180);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer !== null && timer !== undefined) {
      setItem("timer", timer.toString());
      const interval = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          setTimer(0);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Format timeLeft as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
    setShowAlert(false);
  };

  const handleSubmit = async (e: any) => {
    setIsActivating(true);
    // Simulate API call
    try {
      const resp = await userVerifyEmail({
        code: otp,
        email: decodeURIComponent(email),
      });
      setIsVerified(true);
      setIsActivating(false);
      setTimer(180);
      setOtp("");
      removeItem("timer");
    } catch (error: any) {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      if (newFailedAttempts >= 3) {
        setShowFailedAlert(true);
        setShowWrongCodeAlert(false); // Don't show the wrong code alert when we show the failed attempts alert
      } else {
        setShowWrongCodeAlert(true);
        error &&
          error?.response?.data?.errors.map((err: any, inx: any) =>
            toast({
              itemID: inx,
              title: err?.name ?? "",
              description: err.reason ?? "Somthing went wrong, Try Again",
              variant: "destructive",
            })
          );
      }
      setIsActivating(false);
      setOtp(""); // Clear the form
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setOtp("");
    try {
      const resp = await resendVerifyEmail({
        Email: decodeURIComponent(email),
      });
      if (resp === true) {
        toast({
          title: "Verification email sent successfully",
        });
      }
      setShowAlert(true);
      setTimer(180);
      setItem("timer", (180).toString());
      setFailedAttempts(0);
      setShowFailedAlert(false);
      setShowWrongCodeAlert(false);
      setIsResending(false);
    } catch (error: any) {
      error &&
        error?.response?.data?.errors.map((err: any, inx: any) =>
          toast({
            itemID: inx,
            title: err.reason,
            variant: "destructive",
          })
        );
      setShowAlert(false);
      setTimer(0);
      setFailedAttempts(0);
      setShowFailedAlert(false);
      setShowWrongCodeAlert(false);
      setOtp("");
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (showWrongCodeAlert) {
      const timer = setTimeout(() => {
        setShowWrongCodeAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWrongCodeAlert]);

  if (isVerified && email) {
    return <VerifyEmailValid email={email} />;
  }

  return (
    <div className="w-full max-w-[90%] md:max-w-[620px] mx-auto space-y-6 flex flex-col justify-center p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold mb-2">
          First, let&apos;s verify your email...
        </h1>
        <p className="text-muted-foreground mb-4">
          We&apos;ve sent an email to{" "}
          <strong>{decodeURIComponent(email)}</strong> with instructions to get
          you started. You should see it soon in your inbox!
        </p>
      </div>

      {showAlert && (
        <Alert className="my-6">
          <Mail className="h-4 w-4" />
          <AlertTitle className="font-semibold mb-2">
            Please check your inbox.
          </AlertTitle>
          <AlertDescription>
            Activation email has been resent to{" "}
            <span className="font-semibold text-[#15803d]">
              {decodeURIComponent(email)}.
            </span>{" "}
            If you don't see it, please check your spam folder.
          </AlertDescription>
        </Alert>
      )}

      {showFailedAlert && (
        <Alert variant="destructive" className="my-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold mb-2">
            Activation Failed
          </AlertTitle>
          <AlertDescription>
            You've attempted to activate your account 3 times unsuccessfully.
            Please resend the activation email, or use the quick activation
            link.
          </AlertDescription>
        </Alert>
      )}

      {/* {showWrongCodeAlert && (
        <Alert variant="destructive" className="my-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold mb-2">Incorrect Code</AlertTitle>
          <AlertDescription>
            The code you entered is incorrect. Please try again or request a new
            code.
          </AlertDescription>
        </Alert>
      )} */}

      <div className="space-y-4 mt-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Quick Activation:</h2>
          <p className="text-sm text-muted-foreground">
            If you're in a hurry, simply click on the "Activate Your Account"
            link we included in the email.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Manual Entry:</h2>
          <p className="text-sm text-muted-foreground">
            If you'd rather not click links, no problem. Just type in the
            6-digit code we provided in the email:
          </p>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex items-center justify-center space-x-4">
              <InputOTP
                value={otp}
                onChange={handleOTPChange}
                maxLength={6}
                className="flex justify-center w-full"
                inputMode="numeric"
                pattern="[0-9]+"
              >
                <InputOTPGroup>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <InputOTPSlot key={index + 3} index={index + 3} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <p className="text-sm text-center !mt-6">
              Time Remaining:{" "}
              {/*  to avoid hydration mismatch warning by adding suppressHydrationWarning */}
              <span className="text-orange-600" suppressHydrationWarning>
                {timer ? formatTime(timer) : "00:00"}
              </span>
            </p>
          </form>
        </div>
      </div>

      <div className="flex mt-10 flex-col w-full sm:flex-row gap-2 items-center">
        <Button
          variant="secondary"
          className="text-sm w-full sm:w-1/2"
          onClick={handleResendEmail}
          disabled={timer !== 0 ? true : false}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Resend activation email"
          )}
        </Button>
        <Button
          // type="submit"
          onClick={handleSubmit}
          className="w-full sm:w-1/2"
          disabled={
            timer === 0 ||
            isActivating ||
            otp.length !== 6 ||
            failedAttempts >= 3
          }
        >
          {isActivating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Activate Account"
          )}
        </Button>
      </div>

      <div className="flex justify-end mt-3">
        <span className="mr-1 text-xs font-thin text-muted-foreground">
          Back to
        </span>
        <Link
          href="/login"
          className="text-xs text-[#15803d] font-thin hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default withStepGuard(AccountActivation);
