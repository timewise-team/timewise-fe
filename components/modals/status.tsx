/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { ElementRef, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useParams } from "next/navigation";
import { updateCardID } from "@/lib/fetcher";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { UpdateCard } from "@/actions/update-card/schema";
import { format } from "date-fns";
import { Annoyed, CircleSlash } from "lucide-react";

interface Props {
  data: any;
  disabled?: boolean;
}

const Status = ({ data, disabled }: Props) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof UpdateCard>>({
    resolver: zodResolver(UpdateCard),
    defaultValues: {
      status: data.status,
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
      queryClient.invalidateQueries({
        queryKey: ["detailCard"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listBoardColumns"],
      });
      startTransition(() => {
        reset();
      });
      toast.success("Status updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    register,
    reset,
    formState: { errors },
  } = form;

  const enableEditing = () => {
    if (disabled) return;
    setIsEditing(true);
    setTimeout(() => {});
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  const handleSelectChange = (value: any) => {
    form.setValue("status", value);
    form.handleSubmit((values) => updateCardInformation(values))();
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(closeRef, () => {
    if (!isPending) {
      disableEditing();
    }
  });
  return (
    <>
      <Form {...form}>
        {isEditing ? (
          <form className="flex flex-row gap-x-1">
            <div className="flex items-center flex-col">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      {...register("status")}
                      disabled={isPending}
                      defaultValue={field.value}
                      onValueChange={(value) => handleSelectChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select member to assign" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="not yet">Not Yet</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>{" "}
                    </Select>
                  </FormItem>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm items-start">
                  {errors.status.message}
                </p>
              )}
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            className="flex flex-row items-center gap-x-2 cursor-pointer"
          >
            <Annoyed className="w-6 h-6 text-gray-400" />
            <p className="text-gray-400 font-bold">Status: </p>
            <CircleSlash className="w-6 h-6 text-green-500 ml-10" />
            {data.status}
          </div>
        )}
      </Form>
    </>
  );
};

export default Status;
