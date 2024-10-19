/* eslint-disable */
import { CreateCard } from "@/actions/create-card/schema";
import FormSubmit from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/Button";
import { ListWithCards } from "@/types/Board";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, {
  ElementRef,
  KeyboardEventHandler,
  forwardRef,
  useRef,
} from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { z } from "zod";

interface Props {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
}

export const CardForm = forwardRef<HTMLTextAreaElement, Props>(
  ({ listId, enableEditing, disableEditing, isEditing }, ref) => {
    const params = useParams();
    const workspaceId = Number(params.organizationId);
    const formRef = useRef<ElementRef<"form">>(null);
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    //create card
    // const { execute, fieldErrors } = useAction(createCard, {
    //   onSuccess: (data) => {
    //     toast.success(`Card "${data.title}" created!`);
    //     formRef.current?.reset();
    //   },
    //   onError: (error) => {
    //     toast.error(error);
    //   },
    // });

    //create card using use mutation

    const { mutate } = useMutation({
      mutationFn: async (values: z.infer<typeof CreateCard>) => {
        const validatedFields = CreateCard.safeParse(values);
        if (!validatedFields.success) {
          throw new Error("Invalid fields");
        }
        const { title } = values;
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
              title: title,
              workspace_id: workspaceId,
              board_column_id: listId,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          toast.success(`Card "${title}" created successfully`);
        }
        console.log("data create card ", data);
        return data;
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          exact: true,
          queryKey: ["listBoardColumns", params.organizationId],
        });
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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        formRef.current?.requestSubmit();
      }
    };

    const handleSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;

      if (!title) {
        return;
      }

      mutate({
        title,
      });
      disableEditing();
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={handleSubmit}
          className="m-1 py-0.5 px-1 space-y-4 "
        >
          <FormTextarea
            id="title"
            onKeyDown={onTextareaKeyDown}
            ref={ref}
            placeholder="Enter a title for this card..."
          />
          <input hidden id="listId" name="listId" value={listId} />
          <div className="flex justify-between items-center gap-x-1">
            <FormSubmit>Add card</FormSubmit>
            <Button size={"sm"} variant={"ghost"} onClick={disableEditing}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2 ">
        <Button
          size={"sm"}
          variant={"ghost"}
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a Card
        </Button>
      </div>
    );
  }
);

export default CardForm;
