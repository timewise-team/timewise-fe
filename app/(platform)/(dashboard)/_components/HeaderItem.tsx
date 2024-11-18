"use client";

import * as React from "react";
import {Button} from "@components/ui/Button";

const MenuNavbar = () => {
  const handleButtonClick = () => {
    window.location.href = "/manage-workspaces";
  };

  return (
      <div className="md:block hidden z-[5]">
          <Button onClick={handleButtonClick}>Manage Workspaces</Button>
      </div>
  );
};

export default MenuNavbar;
