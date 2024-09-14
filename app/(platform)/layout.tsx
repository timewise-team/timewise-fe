import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
interface Props {
  children: React.ReactNode;
}

const PlatformLayout = ({ children }: Props) => {
  return <ClerkProvider afterSignOutUrl="/">{children}</ClerkProvider>;
};

export default PlatformLayout;
