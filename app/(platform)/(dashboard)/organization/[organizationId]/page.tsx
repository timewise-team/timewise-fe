import React from "react";
import Form from "./Form";
import Board from "./Board";

const OrganizationIdPage = async () => {
  //create fake data of boards
  const boards = [
    {
      title: "Board 1",
      id: "1",
    },
    {
      title: "Board 2",
      id: "2",
    },
    {
      title: "Board 3",
      id: "3",
    },
  ];
  //fetch boards from server
  // const board = await board.findMany

  return (
    <div className="flex flex-col space-y-4">
      <Form />
      <div className="space-y-2">
        {boards.map((board) => (
          <Board key={board.id} title={board.title} id={board.id} />
        ))}
      </div>
    </div>
  );
};

export default OrganizationIdPage;
