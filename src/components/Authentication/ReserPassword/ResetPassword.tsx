import React from "react";
import LeftAuthComponent from "../commoncomponent/LeftAuthComponent";
import PasswordResetForm from "./PasswordResetForm";

const ResetPassword = () => {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <LeftAuthComponent
        title="Need Help with Your Password?"
        description="If you've forgotten your password, don’t worry! Simply enter your registered email address, and we will send you instructions to reset your password. Make sure to check your spam folder if you don’t see the email in your inbox."
      />
     <PasswordResetForm/>
    </div>
  );
};

export default ResetPassword;
