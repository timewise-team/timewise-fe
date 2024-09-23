/* eslint-disable */
"use client";
import { Accordion } from "@radix-ui/react-accordion";
import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import NavItem, { Organization } from "./NavItem";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { fakeData } from "../organization/[organizationId]/_components/Info";

interface Props {
  storageKey?: string;
}

const Sidebar = ({ storageKey = "t-sidebar-state" }: Props) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const defaultAccordingValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }
      return acc;
    },
    []
  );

  const onExpand = (id: string) => {
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id],
    }));
  };

  // if () {
  //   return (
  //     <>
  //       <div className="flex items-center justify-between mb-2">
  //         <Skeleton className="h-10 w-[50%]" />
  //         <Skeleton className="h-10 w-10" />
  //       </div>
  //       <div className="space-y-2">
  //         <NavItem.Skeleton />
  //         <NavItem.Skeleton />
  //         <NavItem.Skeleton />
  //       </div>
  //     </>
  //   );
  // }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4 font-bold text-lg">WorkSpaces</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto"
        >
          <Link href="select-org">
            <Plus className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordingValue}
        className="space-y-2"
      >
        {fakeData.map((organization) => (
          <NavItem
            key={organization.id}
            isActive={organization?.id === organization.id}
            isExpanded={expanded[organization.id]}
            organization={organization}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
    </>
  );
};

export default Sidebar;
