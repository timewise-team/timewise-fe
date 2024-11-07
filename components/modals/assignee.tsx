/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { ElementRef, useRef, useState, useTransition } from "react";
import { Button } from "../ui/Button";
import { toast } from "sonner";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useParams } from "next/navigation";
import { AssigneeSchedules } from "@/lib/fetcher";
import { AssigneeSchedule } from "@/actions/assignee/schema";

interface Props {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  data: any;
}

const Assignee = ({ children, data }: Props) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const queryClient = useQueryClient();

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
          schedule_id: data.ID,
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
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign member");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const enableEditing = () => {
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
              <Input
                type="text"
                id="email"
                placeholder="Enter email to invite"
                onFocus={enableEditing}
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm items-start">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button
              className="w-fit"
              type="submit"
              onClick={handleSubmit((values) => {
                assigneeSchedule(values);
              })}
            >
              Assign
            </Button>
          </form>
        ) : (
          <div onClick={enableEditing}>{children}</div>
        )}
      </Form>
    </>
  );
};

export default Assignee;
