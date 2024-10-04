/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import {
  Cloud,
  CreditCard,
  Keyboard,
  LifeBuoy,
  LogOut,
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

interface Props {
  session: any;
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
  { icon: LogOut, label: "Log out", shortcut: "⇧⌘Q" },
];

const MenuAccountList = ({ session }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white hover:bg-white">
          <img
            src={session?.user?.image || ""}
            alt="profile"
            className="w-6 h-6 rounded-full cursor-pointer"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {MENU_ITEMS.map((item, index) => (
            <DropdownMenuItem key={index} disabled={item.disabled}>
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && (
                <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuAccountList;
