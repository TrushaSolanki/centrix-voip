"use client";
import React, { useRef, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const OTP = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (index: number) => {
    if (otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const otpInput = "";

  return (
    <div className="w-full max-w-[90%] md:max-w-[620px] mx-auto space-y-6 flex flex-col justify-center  p-6 ">
      <h1 className="font-semibold text-2xl mt-7">OTP Verification</h1>
      <p className="font-thin mt-2 text-muted-foreground">
        Enter the verification code sent via SMS to your mobile number ending in
        +1*****9786.
      </p>
      <div className="flex flex-row gap-2 justify-center mt-10">
        {/* {otp.map((value, index) => (
          <Input
            key={index}
            // ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => {
              if (e.key === "Backspace") handleBackspace(index);
            }}
            className="text-center text-lg w-12 h-12 border-2 border-black"
          />
        ))} */}
        <InputOTP maxLength={6} inputMode="numeric" pattern="[0-9]+">
          <InputOTPGroup>
            <InputOTPSlot index={0} className={otpInput} />
            <InputOTPSlot index={1} className={otpInput} />
            <InputOTPSlot index={2} className={otpInput} />
            <InputOTPSlot index={3} className={otpInput} />
            <InputOTPSlot index={4} className={otpInput} />
            <InputOTPSlot index={5} className={otpInput} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="mt-4">
        <Button type="submit" className="w-full mt-4">
          Verify Code
        </Button>
      </div>
      <div className="mt-4 flex justify-between text-muted-foreground">
        <p className="text-xs font-thin text-accent-foreground ">
          This code will expire in 5:17{" "}
          <span
            className="text-xs font-thin text-muted-foreground cursor-pointer"
            onClick={() => {}}
          >
            Resend
          </span>
        </p>

        <div className="flex justify-end">
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
    </div>
  );
};

export default OTP;
