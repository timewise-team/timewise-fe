import React from "react";
import Sidebar from "../_components/Sidebar";
import { BOARD_DATA } from "@/test/fake-board-data";

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  const boards = BOARD_DATA;

  return (
    <main className="pt-20 md:pt-24 px-4 max-w-8xl 2xl:max-w-screen-2xl mx-auto h-full">
      <div className="flex gap-x-7">
        <div className=" w-64 shrink-0 hidden md:block">
          <Sidebar />
        </div>
        <div
          className="pt-3 flex-1 overflow-auto
          scrollbar-hide no-scrollbar bg-no-repeat bg-cover bg-center group relative aspect-video h-full w-full "
          style={{ backgroundImage: `url(${boards[1].imageFullUrl})` }}
        >
          {children}
        </div>
      </div>
    </main>
  );
};

export default OrganizationLayout;
