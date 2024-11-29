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
import { useStateContext } from "@/stores/StateContext";
import {useLinkedEmailsForManage} from "@/hooks/useLinkedEmailForManage";
import {getAccountInformationForSchedule} from "@/lib/fetcher";
import {useEffect, useState} from "react";

interface Props {
  storageKey?: string;
}

const Sidebar = ({ storageKey = "t-sidebar-state" }: Props) => {
  const { data: session } = useSession();
  const { setStateWorkspacesByEmail } = useStateContext();
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );
  const [status, setStatus] = useState<string>("linked");
  const { data: accountInfo, isLoading: isAccountLoading } = useQuery({
    queryKey: ["accountInformationForSchedule"],
    queryFn: async () => {
      if (!session) return null;
      return await getAccountInformationForSchedule(session);
    },
    enabled: !!session,
  });
  useEffect(() => {
    if (accountInfo?.email?.length > 0) {
      const emailStatus = accountInfo.email[0]?.status || "linked";
      setStatus(emailStatus);
    }
  }, [accountInfo]);
  if (status === "") {
    setStatus("linked");
  }
  const { linkedEmails, isLoading: isEmailsLoading } = useLinkedEmailsForManage(status);
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
      setStateWorkspacesByEmail(workspacesByEmail);
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
    <div className="space-y-2 h-full overflow-auto p-3 mr-0">
      <div>
        <MenuSidebarAccount />
        <Separator className="my-3" />
        <Link href={"/organization/calender"}>
          <div className="font-medium text-xs flex items-center mb-1 hover:cursor-pointer hover:bg-gray-200">
            <span className="flex items-center align-middle gap-1 font-semibold text-sm">
              <CalendarRange className="w-4 h-4" />
              Calendar
            </span>
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <span className="flex gap-1 items-center font-semibold text-sm">
            <Store className="w-4 h-4" /> Workspaces
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
            <h2 className="text-[10px] text-gray-600">{email}</h2>
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
