/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import Image from "next/image";
import { format } from "date-fns";

interface Props {
  session: any;
  comments: any;
}

const Comments = ({ session, comments }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-row items-center gap-x-2">
        <Image
          src={session?.user?.image || "/images/banner/1.webp"}
          alt="avatar"
          width={40}
          height={40}
          className="h-4 w-4 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="max-h-[150px] h-auto overflow-auto space-y-2">
        {comments && comments.length > 0 ? (
          comments.map((comment: any) => (
            <div
              className=" flex flex-col p-2 bg-sky-50 rounded-lg"
              key={comment.id}
            >
              <div className="flex flex-row items-center gap-x-2">
                <Image
                  src={session?.user?.image || "/images/banner/1.webp"}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="h-4 w-4 rounded-full object-cover"
                />
                <p>{format(new Date(comment?.created_at), "dd/MM/yyyy")}</p>{" "}
              </div>
              <p className="p-1">{comment?.content}</p>
            </div>
          ))
        ) : (
          <p className="w-full flex justify-center items-center font-bold text-md">
            No comments yet!
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
