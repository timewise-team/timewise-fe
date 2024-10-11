/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Cloud,
  CreditCard,
  Keyboard,
  LifeBuoy,
  Plus,
  Settings,
  User,
  Users,
} from "lucide-react";
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
import { EnrichedSession } from "@/auth";
import Image from "next/image";
import { signOut } from "next-auth/react";

interface Props {
  session: EnrichedSession;
}

export const MENU_ITEMS = [
  { icon: User, label: "Profile", shortcut: "⇧⌘P" },
  { icon: CreditCard, label: "Billing", shortcut: "⌘B" },
  { icon: Settings, label: "Settings", shortcut: "⌘S" },
  { icon: Keyboard, label: "Keyboard shortcuts", shortcut: "⌘K" },
  { icon: Users, label: "Team" },
  { icon: Plus, label: "New Team", shortcut: "⌘+T" },
  { icon: LifeBuoy, label: "Support" },
  { icon: Cloud, label: "API", disabled: true },
];

const MenuAccountList = ({ session }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white hover:bg-white">
          <Image
            src={session?.user?.image || "/images/icons/google.svg"}
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
            <DropdownMenuItem
              className="cursor-pointer"
              key={index}
              disabled={item.disabled}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && (
                <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
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
