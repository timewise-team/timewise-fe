import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useAction } from "@/hooks/useAction";
import { Card, CardWithList } from "@/types/Board";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";
import { AlignLeft } from "lucide-react";
import { FormTextarea } from "../form/form-textarea";
import FormSubmit from "../form/form-submit";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/skeleton";

interface Props {
  data: CardWithList;
}

const Description = ({ data }: Props) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const [isEditing, setIsEditing] = useState(false);

  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data: Card) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id],
      });

      toast.success(`Card "${data.title}" updated!`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    const boardId = params.boardId as string;

    execute({ id: data.id, boardId, description });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              id={"description"}
              ref={textareaRef}
              className="w-full mt-2"
              placeholder="Add a more detailed description..."
              defaultValue={data.description || undefined}
              errors={fieldErrors}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size={"sm"}
                variant={"ghost"}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-s, font-medium py-3 px-3.5 rounded-md"
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
        <Skeleton className="h-[78px] w-full bg-neutral-200" />
      </div>
    </div>
  );
};
export default Description;
