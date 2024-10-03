import { useCardModal } from "@/hooks/useCardModal";
import { Card } from "@/types/Board";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";

interface Props {
  data: Card;
  index: number;
}

const CardItem = ({ data, index }: Props) => {
  const cardModal = useCardModal();
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-md"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
