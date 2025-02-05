import { PageHeader } from "@/components/page-header";
import VoiceMainComponent from "@/components/voice";

export default function MessagePage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Voice Log Review"
        subtitle="Detailed Insights into Your Calls"
      />
      <VoiceMainComponent />
    </div>
  );
}
