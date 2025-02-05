import { MessageLogComponent } from "@/components/messaging/MessageLogComponent";
import { PageHeader } from "@/components/page-header";
export default function MessagePage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Messaging Insights"
        subtitle="Review and Analyze your sms/mms activity"
      />
      <MessageLogComponent />
    </div>
  );
}
