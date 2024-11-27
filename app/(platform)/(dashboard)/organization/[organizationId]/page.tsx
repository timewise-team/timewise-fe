/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import ListContainer from "../../board/[boardId]/_components/ListContainer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import {
  fetchWorkspaceDetails,
  getBoardColumns,
  getMembersInWorkspace,
} from "@/lib/fetcher";
import InviteMember from "./_components/InviteMember";
import FilterPopover from "./_components/filter-popover";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import Image from "next/image";
import { Workspace } from "@/types/Board";
import { Skeleton } from "@/components/ui/skeleton";

const OrganizationIdPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [due, setDue] = useState<string>("");
  const [dueComplete, setDueComplete] = useState(false);
  const [overdue, setOverdue] = useState(false);
  const [notDue, setNotDue] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 1000);

  const { data: workspace } = useQuery<Workspace>({
    queryKey: ["workspaceDetails", params.organizationId],
    queryFn: () =>
      fetchWorkspaceDetails(params.organizationId as string, session),
    enabled: !!params.organizationId,
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "listBoardColumns",
      params.organizationId,
      {
        search: debouncedSearch,
        selectedMembers,
        due,
        dueComplete,
        overdue,
        notDue,
      },
    ],
    queryFn: async () => {
      const data = await getBoardColumns(
        {
          ...params,
          search: debouncedSearch,
          selectedMembers,
          due,
          dueComplete,
          overdue,
          notDue,
        },
        session
      );
      if (Array.isArray(data)) {
        const maxPosition = data.reduce(
          (max, item) => (item.position > max ? item.position : max),
          1
        );
        queryClient.setQueryData(
          ["maxPosition", params.organizationId],
          maxPosition
        );
      } else {
        queryClient.setQueryData(["maxPosition", params.organizationId], 1);
      }
      return data;
    },
    enabled: !!session,
  });

  const { data: listMembers } = useQuery({
    queryKey: ["listMembers", params.organizationId],
    queryFn: async () => {
      const data = await getMembersInWorkspace(params, session);
      return data;
    },
    enabled: !!session,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full p-4 space-y-4">
        <Skeleton className="h-6 rounded-md w-full" />
        <div className="flex">
          <Skeleton className="mr-4 w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-4 rounded-md w-full" />
            <Skeleton className="h-4 rounded-md w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 w-full mb-5 ">
      <div className=" relative bg-no-repeat bg-cover bg-center ">
        <main className="relative space-y-1 h-full ">
          <div className="flex flex-row items-center px-1 w-full bg-black bg-opacity-40 fixed backdrop-blur justify-start">
            <p className="font-bold text-white">{workspace?.title}</p>
            <div className="flex flex-row p-2 justify-end w-[75%] text-white items-center">
              <InviteMember />
              {listMembers?.slice(0, 3).map((participant: any, index: any) => (
                <Image
                  key={index}
                  src={participant.profile_picture}
                  alt={"avatar"}
                  width={20}
                  height={20}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ))}
              {listMembers && data?.length > 3 && (
                <span className="flex items-center justify-center h-4 w-4 rounded-full bg-black text-xs text-white  border-2 border-white">
                  +{data.length - 3}
                </span>
              )}
              <p className="text-white px-2">||</p>
            </div>

            <FilterPopover
              listMembers={listMembers}
              search={search}
              setSearch={setSearch}
              selectedMembers={selectedMembers}
              setSelectedMember={setSelectedMembers}
              due={due}
              setDue={setDue}
              dueComplete={dueComplete}
              setDueComplete={setDueComplete}
              overdue={overdue}
              setOverdue={setOverdue}
              notDue={notDue}
              setNotDue={setNotDue}
              isPopoverOpen={isPopoverOpen}
              setIsPopoverOpen={setIsPopoverOpen}
            />
          </div>
          <ListContainer
            data={Array.isArray(data) ? data : []}
            boardId={params.organizationId.toString()}
          />
        </main>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
