/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface Props {
  session: any;
}

export const MENU_ITEMS = [
  {
    icon: User,
    label: "Manage Account",
    shortcut: "⇧⌘M",
    href: "/manage-profile",
  },
];



const MenuAccountList = ({ session }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white hover:bg-white">
          <Image
            src={session?.user?.picture || "/images/icons/google.svg"}
            alt={session?.user?.name || ""}
            width={24}
            height={24}
            className="w-8 h-8 rounded-full cursor-pointer"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-2">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <div className="flex flex-row space-x-2">
          <Image
            src={session?.user?.image || "/images/icons/google.svg"}
            alt={session?.user?.name || ""}
            width={24}
            height={24}
            className="w-8 h-8 rounded-full cursor-pointer"
          />
          <div className="flex flex-col items-start">
            <div className="text-sm">{session.user.name}</div>
            <div className="text-sm">{session.user.email}</div>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {MENU_ITEMS.map((item, index) => (
            <Link href={item.href} key={index} passHref>
              <DropdownMenuItem className="cursor-pointer">
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
                {item.shortcut && (
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuItem>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            Sign Out
          </form>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuAccountList;
