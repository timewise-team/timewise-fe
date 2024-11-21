import CustomDialog from "@/components/custom-dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import FormSubmit from "@/components/form/form-submit";
import { Input } from "@/components/ui/input";
import { CreateCard } from "@/actions/create-card/schema";
import { ListWithCards } from "@/types/Board";
import { Label } from "@/components/ui/label";

interface Props {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
}

const AddSchedule = ({ listId }: Props) => {
  const { data: session } = useSession();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const workspaceId = Number(params.organizationId);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof CreateCard>>({
    resolver: zodResolver(CreateCard),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const { mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof CreateCard>) => {
      const validatedFields = CreateCard.safeParse(values);
      if (!validatedFields.success) {
        throw new Error("Invalid fields");
      }
      const { title, description } = values;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.access_token}`,
            "X-User-Email": `${session?.user.email}`,
            "X-Workspace-ID": `${params.organizationId}`,
          },
          body: JSON.stringify({
            board_column_id: listId,
            description: description,
            title: title,
            workspace_id: workspaceId,
          }),
        }
      );
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success(`Schedule created successfully`);

      queryClient.invalidateQueries({
        exact: true,
        queryKey: ["listBoardColumns", params.organizationId],
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to create schedule. Please try again."
      );
    },

    onMutate: async (newListData) => {
      await queryClient.cancelQueries({
        exact: true,
        queryKey: ["listBoardColumns", params.organizationId],
      });

      const previousListBoardColumns = queryClient.getQueryData([
        "listBoardColumns",
        params.organizationId,
      ]);
      queryClient.setQueryData(
        ["listBoardColumns", params.organizationId],
        (old: ListWithCards[]) => [...old, newListData]
      );
      return { previousListBoardColumns };
    },
  });

  const handleSubmission = handleSubmit((values) => {
    startTransition(() => {
      mutate(values);
    });
  });

  return (
    <CustomDialog
      title={"Add new schedule"}
      description={
        "Create a new schedule and assign it to a specific board column."
      }
      btnSubmitContent="Create"
      btnContentIcon={"Add new schedule"}
    >
      <Form {...form}>
        <form onSubmit={handleSubmission}>
          <div className="flex flex-col w-full space-y-2">
            <div className="flex flex-col items-start justify-between space-y-2">
              <Label className="font-bold mb-2" htmlFor="title">
                Title
              </Label>
              <Input
                disabled={isPending}
                id="title"
                placeholder="Enter title for this schedule"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col items-start justify-between ">
              <Label className="font-bold mb-2" htmlFor="description">
                Description
              </Label>
              <Input
                disabled={isPending}
                id="description"
                placeholder="Enter description for this schedule"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <FormSubmit className="w-full mt-2">Add the schedule</FormSubmit>
        </form>
      </Form>
    </CustomDialog>
  );
};

export default AddSchedule;
