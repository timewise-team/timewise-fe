import React from "react";
import Advertise from "./_components/Advertise";
import Faq from "./_components/Faq";
import Banner from "./_components/Banner";
import Overview from "./_components/Overview";
import Intro from "./_components/Intro";

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col ">
      <Intro />
      <Banner />
      <Overview />
      {/* <FeatureBenefit /> */}
      {/* <Benefit /> */}
      <Advertise />
      <Faq />
    </div>
  );
};

export default MarketingPage;
