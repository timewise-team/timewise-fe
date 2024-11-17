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
import { useLinkedEmails } from "@/hooks/useLinkedEmail";

interface Props {
  storageKey?: string;
}

const Sidebar = ({ storageKey = "t-sidebar-state" }: Props) => {
  const { data: session } = useSession();
  const { linkedEmails, isLoading: isEmailsLoading } = useLinkedEmails();
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const fetchWorkspaces = async (email: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace/get-workspaces-by-email/${email}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      }
    );
    const data = await response.json();
    return data.map((workspace: Workspace) => workspace);
  };

  const { data: workspacesByEmail, isLoading: isWorkspacesLoading } = useQuery({
    queryKey: ["workspaces", linkedEmails],
    queryFn: async () => {
      if (!linkedEmails) return {};
      const workspacesByEmail: Record<string, Workspace[]> = {};
      await Promise.all(
        linkedEmails.map(async (email: string) => {
          workspacesByEmail[email] = await fetchWorkspaces(email);
        })
      );
      return workspacesByEmail;
    },
    enabled: !!session && !!linkedEmails,
  });

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
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

  if (isEmailsLoading || isWorkspacesLoading) {
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
    <div className="space-y-2 h-[700px] overflow-auto pt-3">
      <div>
        <MenuSidebarAccount />
        <Separator />
        <Link href={"/organization/calender"}>
          <div className="font-medium text-xs flex items-center mb-1 hover:cursor-pointer hover:bg-gray-200">
            <span className="flex flex-row items-center gap-1 pl-4 font-bold text-lg">
              <CalendarRange className="w-4 h-4" />
              Calendar
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
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2 "
      >
        {Object.entries(workspacesByEmail || {}).map(([email, workspaces]) => (
          <div key={email}>
            <h2 className="pl-4 text-sm font-semibold text-gray-600">
              {email}
            </h2>
            {workspaces.map((workspace: Workspace, index: number) => (
              <NavItem
                key={index}
                workspace={workspace}
                onExpand={onExpand}
                isActive={expanded[workspace.ID]}
                isExpanded={false}
              />
            ))}
          </div>
        ))}
      </Accordion>
    </div>
  );
};

export default Sidebar;
