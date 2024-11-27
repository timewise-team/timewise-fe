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
import { format } from "date-fns";
import { Eye, Pencil } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/Button";
import FormSubmit from "../form/form-submit";

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
  // const [visibility, setVisibility] = useStates(data.visibility);

  const form = useForm<z.infer<typeof UpdateCard>>({
    resolver: zodResolver(UpdateCard),
    defaultValues: {
      visibility: data.visibility,
    },
  });

  const { setValue, register, reset } = form;

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

  const handleSelectChange = (value: string) => {
    setValue("visibility", value);
    form.handleSubmit((values) => updateCardInformation(values))();
  };

  const handleSubmit = (values: z.infer<typeof UpdateCard>) => {
    console.log("values submit", values);
    updateCardInformation(values);
  };

  return (
    <>
      <Form {...form}>
        {isEditing ? (
          <form ref={formRef} className="flex flex-row items-center gap-x-2">
            <Eye className="w-6 h-6 text-gray-400" />
            <p>Visibility: </p>
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <Select
                    value={field.value}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        ) : (
          <div className="flex items-center space-x-2 cursor-pointer w-full">
            <Eye className="w-6 h-6 text-gray-400" />
            <p className="text-gray-400 font-bold">Visibility</p>
            <div className=" flex flex-row items-center">
              <span>{data.visibility}</span>
              <button
                className="ml-2 text-primary-500"
                disabled={disabled}
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </Form>
    </>
  );
};

export default Visibility;
