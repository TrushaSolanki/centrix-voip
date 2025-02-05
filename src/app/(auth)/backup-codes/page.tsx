import BackupCode from "@/components/Authentication/BackupCode/BackupCode";
import LeftAuthComponent from "@/components/Authentication/commoncomponent/LeftAuthComponent";
import React from "react";

function page() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <LeftAuthComponent
        title="Backup Codes"
        description="Save/Download this emergency backup codes. When you don't have access to your
            Mobile, you can use this backup codes to sign in."
      />
      <BackupCode />
    </div>
  );
}

export default page;
