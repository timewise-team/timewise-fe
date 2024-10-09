/* eslint-disable */
"use client";
import { Accordion } from "@radix-ui/react-accordion";
import { useLocalStorage } from "usehooks-ts";
import NavItem from "./NavItem";
import Info, {
  fakeData,
} from "../organization/[organizationId]/_components/Info";
import CreateDialog from "./CreateDialog";
import { CalendarRange, Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import MenuSidebarAccount from "./MenuSidebarAccount";
interface Props {
  storageKey?: string;
}

const Sidebar = ({ storageKey = "t-sidebar-state" }: Props) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const defaultAccordingValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }
      return acc;
    },
    []
  );

  const onExpand = (id: string) => {
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id],
    }));
  };

  // if () {
  //   return (
  //     <>
  //       <div className="flex items-center justify-between mb-2">
  //         <Skeleton className="h-10 w-[50%]" />
  //         <Skeleton className="h-10 w-10" />
  //       </div>
  //       <div className="space-y-2">
  //         <NavItem.Skeleton />
  //         <NavItem.Skeleton />
  //         <NavItem.Skeleton />
  //       </div>
  //     </>
  //   );
  // }

  return (
    <>
      <div className="space-y-2">
        <MenuSidebarAccount />
        <Separator />
        <div className="font-medium text-xs flex items-center mb-1 hover:cursor-pointer hover:bg-gray-200">
          <span className="flex flex-row items-center gap-1 pl-4 font-bold text-lg ">
            <CalendarRange className="w-4 h-4" />
            Calender
          </span>
        </div>
        <div className="font-medium text-xs flex items-center mb-1">
          <span className="flex flex-row gap-1 items-center pl-4 font-bold text-lg">
            <Store className="w-4 h-4" />
            Workspaces
          </span>
          <CreateDialog />
        </div>
        <Accordion
          type="multiple"
          defaultValue={defaultAccordingValue}
          className="space-y-2"
        >
          {fakeData.map((organization) => (
            <NavItem
              key={organization.id}
              isActive={organization?.id === organization.id}
              isExpanded={expanded[organization.id]}
              organization={organization}
              onExpand={onExpand}
            />
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default Sidebar;
