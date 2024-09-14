import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import React from "react";
import MobileSidebar from "./MobileSidebar";
import Logo from "@/components/ui/Logo";

const Navbar = () => {
  return (
    <>
      <nav className="fixed z-50 top-0 px-4 w-full h-16 border-b shadow-sm bg-white flex items-center">
        <MobileSidebar />
        <div className="flex items-center gap-x-4">
          <div className="hidden md:flex">
            <Logo />
          </div>
          <button
            className="rounded-sm hidden md:block h-auto py-1.5 px-2 bg-sky-700 text-white
            hover:bg-gray-800 duration-300
          "
          >
            Create
          </button>
          <button
            className="rounded-sm block md:hidden h-auto py-1.5 px-2  bg-sky-700 text-white
            hover:bg-gray-800 duration-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="ml-auto flex items-center gap-x-2">
          <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl="/organization/:id"
            afterLeaveOrganizationUrl="/select-org"
            afterSelectOrganizationUrl="/organization/:id"
            appearance={{
              elements: {
                rootBox: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              },
            }}
          />
          <UserButton afterSwitchSessionUrl="/" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
