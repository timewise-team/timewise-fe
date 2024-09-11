import React from "react";
import FeatureBenefit from "./_components/FeatureBenefit";

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col">
        <div
          className="mt-20 md:mt-100 mb-4 flex items-center border shadow-sm p-4
        bg-blue-300 text-amber-700 rounded-full uppercase 
        "
        >
          No 1 Schedule Management
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-blue-800 mb-6">
          Welcome to TIMEWISE
        </h1>
        <div
          className="text-3xl md:text-6xl bg-gradient-to-r
        from-blue-400 to bg-blue-600 text-white px-4 p-2 rounded-lg pb-4 w-fit"
        >
          Work Forward
        </div>
      </div>
      <FeatureBenefit />
    </div>
  );
};

export default MarketingPage;
