/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/Button";
import {
  CalendarHeart,
  Circle,
  Clock,
  ListFilter,
  UserRoundSearch,
} from "lucide-react";

interface Props {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  member: string;
  setMember: React.Dispatch<React.SetStateAction<string>>;
  due: boolean;
  setDue: React.Dispatch<React.SetStateAction<boolean>>;
  dueComplete: boolean;
  setDueComplete: React.Dispatch<React.SetStateAction<boolean>>;
  overdue: boolean;
  setOverdue: React.Dispatch<React.SetStateAction<boolean>>;
  notDue: boolean;
  setNotDue: React.Dispatch<React.SetStateAction<boolean>>;
  isPopoverOpen: boolean;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  listMembers: any;
}

const FilterPopover = ({
  search,
  setSearch,
  member,
  setMember,
  due,
  setDue,
  dueComplete,
  setDueComplete,
  overdue,
  setOverdue,
  notDue,
  setNotDue,
  isPopoverOpen,
  setIsPopoverOpen,
  listMembers,
}: Props) => {
  const handleOverdueChange = () => {
    setOverdue((prev) => !prev);
  };

  const handleDueChange = () => {
    setDue((prev) => !prev);
  };

  const handleDueCompleteChange = () => {
    setDueComplete((prev) => !prev);
  };

  const handleMemberChange = (email: string) => {
    setMember((prev) => (prev === email ? "" : email));
  };

  const handleClearFilters = () => {
    setSearch("");
    setDue(false);
    setDueComplete(false);
    setOverdue(false);
    setNotDue(false);
    setMember("");
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          className="bg-transparent flex flex-row items-center text-white font-bold gap-x-2 w-fit cursor-pointer
            hover:bg-white hover:bg-opacity-20 p-2 rounded-lg"
        >
          <ListFilter size={24} />
          <p>Filter</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="space-y-2 w-full flex items-center justify-center">
              <h4 className="font-bold leading-none">Filter</h4>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="search" className="font-bold">
                Keyword
              </Label>
              <Input
                id="search"
                placeholder="Enter name of schedule"
                className="col-span-2 h-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="member" className="font-bold">
                Member
              </Label>
              <div className="flex flex-col items-start space-y-2">
                {Array.isArray(listMembers) &&
                  listMembers.map((members: any) => (
                    <div
                      className="flex flex-row items-center gap-x-2"
                      key={members.id}
                    >
                      <Input
                        className="w-4 h-4"
                        type="checkbox"
                        checked={members.email === member}
                        id={members.id}
                        onChange={() => handleMemberChange(members.email)}
                      />
                      <UserRoundSearch size={16} />
                      <label
                        htmlFor={`member-${members.id}`}
                        className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {members.email}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="date" className="font-bold">
                Date
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="notDue"
                  onChange={() => setNotDue((prev) => !prev)}
                  checked={notDue}
                  className="w-4 h-4"
                />
                <CalendarHeart size={16} />
                <label
                  htmlFor="notDue"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Not due
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="overdue"
                  onChange={handleOverdueChange}
                  checked={overdue}
                  className="w-4 h-4"
                />
                <Clock size={16} className="text-red-500" />
                <label
                  htmlFor="overdue"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Overdue
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="due"
                  onChange={handleDueChange}
                  checked={due}
                  className="w-4 h-4"
                />
                <UserRoundSearch size={16} />
                <label
                  htmlFor="due"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Due Date
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  checked={dueComplete}
                  className="w-4 h-4"
                  id="dueComplete"
                  onChange={handleDueCompleteChange}
                />
                <Circle size={16} className="text-green-500" />
                <label
                  htmlFor="dueComplete"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Due Complete
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleClearFilters} className=" text-white">
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
