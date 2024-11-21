import React from "react";

const WorkspaceCalenderLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="w-full h-full">{children}</div>;
};

export default WorkspaceCalenderLayout;
