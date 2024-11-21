/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { AirVent, Airplay, AirplayIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getActivitiesLogs, getCommentByScheduleID } from "@/lib/fetcher";
import Comments from "./comments";
import Activities from "./activities";
import Meetting from "./meeting";

interface Props {
  id: string | undefined;
  data: any;
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

const Tab = ({ id, data }: Props) => {
  const [activeTab, setActiveTab] = useState(TAB_DATA[0].label);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const { data: session } = useSession();
  const params = useParams();

  const handleChangeTab = (tab: string, index: number) => {
    setActiveTab(tab);
    setActiveTabIndex(index);
  };

  const { data: comments } = useQuery({
    queryKey: [
      "listComments",
      { cardId: id, organizationId: params.organizationId },
    ],
    queryFn: async () => {
      const data = await getCommentByScheduleID(
        { cardId: id, organizationId: params.organizationId },
        session
      );
      return data;
    },
    enabled: !!id && !!session && activeTab === "Comments",
  });

  const { data: activities } = useQuery({
    queryKey: [
      "listActivities",
      { cardId: id, organizationId: params.organizationId },
    ],
    queryFn: async () => {
      if (!id || !session) return null;
      const data = await getActivitiesLogs(
        { cardId: id, organizationId: params.organizationId },
        session
      );
      return data;
    },
    enabled: !!id && !!session && activeTab === "Activities",
  });

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
              onClick={() => handleChangeTab(tab.label, index)}
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
            <Comments session={session} data={comments} scheduleId={id} />
          )}
          {activeTab === "Activities" && (
            <Activities session={session} activities={activities} />
          )}
          {activeTab === "Meet" && (
            <Meetting session={session} data={data} scheduleId={id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tab;
