import React from "react";
import FeatureBenefit from "./_components/FeatureBenefit";
import Advertise from "./_components/Advertise";
import Faq from "./_components/Faq";
import Banner from "./_components/Banner";
import Overview from "./_components/Overview";
import Benefit from "./_components/Benefits";

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col ">
      <Banner />
      <Overview />
      <FeatureBenefit />
      <Benefit />
      <Advertise />
      <Faq />
    </div>
  );
};

export default MarketingPage;
