/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import FormInput from "@/components/form/form-input";
import React, { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import ListOptions from "./ListOptions";
import { List } from "@/types/Board";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { updateListBoardColumns } from "@/lib/fetcher";
import { Mailbox } from "lucide-react";

interface Props {
  data: List;
  onAddCard: () => void;
}

const ListHeader = ({ data, onAddCard }: Props) => {
  const { data: session } = useSession();
  const params = useParams();
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.name);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const workspaceId = Number(params.organizationId);
  const listId = Number(data.id);

  const position = queryClient.getQueryData([
    "maxPosition",
    params.organizationId,
  ]);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
    if (inputRef.current && inputRef.current.value !== title) {
      setTitle(inputRef.current.value);
    }
  };

  const updateListBoard = useMutation<
    List,
    string,
    { title: string; position: number; ID: number; workspaceId: number }
  >({
    mutationFn: ({ title, position, ID, workspaceId }) =>
      updateListBoardColumns(
        {
          title,
          position,
          ID,
          workspaceId,
        },
        session
      ),
    onSuccess: (data: List) => {
      toast.success(`Board "${data.name}" updated!`);
      queryClient.invalidateQueries({
        exact: true,
        queryKey: ["listBoardColumns", params.organizationId],
      });
      disableEditing();
    },
    onError: () => {
      toast.error("Failed to update Board. Please try again.");
    },
  });

  const onUpdate = () => {
    updateListBoard.mutate({
      title,
      position: position as number,
      ID: listId,
      workspaceId,
    });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };
  useEventListener("keydown", onKeyDown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form ref={formRef} onSubmit={onUpdate} className="flex-1 px-[2px]">
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="listId" name="listId" value={data.id} />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            placeholder="Enter list title..."
            defaltValue={title}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
          />
          <button type="submit" />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="flex flex-row items-center w-full text-sm px-2.5 py-1 h-7 font-bold border-transparent"
        >
          <Mailbox className="h-4 w-4 mr-2" />
          {data.name}
        </div>
      )}
      <ListOptions data={data} onAddCard={onAddCard} />
    </div>
  );
};

export default ListHeader;
