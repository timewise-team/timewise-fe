/* eslint-disable @typescript-eslint/no-explicit-any */

import { UpdateCard } from "@/actions/update-card/schema";
import { updateCardID } from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { Eye, Pencil } from "lucide-react";
import { Form } from "../ui/form";
import { getUserEmailByWorkspace } from "@/utils/userUtils";
import { useStateContext } from "@/stores/StateContext";

interface Props {
  data: any;
  disabled?: boolean;
}

const Visibility = ({ data, disabled }: Props) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [visibility, setVisibility] = useState(data.visibility);
  const { stateUserEmails, stateWorkspacesByEmail } = useStateContext();

  const form = useForm<z.infer<typeof UpdateCard>>({
    resolver: zodResolver(UpdateCard),
    defaultValues: {
      visibility: data.visibility,
      start_time: format(parseISO(data.start_time), "yyyy-MM-dd HH:mm:ss.SSS"),
      end_time: format(parseISO(data.end_time), "yyyy-MM-dd HH:mm:ss.SSS"),
    },
  });

  const { setValue, register, reset } = form;

  const { mutate: updateCardInformation } = useMutation({
    mutationFn: async (values: z.infer<typeof UpdateCard>) => {
      const userEmail = getUserEmailByWorkspace(
        stateUserEmails,
        stateWorkspacesByEmail,
        Number(params.organizationId || data.workspaceId)
      );
      if (!userEmail) {
        return null;
      }
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
          userEmail: userEmail.email,
        },
        session
      );
      console.log("response", response);

      return response;
    },
    onSuccess: () => {
      toast.success("Status updated successfully");
      startTransition(() => {
        reset();
      });
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["detailCard"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listBoardColumns"],
      });
      queryClient.invalidateQueries({
        queryKey: ["schedules", data.workspace_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["schedules"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVisibility = e.target.value;
    setVisibility(newVisibility);
    setValue("visibility", newVisibility);

    updateCardInformation({
      ...form.getValues(),
      visibility: newVisibility,
    });
  };

  return (
    <>
      <Form {...form}>
        {isEditing ? (
          <form ref={formRef} className="flex flex-row items-center gap-x-1">
            <Eye className="w-6 h-6 text-gray-400" />
            <p className="text-gray-400 font-bold">Visibility: </p>
            <select
              {...register("visibility")}
              onChange={handleSelectChange}
              value={data.visibility}
              disabled={isPending}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </form>
        ) : (
          <div className="flex items-center space-x-2 cursor-pointer justify-between">
            <div className="flex flex-row gap-x-2">
              <Eye className="w-6 h-6 text-gray-400" />
              <p className="text-gray-400 font-bold">Visibility: </p>
            </div>

            <div className=" flex flex-row items-center w-full pl-6">
              <span>{visibility}</span>
              <button
                className="ml-2 text-primary-500"
                disabled={disabled}
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Form>
    </>
  );
};

export default Visibility;
