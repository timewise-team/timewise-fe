"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";

//create list of navigation list and list item inside each navigation list
export const NAVIGATION_LIST = [
  {
    title: "Workspaces",
    items: [
      {
        title: "Introduction",
        href: "https://ui.shadcn.com/docs",
        description:
          "Re-usable components built using Radix UI and Tailwind CSS.",
      },
      {
        title: "Installation",
        href: "https://ui.shadcn.com/docs/installation",
        description: "How to install dependencies and structure your app.",
      },
    ],
  },
  {
    title: "Components",
    items: [
      {
        title: "Button",
        href: "https://ui.shadcn.com/docs/button",
        description: "A button component with various styles and sizes.",
      },
      {
        title: "Input",
        href: "https://ui.shadcn.com/docs/input",
        description: "A text input component with various styles and sizes.",
      },
    ],
  },
  {
    title: "Guides",
    items: [
      {
        title: "Getting Started",
        href: "https://ui.shadcn.com/docs/getting-started",
        description: "Learn how to get started with the UI library.",
      },
      {
        title: "Customization",
        href: "https://ui.shadcn.com/docs/customization",
        description: "Customize the UI library to fit your needs.",
      },
    ],
  },
];

const MenuNavbar = () => {
  return (
    <NavigationMenu className="md:block hidden z-[5] m750:max-w-[300px]">
      <NavigationMenuList className="m750:max-w-[300px]">
        {NAVIGATION_LIST.map((list) => (
          <NavigationMenuItem key={list.title}>
            <NavigationMenuTrigger className="m750:max-w-[80px] m750:text-xs">
              <a className="block text-text font-heading text-md font-bold p-3">
                {list.title}
              </a>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[500px] gap-3 p-6 lg:grid-cols-[.75fr_1fr] m750:w-[300px]">
                {list.items.map((item) => (
                  <ListItem
                    key={item.title}
                    href={item.href}
                    title={item.title}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:rounded-md block text-text select-none space-y-1 rounded-base border-2 border-transparent p-3 leading-none no-underline outline-none transition-colors hover:border-border dark:hover:border-darkBorder",
            className
          )}
          {...props}
        >
          <div className="text-base font-heading leading-none">{title}</div>
          <p className="text-muted-foreground font-base line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default MenuNavbar;
