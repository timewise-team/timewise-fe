import React from "react";
import ListContainer from "./_components/ListContainer";
import { fakeCardData, fakeListData } from "@/test/fake-board-data";

interface Props {
  params: {
    boardId: string;
  };
}

const BoardIdPage = ({ params }: Props) => {
  const lists = fakeListData.map((list) => {
    return {
      ...list,
      cards: fakeCardData.filter((card) => card.listId === list.id),
    };
  });

  return (
    <div className="p-5 h-full space-y-2 overflow-x-auto">
      <ListContainer boardId={params.boardId} data={lists} />
    </div>
  );
};

export default BoardIdPage;
