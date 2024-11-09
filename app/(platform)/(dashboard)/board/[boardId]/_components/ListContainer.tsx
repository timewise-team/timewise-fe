/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { ListWithCards } from "@/types/Board";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import ListForm from "./ListForm";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { UpdateListOrder } from "@/actions/update-list-order/schema";

interface Props {
  data: ListWithCards[];
  boardId?: string;
}

export const UpdateCardOrder = z.object({
  board_column_id: z.number(),
  position: z.number(),
  cardId: z.number(),
});

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
}

export const updateBoardOrder = async (params: any, session: any) => {
  const validatedFields = UpdateListOrder.safeParse(params);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/board_columns/${params.boardId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        position: params.position,
      }),
    }
  );

  const data = await response.json();
  console.log("updateListBoardColumns", data);
  return data;
};

export const updateCardPosition = async (params: any, session: any) => {
  const validatedFields = UpdateCardOrder.safeParse(params);
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
        board_column_id: params.board_column_id,
        position: params.position,
      }),
    }
  );

  return response.json();
};

const ListContainer = ({ data }: Props) => {
  const { data: session } = useSession();
  const params = useParams();
  const [orderedData, setOrderedData] = useState(data);
  const queryClient = useQueryClient();

  const { mutate: updateBoardColumns } = useMutation({
    mutationFn: async (values: z.infer<typeof UpdateListOrder>) => {
      const validatedFields = UpdateListOrder.safeParse(values);
      if (!validatedFields.success) {
        throw new Error("Invalid fields");
      }
      const response = await updateBoardOrder(
        {
          position: values.position,
          boardId: params.boardId,
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
    mutationFn: async (values: z.infer<typeof UpdateCardOrder>) => {
      const validatedFields = UpdateCardOrder.safeParse(values);
      if (!validatedFields.success) {
        throw new Error("Invalid fields");
      }
      const response = await updateCardPosition(
        {
          cardId: values.cardId,
          board_column_id: values.board_column_id,
          position: values.position,
          organizationId: params.organizationId,
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
        position: destination.index,
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
        updateCardOrder({
          cardId: parseInt(result.draggableId),
          board_column_id: parseInt(source.droppableId),
          position: destination.index,
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
          cardId: parseInt(result.draggableId),
          board_column_id: parseInt(source.droppableId),
          position: destination.index,
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
