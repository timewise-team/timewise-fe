import React, { Suspense } from "react";
import Info from "./_components/Info";
import BoardList from "./_components/BoardList";
import { Separator } from "@/components/ui/separator";

const OrganizationIdPage = async () => {
  //fetch boards from server
  // const board = await board.findMany

  return (
    <div className="w-full mb-20">
      {/* <Form />
      <div className="space-y-2">
        {boards.map((board) => (
          <Board key={board.id} title={board.title} id={board.id} />
        ))}
      </div> */}
      <Info />
      <Separator />
      <div className="px-2 md:px-4 py-2">
        {/* list board */}
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
