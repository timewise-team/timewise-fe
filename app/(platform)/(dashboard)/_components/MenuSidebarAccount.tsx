/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import Info from "../organization/[organizationId]/_components/Info";
import { useSession } from "next-auth/react";
import { EnrichedSession } from "@/auth";

const MenuSidebarAccount = () => {
  const { data: session } = useSession();
  const enrichedSession = session as EnrichedSession;

  const getAllLinkedEmail = async () => {
    if (enrichedSession && enrichedSession.accessToken) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user_emails/get-linked-email`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${enrichedSession.accessToken}`,
            },
          }
        );
        const data = await response.json();
        console.log("data:", data);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Access token is not available");
    }
  };

  useEffect(() => {
    getAllLinkedEmail();
  }, [enrichedSession]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white hover:bg-white">
          <Info />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Linked Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>{/* show link email */}</DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuSidebarAccount;
