import React from "react";
import FeatureBenefit from "./_components/FeatureBenefit";
import Advertise from "./_components/Advertise";
import Faq from "./_components/Faq";
import Intro from "./_components/Intro";

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col ">
      <Intro />
      <FeatureBenefit />
      <Advertise />
      <Faq />
    </div>
  );
};

export default MarketingPage;
