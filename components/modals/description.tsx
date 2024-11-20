import React, { ElementRef, useRef, useState, useTransition } from "react";
import { CardWithList } from "@/types/Board";
import { AlignLeft } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UpdateCard } from "@/actions/update-card/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { updateCardID } from "@/lib/fetcher";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { format } from "date-fns";

interface Props {
  data: CardWithList;
}

const Description = ({ data }: Props) => {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const params = useParams();
  const [description, setDescription] = useState(data.description);

  const form = useForm<z.infer<typeof UpdateCard>>({
    resolver: zodResolver(UpdateCard),
    defaultValues: {
      ...data,
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
    onSuccess: (data) => {
      setDescription(data.description);
      startTransition(() => {
        setIsEditing(false);
      });
      queryClient.invalidateQueries({
        queryKey: ["detailCard"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listBoardColumns"],
      });

      toast.success("Schedule updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const handleSubmission = form.handleSubmit((values) => {
    updateCardInformation(values);
  });

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.handleSubmit((values) => updateCardInformation(values))();
    }
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        <Form {...form}>
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmission();
              }}
              ref={formRef}
              className="space-y-2"
            >
              <Input
                id={"description"}
                disabled={isPending}
                onFocus={enableEditing}
                onKeyDown={handleEnterPress}
                className="min-h-[78px] w-full "
                placeholder="Add a more detailed description..."
                defaultValue={description}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm items-start">
                  {errors.description.message}
                </p>
              )}
              <button type="submit" />
            </form>
          ) : (
            <div
              onClick={enableEditing}
              role="button"
              className="min-h-[78px] bg-neutral-200 text-s, font-medium py-3 px-3.5 rounded-md"
            >
              {data.description || "Add a more detailed description..."}
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
        <Skeleton className="h-[78px] w-full bg-neutral-200" />
      </div>
    </div>
  );
};
export default Description;
