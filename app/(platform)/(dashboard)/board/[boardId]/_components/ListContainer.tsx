/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { ListWithCards } from "@/types/Board";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import ListForm from "./ListForm";
import { UpdateList } from "@/actions/update-list/schema";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

interface Props {
  data: ListWithCards[];
  boardId?: string;
}

export const UpdateCard = z.object({
  all_day: z.boolean(),
  board_column_id: z.number(),
  description: z.string(),
  end_time: z.string(),
  extra_data: z.string(),
  is_deleted: z.boolean(),
  location: z.string(),
  position: z.number(),
  priority: z.string(),
  recurrence_pattern: z.string(),
  start_time: z.string(),
  status: z.string(),
  title: z.string(),
  video_transcript: z.string(),
  visibility: z.string(),
  workspace_id: z.number(),
  workspace_user_id: z.number(),
});

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
}

export const updateListBoardColumns = async (params: any, session: any) => {
  const validatedFields = UpdateList.safeParse(params);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/board_columns/${params.ID}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: params.name,
        position: params.position,
        workspace_id: params.workspaceId,
      }),
    }
  );

  const data = await response.json();
  console.log("updateListBoardColumns", data);
  return data;
};

export const updateCard = async (params: any, session: any) => {
  const validatedFields = UpdateCard.safeParse(params);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedules/${params.cardId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        all_day: params.all_day,
        board_column_id: params.board_column_id,
        description: params.description,
        end_time: params.end_time,
        extra_data: params.extra_data,
        is_deleted: params.is_deleted,
        location: params.location,
        position: params.position,
        priority: params.priority,
        recurrence_pattern: params.recurrence_pattern,
        start_time: params.start_time,
        status: params.status,
        title: params.title,
        video_transcript: params.video_transcript,
        visibility: params.visibility,
        workspace_id: params.workspace_id,
        workspace_user_id: params.workspace_user_id,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update card");
  }

  return response.json();
};

const ListContainer = ({ data }: Props) => {
  const { data: session } = useSession();
  const params = useParams();
  const [orderedData, setOrderedData] = useState(data);
  const queryClient = useQueryClient();

  const { mutate: updateBoardColumns } = useMutation({
    mutationFn: async (values: z.infer<typeof UpdateList>) => {
      const validatedFields = UpdateList.safeParse(values);
      if (!validatedFields.success) {
        throw new Error("Invalid fields");
      }
      const response = await updateListBoardColumns(
        {
          name: values.name,
          position: values.position,
          workspaceId: values.workspace_id,
          organizationId: params.organizationId,
        },
        session
      );
      return response;
    },
    onSuccess: () => {
      toast.success("List updated successfully");
      queryClient.invalidateQueries({ queryKey: ["listBoardColumns"] });
    },
    onError: () => {
      toast.error("Error when updating list");
    },
  });

  const { mutate: updateCardOrder } = useMutation({
    mutationFn: async (values: z.infer<typeof UpdateCard>) => {
      const validatedFields = UpdateCard.safeParse(values);
      if (!validatedFields.success) {
        throw new Error("Invalid fields");
      }
      const response = await updateCard(
        {
          all_day: values.all_day,
          board_column_id: values.board_column_id,
          description: values.description,
          end_time: values.end_time,
          extra_data: values.extra_data,
          is_deleted: values.is_deleted,
          location: values.location,
          position: values.position,
          priority: values.priority,
          recurrence_pattern: values.recurrence_pattern,
          start_time: values.start_time,
          status: values.status,
          title: values.title,
        },
        session
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Card updated successfully");
      queryClient.invalidateQueries({ queryKey: ["listBoardColumns"] });
    },
    onError: () => {
      toast.error("Error when updating card");
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      updateBoardColumns({
        name: items[destination.index].name,
        position: destination.index,
        workspace_id: items[destination.index].workspaceId,
      });
    }

    if (type === "card") {
      const newOrderedData = [...orderedData];

      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      if (!destList.cards) {
        destList.cards = [];
      }

      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, idx) => {
          if (card) {
            card.position = idx;
          }
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        //update card in here
        updateCardOrder({
          all_day: reorderedCards[destination.index].all_day,
          board_column_id: reorderedCards[destination.index].board_column_id,
          description: reorderedCards[destination.index].description,
          end_time: reorderedCards[destination.index].end_time,
          extra_data: reorderedCards[destination.index].extra_data,
          is_deleted: reorderedCards[destination.index].is_deleted,
          location: reorderedCards[destination.index].location,
          position: reorderedCards[destination.index].position,
          priority: reorderedCards[destination.index].priority,
          recurrence_pattern:
            reorderedCards[destination.index].recurrence_pattern,
          start_time: reorderedCards[destination.index].start_time,
          status: reorderedCards[destination.index].status,
          title: reorderedCards[destination.index].title,
          video_transcript: reorderedCards[destination.index].video_transcript,
          visibility: reorderedCards[destination.index].visibility,
          workspace_id: reorderedCards[destination.index].workspace_id,
          workspace_user_id:
            reorderedCards[destination.index].workspace_user_id,
        });
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        movedCard.board_column_id = destination.droppableId;

        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.position = idx;
        });

        destList.cards.forEach((card, idx) => {
          card.position = idx;
        });

        setOrderedData(newOrderedData);
        updateCardOrder({
          all_day: movedCard.all_day,
          board_column_id: movedCard.board_column_id,
          description: movedCard.description,
          end_time: movedCard.end_time,
          extra_data: movedCard.extra_data,
          is_deleted: movedCard.is_deleted,
          location: movedCard.location,
          position: movedCard.position,
          priority: movedCard.priority,
          recurrence_pattern: movedCard.recurrence_pattern,
          start_time: movedCard.start_time,
          status: movedCard.status,
          title: movedCard.title,
          video_transcript: movedCard.video_transcript,
          visibility: movedCard.visibility,
          workspace_id: movedCard.workspace_id,
          workspace_user_id: movedCard.workspace_user_id,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className=" flex flex-col sm:flex-row gap-y-3 sm:gap-x-3 h-auto sm:h-full w-full"
          >
            {orderedData.map((list, index) => {
              if (!list.id) {
                return null;
              }
              return (
                <ListItem key={list.id.toString()} index={index} data={list} />
              );
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
