import React from "react";

interface Props {
  children: React.ReactNode;
}

const CalenderLayout = ({ children }: Props) => {
  return <div className="w-full h-full bg-white">{children}</div>;
};

export default CalenderLayout;
