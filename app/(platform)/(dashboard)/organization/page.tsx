import CalendarApp from "@/components/view-calender/calender";
import React from "react";

const OrganizationPage = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center">
        <CalendarApp />
      </div>
      {/* <ViewCalender /> */}
    </>
  );
};

export default OrganizationPage;
