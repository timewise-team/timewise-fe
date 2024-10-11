import CustomDialog from "@/components/custom-dialog";
import FormInput from "@/components/form/form-input";
import { Label } from "@/components/ui/label";
import React from "react";

const InviteMember = () => {
  return (
    <CustomDialog
      title={"Invite to workspace"}
      description={
        "Boost your productivity by making it easier for everyone to access boards in one location."
      }
      btnSubmitContent="Invite"
      btnContentIcon={"Invite Member"}
    >
      <div className="flex flex-row items-center space-x-2 ">
        <Label htmlFor="Email" className="text-right">
          Email
        </Label>
        <FormInput id="email" className="w-full" />
      </div>
    </CustomDialog>
  );
};

export default InviteMember;
