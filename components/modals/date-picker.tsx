/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { ArchiveIcon, CalendarHeart } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateCard } from "@/actions/update-card/schema";
import { Input } from "../ui/input";
import { useParams } from "next/navigation";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/Button";
import { updateCardID } from "@/lib/fetcher";

interface Props {
  data: any;
}

export function DatePicker({ data }: Props) {
  const [startDate, setStartDate] = useState(
    format(parseISO(data.start_time), "yyyy-MM-dd HH:mm")
  );
  const [endDate, setEndDate] = useState(
    format(parseISO(data.end_time), "yyyy-MM-dd HH:mm")
  );
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof UpdateCard>>({
    resolver: zodResolver(UpdateCard),
    defaultValues: {
      ...data,
      start_time: startDate,
      end_time: endDate,
    },
  });

  const { mutate: updateCardInformation } = useMutation({
    mutationFn: async (values: z.infer<typeof UpdateCard>) => {
      const response = await updateCardID(
        {
          cardId: data.id,
          visibility: values.visibility,
          all_day: values.all_day,
          description: values.description,
          end_time: format(
            new Date(values.end_time),
            "yyyy-MM-dd HH:mm:ss.SSS"
          ),
          extra_data: values.extra_data,
          location: values.location,
          priority: values.priority,
          recurrence_pattern: values.recurrence_pattern,
          start_time: format(
            new Date(values.start_time),
            "yyyy-MM-dd HH:mm:ss.SSS"
          ),
          status: values.status,
          title: values.title,
          organizationId: params.organizationId || data.workspace_id,
        },
        session
      );
      return response;
    },
    onSuccess: () => {
      // setStartDate(data.start_time);
      // setEndDate(data.end_time);
      startTransition(() => {
        setIsEditing(false);
      });
      queryClient.invalidateQueries({
        queryKey: ["detailCard"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listBoardColumns"],
      });
      disableEditing();
      toast.success("Schedule updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.handleSubmit((values) => updateCardInformation(values))();
    }
  };

  const handleSubmission = handleSubmit((values) => {
    updateCardInformation(values);
  });

  return (
    <div className="flex space-y-1 w-full">
      <div>
        <Form {...form}>
          {isEditing ? (
            <>
              <form className="space-y-2">
                <div className="flex flex-row items-center gap-x-1">
                  <div className="flex flex-row gap-x-2 w-full items-start font-medium">
                    <CalendarHeart className="w-6 h-6 text-gray-400" />
                    <p className="max-w-[100px]">Start Date:</p>
                  </div>
                  <Input
                    type="datetime-local"
                    id="start-time"
                    value={startDate}
                    disabled={isPending}
                    defaultValue={startDate}
                    onKeyDown={handleEnterPress}
                    {...register("start_time")}
                    onChange={(e) => setStartDate(e.target.value)}
                    className=" shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className=" flex flex-row  items-center gap-x-1 ">
                  <div className="flex flex-row w-full gap-x-2 items-start font-medium">
                    <ArchiveIcon className="w-6 h-6 text-gray-400" />
                    End Date:
                  </div>{" "}
                  <Input
                    type="datetime-local"
                    id="end-time"
                    value={endDate}
                    disabled={isPending}
                    defaultValue={endDate}
                    onKeyDown={handleEnterPress}
                    {...register("end_time")}
                    onChange={(e) => setEndDate(e.target.value)}
                    className=" shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                {errors.end_time && (
                  <p className="text-red-500 text-sm items-start pb-1">
                    {"Start date must be before end date"}
                  </p>
                )}
                <Button onClick={handleSubmission}>Save</Button>
              </form>
            </>
          ) : (
            <div
              onClick={enableEditing}
              className="flex flex-col items-start gap-x-1 space-y-2"
            >
              <div className="flex flex-row gap-x-2 items-center font-medium w-[100%] ">
                <div className="flex flex-row gap-x-2 w-full items-start font-medium">
                  <ArchiveIcon className="w-6 h-6 text-gray-400" />
                  <p className="text-gray-400 font-bold">Start Date:</p>
                </div>
                <Input
                  type="datetime-local"
                  value={startDate}
                  className="border-none"
                />
              </div>

              <div className="flex flex-row gap-x-2 items-center font-medium w-[100%] ">
                <div className="flex flex-row gap-x-2 w-full items-center font-medium">
                  <ArchiveIcon className="w-6 h-6 text-gray-400" />
                  <p className="text-gray-400 font-semibold">End Date:</p>
                </div>
                <Input
                  type="datetime-local"
                  value={endDate}
                  className="ml-2 border-none"
                />
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}
