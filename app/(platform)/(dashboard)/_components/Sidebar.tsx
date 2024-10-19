/* eslint-disable */
"use client";
import { Accordion } from "@radix-ui/react-accordion";
import { useLocalStorage } from "usehooks-ts";
import NavItem from "./NavItem";
import CreateDialog from "./CreateWorkspaceDialog";
import { CalendarRange, Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import MenuSidebarAccount from "./MenuSidebarAccount";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Workspace } from "@/types/Board";
interface Props {
  storageKey?: string;
}

const Sidebar = ({ storageKey = "t-sidebar-state" }: Props) => {
  const { data: session } = useSession();
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const { data, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace/get-workspaces-by-email/${session?.user.email}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        }
      );
      const data = await response.json();
      const workspaces = data.map((workspace: Workspace) => workspace);
      return workspaces;
    },
    enabled: !!session,
  });

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

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <MenuSidebarAccount />
        <Separator />
        <Link href={"/organization/calender"}>
          <div className="font-medium text-xs flex items-center mb-1 hover:cursor-pointer hover:bg-gray-200">
            <span className="flex flex-row items-center gap-1 pl-4 font-bold text-lg ">
              <CalendarRange className="w-4 h-4" />
              Calender
            </span>
          </div>
        </Link>
        <div className="font-medium text-xs flex items-center mb-1">
          <span className="flex flex-row gap-1 items-center pl-4 font-bold text-lg">
            <Store className="w-4 h-4" />
            Workspaces
          </span>
          <CreateDialog />
        </div>
        <Accordion
          type="multiple"
          defaultValue={defaultAccordingValue}
          className="space-y-2"
        >
          {data?.map((workspace: Workspace, index: number) => (
            <NavItem
              key={index}
              workspace={workspace}
              onExpand={onExpand}
              isActive={expanded[workspace.ID]}
              isExpanded={false}
            />
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default Sidebar;
