/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import FormInput from "@/components/form/form-input";
import React, { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import ListOptions from "./ListOptions";
import { List } from "@/types/Board";
import { UpdateList } from "@/actions/update-list/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

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
  const listId = data.id;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/board_columns/${listId}`;

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

  //fetch update API
  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const values = {
  //     title,
  //   };

  //   try {
  //     const response = await fetch(url, {
  //       method: "PUT",
  //       headers: {
  //         Authorization: `Bearer ${session?.user.access_token}`,
  //         "X-User-Email": `${session?.user.email}`,
  //         "X-Workspace-ID": `${params.organizationId}`,
  //       },
  //       body: JSON.stringify({
  //         name: title,
  //         position: position,
  //         workspace_id: workspaceId,
  //       }),
  //     });

  //     const data = await response.json();
  //     console.log("Update successful:", data);
  //   } catch (error) {
  //     console.error("Error updating list:", error);
  //     toast.error("Error updating list");
  //   }
  // };

  const updateListBoardMutation = useMutation({
    mutationFn: async (values: z.infer<typeof UpdateList>) => {
      const validatedFields = UpdateList.safeParse(values);
      if (!validatedFields.success) {
        throw new Error("Invalid fields");
      }
      const { title } = values;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
          "X-User-Email": `${session?.user.email}`,
          "X-Workspace-ID": `${params.organizationId}`,
        },
        body: JSON.stringify({
          name: title,
          position: position,
          workspace_id: workspaceId,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success(`Board "${title}" updated successfully`);
      queryClient.invalidateQueries({
        exact: true,
        queryKey: ["listBoardColumns", params.organizationId],
      });
    },
    onError: (error) => {
      console.error("Error updating list:", error);
      toast.error("Error updating list");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      toast.error("Title is required");
      return;
    }

    updateListBoardMutation.mutate({
      title,
      listId: data.id,
    });
    disableEditing();
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
        <form ref={formRef} onSubmit={handleSubmit} className="flex-1 px-[2px]">
          <input
            hidden
            id="id"
            name="id"
            value={data.id}
            onChange={(e) => setTitle(e.target.value)}
          />
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
          className="w-full text-sm px-2.5 py-1 h-7 font-bold border-transparent"
        >
          {data.name}
        </div>
      )}
      <ListOptions data={data} onAddCard={onAddCard} />
    </div>
  );
};

export default ListHeader;
