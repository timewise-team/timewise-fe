import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
interface Props {
  children: React.ReactNode;
}

const PlatformLayout = ({ children }: Props) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default PlatformLayout;
