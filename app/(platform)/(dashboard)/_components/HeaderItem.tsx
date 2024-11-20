"use client";

import * as React from "react";
import { ListItem } from "@components/header/list-item";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";

// Create a list of navigation lists with default items
export const NAVIGATION_LIST = [
    {
        title: "Home",
        href: `/organization/calender`,
    },
    {
                title: "Manage Workspaces",
                href: `/manage-workspaces/all`,
    },
];

const MenuNavbar = () => {

    return (
        <NavigationMenu className="md:block hidden z-[5] m750:max-w-[300px]">
            <NavigationMenuList className="m750:max-w-[300px]">
                {/* Render the Home section */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <a
                            href={NAVIGATION_LIST[0].href}
                            className="block text-text font-heading text-md font-bold p-3 hover:bg-accent hover:rounded-md"
                        >
                            {NAVIGATION_LIST[0].title}
                        </a>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Render the Workspaces section */}
                <NavigationMenuItem>
                    {/* Render "Manage Workspaces" directly as an anchor link */}
                    <NavigationMenuLink asChild>
                        <a
                            href={NAVIGATION_LIST[1].href}
                            className="block text-text font-heading text-md font-bold p-3 hover:bg-accent hover:rounded-md"
                        >
                            {NAVIGATION_LIST[1].title}
                        </a>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default MenuNavbar;
