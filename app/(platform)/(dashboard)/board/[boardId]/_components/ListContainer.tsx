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
import { updateBoardOrder, updateCardPosition } from "@/lib/fetcher";
import { UpdateCardOrder } from "@/actions/update-card-order/schema";

interface Props {
  data: ListWithCards[];
  boardId?: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
}

const ListContainer = ({ data }: Props) => {
  const { data: session } = useSession();
  const params = useParams();
  const [orderedData, setOrderedData] = useState(data);
  const queryClient = useQueryClient();

  const boardColumnsId = data.map((item) => item.id);

  const { mutate: updateBoardColumns } = useMutation({
    mutationFn: async (values: z.infer<typeof UpdateListOrder>) => {
      const validatedFields = UpdateListOrder.safeParse(values);
      if (!validatedFields.success) {
        throw new Error("Invalid fields");
      }

      const response = await updateBoardOrder(
        {
          position: values.position + 1,
          board_column_id: boardColumnsId.find(
            (item) => item === orderedData[values.position].id
          ),
          organizationId: params.organizationId,
        },
        session
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Board reordered !");
      queryClient.invalidateQueries({ queryKey: ["listBoardColumns"] });
    },
    onError: () => {
      toast.error("Error when updating board");
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
      toast.success("Card reordered !");
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

    if (typeof result.draggableId === "number") {
      result.draggableId = result.draggableId.toString();
    }

    // If Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If User moves a Card
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      updateBoardColumns({
        position: destination.index + 1,
      });
    }

    if (type === "card") {
      const newOrderedData = [...orderedData];

      // Source and Destination List
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // Check if cards exist on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if Cards exist on the destinationList
      if (!destList.cards) {
        destList.cards = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        // Update the position of each card in the reordered list
        reorderedCards.forEach((card, idx) => {
          if (card) {
            card.position = idx + 1; // Ensure position starts from 1
          }
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        updateCardOrder({
          board_column_id: parseInt(destination.droppableId),
          position: destination.index + 1,
          cardId: parseInt(result.draggableId),
        });

        // User moves the cards to another list
      } else {
        // Remove card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        if (!movedCard) {
          console.error("Moved card not found");
          return;
        }

        // Assign the new listId to the moved card
        movedCard.board_column_id = parseInt(destination.droppableId);

        // ADD card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);
        //update the card position
        // Update the position of each card in the source list
        sourceList.cards.forEach((card, idx) => {
          card.position = idx + 1; // Ensure position starts from 1
        });

        // Update the order for each card in the destination list
        destList.cards.forEach((card, idx) => {
          card.position = idx + 1; // Ensure position starts from 1
        });

        setOrderedData(newOrderedData);
        updateCardOrder({
          board_column_id: parseInt(destination.droppableId),
          position: destination.index + 1,
          cardId: parseInt(result.draggableId),
        });
      }
    }
  };

  return (
    <div className="pt-[60px]">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lists" type="list" direction="horizontal">
          {(provided) => (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className=" flex flex-col sm:flex-row gap-y-3 sm:gap-x-3 h-auto sm:h-full w-full"
            >
              {orderedData.map((list, index) => {
                return <ListItem key={list.id} index={index} data={list} />;
              })}
              {provided.placeholder}
              <ListForm />
              <div className="flex-shrink-0 w-1" />
            </ol>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ListContainer;
