import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyEmailValid({ email }: { email: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-7 text-center">
        <CheckCircle className="w-16 h-16 text-primary mx-auto" />
        <h1 className="text-3xl font-bold">Email Verified Successfully!</h1>
        <p className="text-xl text-muted-foreground">
          Thank you for verifying your email address: <strong>{email}</strong>
        </p>
        <p className="text-muted-foreground pb-6">
          Your account is now active and you can start using our services.
        </p>
        <Link className="mt-5" href="/login" passHref>
          <Button className="w-full">Continue to Login</Button>
        </Link>
      </div>
    </div>
  )
}