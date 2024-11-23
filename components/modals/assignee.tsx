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
import { AssigneeSchedules } from "@/lib/fetcher";
import { AssigneeSchedule } from "@/actions/assignee/schema";
import Image from "next/image";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  data: any;
  participant: any;
  disabled?: boolean;
}

const Assignee = ({ children, data, participant, disabled }: Props) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const queryClient = useQueryClient();

  const assignTo = participant?.filter((p: any) => p.status === "assign to")[0];

  const form = useForm<z.infer<typeof AssigneeSchedule>>({
    resolver: zodResolver(AssigneeSchedule),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: assigneeSchedule } = useMutation({
    mutationFn: async (values: z.infer<typeof AssigneeSchedule>) => {
      const validatedFields = AssigneeSchedule.safeParse(values);
      if (!validatedFields.success) {
        throw new Error("Invalid fields");
      }

      const response = await AssigneeSchedules(
        {
          email: values.email,
          schedule_id: data.id,
          organizationId: params.organizationId,
        },
        session
      );

      return response;
    },
    onSuccess: () => {
      toast.success("Member assigned successfully");
      queryClient.invalidateQueries({
        queryKey: ["scheduleParticipant"],
      });
      startTransition(() => {
        reset();
      });
      disableEditing();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign member");
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
    form.setValue("email", value);
    form.handleSubmit((values) => assigneeSchedule(values))();
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      {...register("email")}
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
                        {participant
                          .filter((p: any) => p.status !== "creator")
                          .map((p: any) => (
                            <SelectItem key={p.id} value={p.email}>
                              <div className="flex flex-row gap-x-2">
                                <Image
                                  width={20}
                                  height={20}
                                  src={p.profile_picture}
                                  alt={p.first_name}
                                  className="w-10 h-10 rounded-full"
                                />
                                {p.first_name} {p.last_name}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm items-start">
                  {errors.email.message}
                </p>
              )}
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            className="flex flex-row items-center gap-x-2"
          >
            {assignTo ? (
              <>
                <Image
                  width={20}
                  height={20}
                  className="h-4 w-4 rounded-full"
                  src={assignTo.profile_picture}
                  alt={assignTo.first_name}
                />
              </>
            ) : (
              <span>Not assigned yet</span>
            )}
            {assignTo?.first_name}
            {children}
          </div>
        )}
      </Form>
    </>
  );
};

export default Assignee;
