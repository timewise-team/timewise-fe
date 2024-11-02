/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { ElementRef, useRef, useState, useTransition } from "react";
import { Button } from "../ui/Button";
import { toast } from "sonner";
import { InviteMembers } from "@/actions/invite-member/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useParams } from "next/navigation";
import { inviteMemberToCard } from "@/lib/fetcher";

interface Props {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  data: any;
}

const FormInvite = ({ children, data }: Props) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const [email, setEmail] = useState("");

  const form = useForm<z.infer<typeof InviteMembers>>({
    resolver: zodResolver(InviteMembers),
    defaultValues: {
      email: "",
    },
  });

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setValue("email", value);
  };

  const { setValue, handleSubmit } = form;

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

  const { mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof InviteMembers>) => {
      const validatedFields = InviteMembers.safeParse(values);
      if (!validatedFields.success) {
        throw new Error("Invalid fields");
      }

      const response = await inviteMemberToCard(
        {
          email: values.email,
          schedule_id: data.ID,
          organizationId: params.organizationId,
        },
        session
      );
      console.log("response mutate", response);

      return response;
    },
    onSuccess: () => {
      toast.success(
        "Member invited successfully, please wait for their response"
      );
    },
    onError: () => {
      toast.error("Failed to invite member");
    },
  });

  const handleSubmission = handleSubmit((values) => {
    startTransition(() => {
      mutate(values);
    });
  });

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
          <form className="flex flex-row items-center">
            <Input
              className="w-full"
              type="text"
              id="email"
              placeholder="Enter email to invite"
              onFocus={enableEditing}
              disabled={isPending}
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            <Button className="w-fit" type="submit" onClick={handleSubmission}>
              Invite
            </Button>
          </form>
        ) : (
          <div onClick={enableEditing}>{children}</div>
        )}
      </Form>
    </>
  );
};

export default FormInvite;
