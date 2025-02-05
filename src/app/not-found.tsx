"use client";

// Replace your 'next/navigation' routers with next-nprogress-bar userouter. It's the same router, but this one supports NProgress.
import { useRouter } from 'next-nprogress-bar';

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="absolute left-1/2 top-1/2 p-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        404
      </span>
      <p className="text-slate-700 text-lg mt-6 mb-20">
        Sorry, the page you are looking for doesn&apos;t exist or has been
        moved.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button
          onClick={() => router.back()}
          variant="secondary"
          size="lg"
          className="w-36"
        >
          Go back
        </Button>
        <Button
          onClick={() => router.push("/")}
          variant="default"
          size="lg"
          className="w-36"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
