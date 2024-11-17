import React from "react";

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="w-full h-full px-2">{children}</div>
    </>
  );
};

export default OrganizationIdLayout;
