"use client";
import { cn } from "@/lib/utils";
import { AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Activity, CalendarHeart, Layout, Settings } from "lucide-react";
import { AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { Workspace } from "@/types/Board";

interface Props {
  isExpanded: boolean;
  isActive: boolean;
  workspace: Workspace;
  onExpand: (id: string) => void;
}

const NavItem = ({ isExpanded, isActive, workspace, onExpand }: Props) => {
  const router = useRouter();
  const pathName = usePathname();

  const routers = [
    {
      label: "Boards",
      icon: <Layout className="h-4 w-4 mr-2" />,
      href: `/organization/${workspace.ID}`,
    },
    {
      label: "Activity",
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: `/organization/${workspace.ID}/activity`,
    },
    {
      label: "Calendar",
      icon: <CalendarHeart className="h-4 w-4 mr-2" />,
      href: `/organization/${workspace.ID}/calender`,
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: `/organization/${workspace.ID}/settings`,
    },
  ];

  const onClick = (href: string) => {
    router.push(href);
  };

  return (
    <AccordionItem value={String(workspace.ID)} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(String(workspace.ID))}
        className={cn(
          "w-full flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
          isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-7 h-7 relative">
            <Image
              fill
              src={"/images/1.jpg"}
              alt="organization"
              className="rounded-sm object-cover"
            />
          </div>
          <span className="font-medium text-sm">{workspace.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700">
        {routers.map((route) => (
          <Button
            key={route.href}
            size="sm"
            onClick={() => onClick(route.href)}
            className={cn(
              "w-full font-normal justify-start pl-10 mb-1",
              pathName === route.href && "bg-sky-500/10 text-sky-700"
            )}
            variant="ghost"
          >
            {route.icon}
            {route.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default NavItem;

NavItem.Skeleton = function SkeletonNavItem() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="w-10 h-10 relative shrink-0">
        <Skeleton className="w-full h-full absolute" />
      </div>
      <Skeleton className=" h-10 w-full" />
    </div>
  );
};
