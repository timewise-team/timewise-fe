import { EnrichedSession } from "@/auth";
import { ModalProvider } from "@/components/provider/modal-provider";
import { QueryProvider } from "@/components/provider/querry-provider";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Toaster } from "sonner";
interface Props {
  children: React.ReactNode;
  session: EnrichedSession;
}

const PlatformLayout = ({ children, session }: Props) => {
  return (
    <div className="w-full h-full">
      <SessionProvider session={session}>
        <QueryProvider>
          <Toaster />
          <ModalProvider />
          {children}
        </QueryProvider>
      </SessionProvider>
    </div>
  );
};

export default PlatformLayout;
