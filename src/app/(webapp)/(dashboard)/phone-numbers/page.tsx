import { PageHeader } from "@/components/page-header";
import PhoneNumber from "@/components/phoneNumber/PhoneNumber";

export default function PhoneNumberPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Active Numbers"
        subtitle="Overview of business phone numbers and capabilities"
      />
      <PhoneNumber />
    </div>
  );
}
