/* eslint-disable */
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import React, {
  ElementRef,
  KeyboardEventHandler,
  forwardRef,
  useRef,
} from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface Props {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
}

export const CardForm = forwardRef<HTMLTextAreaElement, Props>(
  ({ listId, enableEditing, disableEditing, isEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

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

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = params.boardId as string;

      //   execute({ title, listId, boardId });
    };

    return (
      <div className="pt-2 px-2">
        <Button
          size={"sm"}
          variant={"ghost"}
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
        >
          <Plus className={"h-4 w-4 mr-2"} />
        </Button>
      </div>
    );
  }
);

export default CardForm;
