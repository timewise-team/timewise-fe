import { ListWithCards } from "@/types/Board";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import React, { ElementRef, useRef, useState } from "react";
import ListHeader from "./ListHeader";
import CardItem from "./CardItem";
import CardForm from "./CardForm";
import { cn } from "@/lib/utils";

interface Props {
  data: ListWithCards;
  index: number;
}

export const ListItem = ({ index, data }: Props) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2 ",
                    data?.cards?.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data.schedules?.length > 0 ? (
                    data.schedules.map((schedule, index) => (
                      <CardItem
                        key={schedule.id}
                        index={index}
                        data={schedule}
                      />
                    ))
                  ) : (
                    <div
                      className="w-full bg-gray-200 
                      animate-pulse h-8 rounded-md
                    "
                    ></div>
                  )}
                </ol>
              )}
            </Droppable>
            <CardForm
              ref={textareaRef}
              listId={data.id}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default ListItem;
