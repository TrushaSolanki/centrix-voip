import LeftAuthComponent from "@/components/Authentication/commoncomponent/LeftAuthComponent";
import VerifyEmailForm from "@/components/Authentication/Register/verify-email-form";

function VerifyEmail() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <LeftAuthComponent
        title="Join us"
        description="Start streamlining your communication infrastructure today with powerful tools designed to enhance performance, simplify management, and give you full control over your operations."
      />
      <VerifyEmailForm />
    </div>
  );
}

export default VerifyEmail;
