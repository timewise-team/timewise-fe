/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/types/Board";
import React from "react";
import { Button } from "../ui/Button";
import { Trash } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useCardModal } from "@/hooks/useCardModal";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCardByCardID } from "@/lib/fetcher";

interface Props {
  organizationId: string;
  data: any;
}

const Actions = ({ organizationId, data }: Props) => {
  const cardModal = useCardModal();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const DeleteCard = useMutation<
    Card,
    string,
    { schedule_id: string | undefined; session: any }
  >({
    mutationFn: ({ schedule_id, session }) =>
      deleteCardByCardID(
        { schedule_id, organizationId: organizationId },
        session
      ),
    onSuccess: () => {
      toast.success(`Card deleted!`);
      cardModal.onClose();
      queryClient.invalidateQueries({
        queryKey: ["listBoardColumns", organizationId],
      });
    },
  });

  const onDelete = () => {
    DeleteCard.mutate({
      schedule_id: data.id,
      session,
    });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        variant={"primary"}
        size={"sm"}
        onClick={onDelete}
        className="w-full justify-start"
      >
        <Trash className="h-4 w-4 mr-2" /> Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2 ">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};

export default Actions;
