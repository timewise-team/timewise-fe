"use client";
import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const OrgControl = () => {
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) {
      return;
    }
    setActive({
      organization: params.organizationId as string,
    }); 
  }, [setActive, params]);

  return (
    <>
      <div>OrgControl</div>
    </>
  );
};

export default OrgControl;
