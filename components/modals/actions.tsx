import { deleteCard } from "@/actions/delete-card";
import { useAction } from "@/hooks/useAction";
import { useCardModal } from "@/hooks/useCardModal";
import { Card, CardWithList } from "@/types/Board";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Trash } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface Props {
  data: CardWithList;
}

const Actions = ({ data }: Props) => {
  const params = useParams();
  const cardModal = useCardModal();

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data: Card) => {
        toast.success(`Card "${data.title}" deleted!`);
        cardModal.onClose();
      },
      onError: (error: string) => {
        toast.error(error);
      },
    }
  );

  const onDelete = () => {
    const boardId = params.boardId as string;
    executeDeleteCard({
      id: data.id,
      boardId,
    });
  };
  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        variant={"primary"}
        size={"sm"}
        onClick={onDelete}
        disabled={isLoadingDelete}
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
