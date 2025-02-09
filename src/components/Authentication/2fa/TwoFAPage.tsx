import LeftAuthComponent from "@/components/Authentication/commoncomponent/LeftAuthComponent";
import Generate2FA from "./TwoFactorResponse";

function TwoFAPage() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <LeftAuthComponent
        title="Verify Your Identity"
        description="Scan Qr and Enter the 6-digit authentication code generated by your authenticator app to confirm your identity and proceed. This secure step ensures that only you have access to your account."
      />
      <Generate2FA />
    </div>
  );
}

export default TwoFAPage;
