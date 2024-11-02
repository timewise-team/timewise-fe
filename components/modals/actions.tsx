/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/types/Board";
import React from "react";
import { Button } from "../ui/Button";
import { Edit, Trash } from "lucide-react";
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

  // const UpdateCard = useMutation<
  //   Card,
  //   string,
  //   { cardId: string | undefined; session: any }
  // >({
  //   mutationFn: ({ cardId, session }) =>
  //     updateCardID({ cardId, organizationId: organizationId }, session),
  //   onSuccess: (data: Card) => {
  //     toast.success(`Card "${data.title}" updated!`);
  //     cardModal.onClose();
  //   },
  //   onError: () => {
  //     toast.error("Failed to update card. Please try again.");
  //   },
  // });

  // const { mutate } = useMutation({
  //   mutationFn: async (values: z.infer<typeof UpdateCard>) => {
  //     const validatedFields = UpdateCard.safeParse(values);
  //     if (!validatedFields.success) {
  //       throw new Error("Invalid fields");
  //     }
  //     const {
  //       all_day,
  //       board_column_id,
  //       description,
  //       end_time,
  //       extra_data,
  //       is_deleted,
  //       location,
  //       recurrence_pattern,
  //       start_time,
  //       status,
  //       title,
  //       video_transcript,
  //       visibility,
  //       workspace_id,
  //       workspace_user_id,
  //     } = values;

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace/update-workspace`, // Ensure this is the correct endpoint
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${session?.user.access_token}`,
  //         },
  //         body: JSON.stringify({
  //           all_day,
  //           board_column_id,
  //           description,
  //           end_time,
  //           extra_data,
  //           is_deleted,
  //           location,
  //           recurrence_pattern,
  //           start_time,
  //           status,
  //           title,
  //           video_transcript,
  //           visibility,
  //           workspace_id,
  //           workspace_user_id,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorResult = await response.json();
  //       throw new Error(errorResult.error || "Failed to update workspace");
  //     }

  //     const result = await response.json();
  //     return result;
  //   },
  // });

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
        exact: true,
        queryKey: ["listBoardColumns", organizationId],
      });
    },
  });

  const onDelete = () => {
    DeleteCard.mutate({
      schedule_id: data.ID,
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
      <Button
        variant={"primary"}
        size={"sm"}
        onClick={onDelete}
        className="w-full justify-start"
      >
        <Edit className="h-4 w-4 mr-2" /> Update
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
