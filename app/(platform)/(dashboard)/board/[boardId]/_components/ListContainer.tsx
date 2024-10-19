/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { ListWithCards } from "@/types/Board";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import ListForm from "./ListForm";

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

const ListContainer = ({ data, boardId }: Props) => {
  const [orderedData, setOrderedData] = useState(data);

  // const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
  //   onSuccess: () => {
  //     toast.success("Lists Reordered!");
  //   },
  //   onError: (error) => {
  //     toast.error(error);
  //   },
  // });
  console.log("boardId", boardId);

  // const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
  //   onSuccess: () => {
  //     toast.success("Cards Reordered!");
  //   },
  //   onError: (error) => {
  //     toast.error(error);
  //   },
  // });

  // if (Array.isArray(data) && data.length > 0) {
  //   data.forEach((item) => {
  //     if (Array.isArray(item.cards) && item.cards.length > 0) {
  //       item.cards.forEach((schedule: Card) => {
  //         console.log("schedule title list container", schedule.title);
  //       });
  //     }
  //   });
  // }

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
      // executeUpdateListOrder({ items, boardId });
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
          card.order = idx;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        // executeUpdateCardOrder({ boardId, items: reorderedCards });
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        movedCard.boardColumnId = destination.droppableId;

        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        // executeUpdateCardOrder({
        //   boardId,
        //   items: destList.cards,
        // });
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
