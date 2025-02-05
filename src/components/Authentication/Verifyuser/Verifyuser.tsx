import React from "react";
import LeftAuthComponent from "../commoncomponent/LeftAuthComponent";
import OTP from "../commoncomponent/OtpForm";

const Verifyuser = () => {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <LeftAuthComponent
        title="Verify Your Identity"
        description="Enter the OTP sent to your registered mobile number to confirm your identity and proceed. This secure step ensures that only you have access to your account."
      />
      <OTP />
    </div>
  );
};

export default Verifyuser;
