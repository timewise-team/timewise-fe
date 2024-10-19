"use client";
import ListContainer from "../../board/[boardId]/_components/ListContainer";
import BoardNavbar from "../../board/[boardId]/_components/BoardNavbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const OrganizationIdPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["listBoardColumns", params.organizationId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/board_columns/workspace/${params.organizationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
            "X-User-Email": `${session?.user.email}`,
            "X-Workspace-ID": `${params.organizationId}`,
          },
        }
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        const maxPosition = data.reduce(
          (max, item) => (item.position > max ? item.position : max),
          0
        );
        queryClient.setQueryData(
          ["maxPosition", params.organizationId],
          maxPosition + 1
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
    <div className="w-full mb-5">
      <div className=" relative bg-no-repeat bg-cover bg-center">
        <div className="absolute inset-0">
          <BoardNavbar data={[]} />
        </div>
        <main className="relative pt-5 h-full">
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
