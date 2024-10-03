import React from "react";
import Faq from "./_components/Faq";
import Banner from "./_components/Banner";
import Overview from "./_components/Overview";
import Intro from "./_components/Intro";
import Benefit from "./_components/Benefits";

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col ">
      <Intro />
      <Banner />
      <Overview />
      {/* <FeatureBenefit /> */}
      <Benefit />
      <Faq />
    </div>
  );
};

export default MarketingPage;
