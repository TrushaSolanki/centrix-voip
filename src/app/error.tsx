"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div className="absolute w-full md:max-w-md lg:max-w-screen-lg left-1/2 top-1/2 p-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <div className={`rounded-full w-fit bg-red-600 p-4 text-center mx-auto mb-4`}>
        <X className="w-8 h-8 text-white" strokeWidth={3} />
      </div>
      <h1 className="text-3xl font-bold">Sorry something went wrong!</h1>
      <p className="text-base mt-6 mb-20">
        Error Message :<br />
        <span className=" text-red-600 break-words"> {error.message}</span>
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button
          onClick={() => router.push("/phone-numbers")}
          variant="secondary"
          size="lg"
          className="w-36"
        >
          Back
        </Button>
        <Button
          onClick={() => reset()}
          variant="default"
          size="lg"
          className="w-36"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
