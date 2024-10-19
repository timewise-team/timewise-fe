import React from "react";
import Info from "../_components/Info";
import { SelectSeparator } from "@/components/ui/select";
import ViewMember from "./_components/ViewMember";

const MemberPage = () => {
  return (
    <>
      <div className="w-full h-full justify-between">
        <Info />
        <SelectSeparator className="bg-black" />
        <ViewMember />
      </div>
    </>
  );
};

export default MemberPage;
