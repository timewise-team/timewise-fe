import React from "react";
/*import Info from "../_components/Info";*/
import { SelectSeparator } from "@/components/ui/select";
import ViewMember from "./_components/ViewMember";

const MemberPage = () => {
  return (
      <div
          className="w-full h-screen flex justify-center items-center"
          style={{
              padding: "20px",
          }}
      >
          <div
              className="flex flex-col w-4/5 bg-white rounded-lg shadow-md"
              style={{
                  maxWidth: "1200px",
                  padding: "20px",
              }}
          >
              {/*<Info />*/}
              <SelectSeparator className="bg-black"/>
              <ViewMember/>
          </div>
      </div>
  );
};

export default MemberPage;
