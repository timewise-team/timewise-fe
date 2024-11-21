"use client";
import ListContainer from "../../board/[boardId]/_components/ListContainer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { getBoardColumns } from "@/lib/fetcher";
import InviteMember from "./_components/InviteMember";

const OrganizationIdPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["listBoardColumns", params.organizationId],
    queryFn: async () => {
      const data = await getBoardColumns(params, session);
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

  if (isLoading) {
    return <div className="w-full h-full">Loading...</div>;
  }

  return (
    <div className="px-2 w-full mb-5">
      <div className=" relative bg-no-repeat bg-cover bg-center">
        <main className="relative space-y-1 h-full ">
          <InviteMember />
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
