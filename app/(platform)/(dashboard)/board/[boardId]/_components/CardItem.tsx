import { useCardModal } from "@/hooks/useCardModal";
import { Card } from "@/types/Board";
import React from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Draggable } from "@hello-pangea/dnd";

interface Props {
  data: Card;
  index: number;
}

const CardItem = ({ data, index }: Props) => {
  const cardModal = useCardModal();
  if (!data.id) {
    return null;
  }
  return (
    <>
      <Draggable draggableId={data.id.toString()} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            role="button"
            onClick={() => cardModal.onOpen(data.id.toString())}
            className="flex flex-col gap-[2px] h-[110px] truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-md"
          >
            <span
              className={
                "w-fit px-2 py-1 leading-tight inline-flex items-center bg-teal-100 rounded"
              }
            >
              <svg
                className={"h-2 w-2 text-teal-500"}
                viewBox="0 0 8 8"
                fill="currentColor"
              >
                <circle cx="4" cy="4" r="3" />
              </svg>
              <span className={"text-sm ml-2 font-medium text-teal-900"}>
                Feature Request
              </span>
            </span>
            <div>{data.title}</div>
            <Separator className="my-2" />
            <div className="text-black text-muted-foreground text-xs">
              <div className="flex flex-row justify-between">
                <span
                  className={
                    "flex flex-row -ml-2 rounded-full border-2 border-white"
                  }
                >
                  <Image
                    src={"/images/banner/5.webp"}
                    alt={"avatar"}
                    width={20}
                    height={20}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  <Image
                    src={"/images/banner/5.webp"}
                    alt={"avatar"}
                    width={20}
                    height={20}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                </span>
                {data.commentsCount > 0 ? data.commentsCount : 0} comments{" "}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default CardItem;
