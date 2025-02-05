import { Card, CardContent } from "@/components/ui/card";
import { BadgeInfo } from "lucide-react";

export default function HomePage() {
  return (
    <div className="p-5">
      <h1 className="text-4xl font-normal py-4">Welcome, Victor</h1>
      <Card>
        <CardContent className="flex gap-4 p-4">
          <div>
            <BadgeInfo />
          </div>

          <div>
            Your account has been successfully created and is now awaiting
            internal confirmation. During this time, our team will review your
            details to ensure everything is set up correctly. This process may
            take some time, but we are working to activate your account as
            quickly as possible. While you wait, please note that you won’t be
            able to access any features just yet. Once your account is fully
            confirmed, you’ll receive a notification, and all services will be
            available to you. We appreciate your patience and understanding.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
