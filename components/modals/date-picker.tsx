/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/Button";
import { useState } from "react";
import { Card } from "@/types/Board";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateCard } from "@/actions/update-card/schema";
import { Input } from "../ui/input";

interface Props {
  data: any;
}

//update card information
export const updateCardID = async (
  params: any,
  session: any
): Promise<Card> => {
  const validatedFields = UpdateCard.safeParse(params);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedules/${params.cardId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        all_day: params.all_day,
        description: params.description,
        end_time: params.end_time,
        extra_data: params.extra_data,
        location: params.location,
        priority: params.priority,
        recurrence_pattern: params.recurrence_pattern,
        start_time: params.start_time,
        status: params.status,
        title: params.title,
        video_transcript: params.video_transcript,
        visibility: params.visibility,
        workspace_id: params.workspace_id,
      }),
    }
  );

  const data: Card = await response.json();
  return data;
};

export function DatePicker({ data }: Props) {
  const [startDate, setStartDate] = useState(data.start_time?.split("T")[0]); // YYYY-MM-DD format
  const [startTime, setStartTime] = useState(
    data.start_time?.split("T")[1].slice(0, 5)
  );
  const [endDate, setEndDate] = useState(data.end_time?.split("T")[0]);
  const [endTime, setEndTime] = useState(
    data.end_time?.split("T")[1].slice(0, 5)
  );
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { mutate: updateCardInformation } = useMutation({
    mutationFn: async (values: any) => {
      const response = await updateCardID(
        {
          cardId: data.id,
          start_time: `${values.startDate}T${values.startTime}:00`,
          end_time: `${values.endDate}T${values.endTime}:00`,
          ...data,
        },
        session
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detailCard", data.id],
      });
      toast.success("Schedule updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update schedule: ${error?.message}`);
    },
  });

  const handleSaveDates = () => {
    updateCardInformation({
      startDate,
      startTime,
      endDate,
      endTime,
    });
  };

  return (
    <div className="flex flex-col space-y-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarIcon className="mr-2" />
            Set Date Range
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="flex flex-col p-4">
            <div className="mb-4">
              <label
                htmlFor="start-date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Start Date:
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <input
                type="time"
                id="start-time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="end-date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                End Date:
              </label>
              <Input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <Input
                type="time"
                id="end-time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <Button onClick={handleSaveDates}>Save Dates</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
