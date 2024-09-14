import { deleteBoard } from "@/actions/deleteBoard";
import React from "react";
import FormButton from "./FormButton";

interface Props {
  title: string;
  id: string;
}

const Board = ({ title, id }: Props) => {
  const deleteBoardWithId = deleteBoard.bind(null, id);
  return (
    <form action={deleteBoardWithId} className="flex items-center gap-x-2">
      <p>Board Title:{title}</p>
      <FormButton title="Delete" className="bg-red-500" />

      <div>Board</div>
    </form>
  );
};

export default Board;
