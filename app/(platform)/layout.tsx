import React from "react";
import { Toaster } from "sonner";
interface Props {
  children: React.ReactNode;
}

const PlatformLayout = ({ children }: Props) => {
  return (
    <div className="w-full h-full">
      <Toaster />
      {children}
    </div>
  );
};

export default PlatformLayout;
