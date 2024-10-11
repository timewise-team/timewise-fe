/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import Info from "../organization/[organizationId]/_components/Info";
import { useSession } from "next-auth/react";

const MenuSidebarAccount = () => {
  const { data: session } = useSession();

  const [linkedEmails, setLinkedEmails] = useState<string[]>([]);

  const getAllLinkedEmail = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user_emails/get-linked-email`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        }
      );
      const data = await response.json();
      const linkedEmails = data.map((email: any) => email.email);
      setLinkedEmails(linkedEmails);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (session) {
      getAllLinkedEmail();
    }
  }, [session]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white hover:bg-white text-black">
          <Info />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Linked Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {linkedEmails &&
            linkedEmails.map((email) => (
              <div key={email} className="flex flex-row gap-x-2 items-center">
                <Image
                  src={session?.user?.image || "/images/icons/google.svg"}
                  alt={session?.user?.name || ""}
                  width={24}
                  height={24}
                  className="w-4 h-4 rounded-full cursor-pointer "
                />
                <DropdownMenuItem className="cursor-pointer">
                  {email}
                </DropdownMenuItem>
              </div>
            ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuSidebarAccount;
