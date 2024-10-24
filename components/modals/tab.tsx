/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { AirVent, Airplay, AirplayIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { format } from "date-fns";
import { getCommentByScheduleID } from "@/lib/fetcher";

interface Props {
  id: string | undefined;
}

const TAB_DATA = [
  {
    icon: <AirVent className="h-4 w-4" />,
    label: "Comments",
    href: "comments",
  },
  {
    icon: <Airplay className="w-4 h-4" />,
    label: "Activities",
    href: "activities",
  },
  {
    icon: <AirplayIcon className="w-4 h-4" />,
    label: "Meet",
    href: "meet",
  },
];

export const getActivitiesLogs = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/activity_log/schedule/${params.cardId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

const Tab = ({ id }: Props) => {
  const [activeTab, setActiveTab] = useState(TAB_DATA[0].label);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const { data: session } = useSession();
  const params = useParams();

  const handleChangeTab = (tab: string, href: string, index: number) => {
    setActiveTab(tab);
    setActiveTabIndex(index);
  };

  const { data: comments } = useQuery({
    queryKey: [
      "listComments",
      { cardId: id, organizationId: params.organizationId },
    ],
    queryFn: async () => {
      if (!id || !session) return null;
      const data = await getCommentByScheduleID(
        { cardId: id, organizationId: params.organizationId },
        session
      );
      return data;
    },
    enabled: !!id && !!session,
  });

  //   const { data: activitiesData } = useQuery(["activities"], getActivities, {
  //     enabled: activeTab === "Activities",
  //   });

  useEffect(() => {
    const setTabPosition = () => {
      const currentTab = tabsRef.current[activeTabIndex] as HTMLElement;
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    };

    setTabPosition();
  }, [activeTabIndex]);

  return (
    <div className="w-full">
      <div className="relative right-0">
        <ul
          className="relative flex flex-wrap px-1.5 py-1.5 list-none rounded-md"
          data-tabs="tabs"
          role="list"
        >
          <span
            className="absolute bottom-0 h-1 bg-sky-200 transition-all duration-300"
            style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
          />
          {TAB_DATA.map((tab, index) => (
            <li
              key={index}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              className={`flex-auto text-center hover:bg-gray-100 transition-all ease-in-out 
                rounded-sm cursor-pointer
                ${activeTab === tab.label ? "bg-sky-100" : "bg-white"}
                transition duration-300`}
              onClick={() => handleChangeTab(tab.label, tab.href, index)}
            >
              <a className="flex items-center justify-center p-2">
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="p-4">
          {activeTab === "Comments" && (
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
                      <p>
                        {format(new Date(comment?.created_at), "dd/MM/yyyy")}
                      </p>{" "}
                    </div>
                    <p className="p-1">{comment?.content}</p>
                  </div>
                ))
              ) : (
                <p className="w-full flex items-center font-bold text-md">
                  No comments yet!
                </p>
              )}
            </div>
          )}
          {activeTab === "Activities" && (
            <div>{/* Render activities data */}</div>
          )}
          {activeTab === "Meet" && <div>{/* Render meet content */}</div>}
        </div>
      </div>
    </div>
  );
};

export default Tab;
