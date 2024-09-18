import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import Header from "./header";
import Social from "./social";

interface Props {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}
const Wrapper = ({ children, headerLabel, showSocial }: Props) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && <Social />}
    </Card>
  );
};

export default Wrapper;
