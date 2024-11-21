/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Pencil, PersonStanding, Plus, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/Button";
import {
  addPersonalReminder,
  removePersonalReminder,
  updateReminderPersonal,
} from "@/lib/fetcher";

interface Props {
  data: any;
  schedule: any;
}

export const PersonReminder = z.object({
  time: z.string().refine(
    (val) => {
      const reminderTime = new Date(val);
      const currentDate = new Date();
      if (reminderTime < currentDate) {
        return false;
      }
      return true;
    },
    {
      message:
        "Reminder time must be greater than or equal to the current time",
    }
  ),
});

const PersonalReminder = ({ data, schedule }: Props) => {
  console.log("personal reminder", data);
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [reminderTime, setReminderTime] = useState(
    data?.reminder_time
      ? format(parseISO(data.reminder_time), "yyyy-MM-dd HH:mm")
      : ""
  );

  const form = useForm({
    resolver: zodResolver(PersonReminder),
    defaultValues: {
      ...data,
      time: reminderTime,
    },
  });

  const handleAddReminder = () => {
    addReminderPersonalMutation.mutate();
  };

  const addReminderPersonalMutation = useMutation({
    mutationFn: async () => {
      const response = await addPersonalReminder(
        {
          schedule_id: schedule.id,
          organizationId: params.organizationId,
        },
        session
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["personalReminder"],
      });
      toast.success("Reminder added successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add reminder");
    },
  });

  const { register, handleSubmit } = form;

  const { mutate: updateReminderPersonalMutate } = useMutation({
    mutationFn: async (values: z.infer<typeof PersonReminder>) => {
      const response = await updateReminderPersonal(
        {
          reminder_id: data.ID,
          time: format(new Date(values.time), "yyyy-MM-dd HH:mm"),
          schedule_id: data.schedule_id,
          organizationId: params.organizationId || data.workspace_id,
        },
        session
      );

      return response;
    },
    onSuccess: () => {
      startTransition(() => {
        setIsEditing(false);
      });
      queryClient.invalidateQueries({
        queryKey: ["personalReminder"],
      });

      toast.success("Personal reminder updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });

  const { mutate: removePersonalReminderMutate } = useMutation({
    mutationFn: async () => {
      const response = await removePersonalReminder(
        {
          reminder_id: data.ID,
          schedule_id: data.schedule_id,
          organizationId: params.organizationId || data.workspace_id,
        },
        session
      );

      return response;
    },
    onSuccess: () => {
      startTransition(() => {
        setIsEditing(false);
      });
      queryClient.invalidateQueries({
        queryKey: ["personalReminder"],
      });

      toast.success("Personal reminder removed successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });

  const handleSubmission = handleSubmit((values) => {
    updateReminderPersonalMutate(values);
  });

  return (
    <>
      <Form {...form}>
        {isEditing ? (
          <form>
            <div className="flex flex-row items-center gap-x-3">
              <p className="text-sm font-bold">Personal: </p>
              <Input
                id="time"
                value={reminderTime}
                disabled={isPending}
                defaultValue={reminderTime}
                type="datetime-local"
                {...register("time")}
                onChange={(e) => setReminderTime(e.target.value)}
              />
              <Button onClick={handleSubmission}>Change</Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-x-2">
            {data && !data.message ? (
              <div className="flex flex-row items-center gap-x-1">
                <PersonStanding className="h-4 w-4 mr-2" />
                <p className="text-sm font-bold">Personal: </p>
                <p className="text-sm text-neutral-500">
                  {data.reminder_time
                    ? format(new Date(data.reminder_time), "yyyy-MM-dd HH:mm")
                    : "No reminder set"}
                </p>
              </div>
            ) : (
              <div className="flex flex-row items-center gap-x-2">
                <Button
                  className="bg-transparent hover:bg-transparent text-black"
                  onClick={handleAddReminder}
                >
                  <Plus className={"w-4 h-4 mr-1 "} />
                  Add personal reminder
                </Button>
              </div>
            )}

            {data && !data.message && (
              <div className="flex flex-row items-center gap-x-1 cursor-pointer">
                <Pencil
                  className="w-4 h-4"
                  onClick={() => setIsEditing(true)}
                />
                <Trash
                  className="w-4 h-4"
                  onClick={() => removePersonalReminderMutate()}
                />
              </div>
            )}
          </div>
        )}
      </Form>
    </>
  );
};

export default PersonalReminder;
