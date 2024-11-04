/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useLinkedEmails } from "@/hooks/useLinkedEmail";

const MenuSidebarAccount = () => {
  const { linkedEmails, isLoading } = useLinkedEmails();

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </>
    );
  }

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
          {(Array.isArray(linkedEmails) ? linkedEmails : []).map(
            (email: any, index: number) => (
              <React.Fragment key={index}>
                <div className="flex flex-row gap-x-2 items-center">
                  <Image
                    width={24}
                    height={24}
                    src={"/images/icons/google.svg"}
                    alt={"logo"}
                    className="rounded-md object-cover hover:cursor-pointer"
                  />
                  <DropdownMenuItem className="cursor-pointer">
                    {email}
                  </DropdownMenuItem>
                </div>
              </React.Fragment>
            )
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuSidebarAccount;
