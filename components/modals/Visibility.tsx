/* eslint-disable @typescript-eslint/no-explicit-any */

import { UpdateCard } from "@/actions/update-card/schema";
import { updateCardID } from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { format } from "date-fns";
import { Pencil } from "lucide-react";

interface Props {
  data: any;
}

const Visibility = ({ data }: Props) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof UpdateCard>>({
    resolver: zodResolver(UpdateCard),
    defaultValues: {
      visibility: data.visibility || "private",
    },
  });

  const { setValue, register, handleSubmit } = form;

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
      toast.success("Status updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: z.infer<typeof UpdateCard>) => {
    updateCardInformation(values);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVisibility = e.target.value;
    setValue("visibility", newVisibility, { shouldValidate: true });
    console.log("Select value updated to:", e.target.value);
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isEditing ? (
          <select {...register("visibility")} onChange={handleSelectChange}>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        ) : (
          <div
            className="flex flex-row items-center gap-x-1 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <p>Visibility: {data.visibility}</p>
            <Pencil className="w-4 h-4" />
          </div>
        )}
      </form>
    </>
  );
};

export default Visibility;
