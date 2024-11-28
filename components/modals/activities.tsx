/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import Image from "next/image";
import { format } from "date-fns";

interface Props {
  session: any;
  activities: any;
}

const Activities = ({ session, activities }: Props) => {
  return (
    <div className="max-h-[150px] h-auto overflow-auto space-y-2">
      {activities && activities.length > 0 ? (
        activities.map((activity: any) => (
          <div
            className="flex flex-row items-center gap-x-2 p-2 bg-sky-50 rounded-lg"
            key={activity.id}
          >
            <Image
              src={session?.user?.image || "/images/banner/1.webp"}
              alt="avatar"
              width={40}
              height={40}
              className="h-4 w-4 rounded-full object-cover"
            />
            <div>
              <p>{format(new Date(activity?.created_at), "dd/MM/yyyy")}</p>
              <p className="font-bold">{activity?.first_name}</p>
              <p>{activity?.action}</p>
              <p>{activity?.old_value}</p>
              <p>{activity?.new_value}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="w-full flex items-center font-bold text-md">
          No activities yet!
        </p>
      )}
    </div>
  );
};

export default Activities;
