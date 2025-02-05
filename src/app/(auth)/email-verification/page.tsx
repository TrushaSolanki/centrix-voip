import VerifyEmailLinkLayout from "@/components/Authentication/EmailVerification/verify-email-link-layout";
import { Suspense } from "react";

function EmailVerifyLinkPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailLinkLayout />{" "}
    </Suspense>
  );
}

export default EmailVerifyLinkPage;
