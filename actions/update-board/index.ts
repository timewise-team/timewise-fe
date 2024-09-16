"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  // const userId = auth();
  // if (!userId) {
  //   return {
  //     error: "unauthorized",
  //   };
  // }
  const { title, id } = data;

  let board;

  try {
    //api update board
    const response = await fetch(`https://api.example.com/boards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        id,
      }),
    });
  } catch (error) {
    return {
      error: "Failed to update board",
    };
  }

  return {
    data: board,
  };
};

export default createSafeAction(UpdateBoard, handler);
