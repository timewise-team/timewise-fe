"use client";
import React from "react";

// interface Props {
//   params: {
//     boardId: string;
//   };
// }

const BoardIdPage = () => {
  // const [position, setPosition] = useState(0);
  // const { data: session } = useSession();
  // const param = useParams();

  // const { data, isLoading } = useQuery({
  //   queryKey: ["listBoardColumns", "schedules"],
  //   queryFn: async () => {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/board_columns/workspace/${param.organizationId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${session?.user.access_token}`,
  //           "X-User-Email": `${session?.user.email}`,
  //           "X-Workspace-ID": `${param.organizationId}`,
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     console.log("data in board", data);
  //     let nextPosition = 0;
  //     if (data && data.length > 0) {
  //       const lastPosition = data[data.length - 1].position;
  //       nextPosition = lastPosition + 1;
  //       setPosition(nextPosition);
  //       console.log("last-pos", lastPosition);
  //       console.log("pos", position);
  //       console.log("next-pos", nextPosition);
  //     }
  //     console.log("listBoardColumns", data);
  //     return data;
  //   },
  // });

  // if (isLoading) {
  //   return <div className="w-full h-full flex items-center">Loading...</div>;
  // }

  return (
    <>
      {/* {Array.isArray(data) && (
        <ListContainer
          data={data}
          boardId={param.boardId.toString()}
          position={position}
        />
      )} */}
      asd
    </>
  );
};

export default BoardIdPage;
