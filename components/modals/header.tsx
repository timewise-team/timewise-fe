import { CardWithList } from "@/types/Board";
import { Layout } from "lucide-react";
import React, { useRef, useState, useTransition } from "react";
import { Skeleton } from "../ui/skeleton";
import { UpdateCard } from "@/actions/update-card/schema";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { updateCardID } from "@/lib/fetcher";

interface Props {
  data: CardWithList;
}

const Header = ({ data }: Props) => {
  const [title, setTitle] = useState(data.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

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
          all_day: values.all_day,
          description: values.description,
          end_time: values.end_time,
          extra_data: values.extra_data,
          location: values.location,
          priority: values.priority,
          recurrence_pattern: values.recurrence_pattern,
          start_time: values.start_time,
          status: values.status,
          title: values.title,
          organizationId: params.organizationId,
        },
        session
      );
      return response;
    },
    onSuccess: (data) => {
      setTitle(data.title);
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
      toast.error(error.message || "Failed to update schedule");
    },
  });

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.handleSubmit((values) => updateCardInformation(values))();
    }
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

  const handleSubmission = handleSubmit((values) => {
    updateCardInformation(values);
  });

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="w-5 h-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <Form {...form}>
          {isEditing ? (
            <>
              <form
                className="flex flex-col items-start gap-x-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmission();
                }}
              >
                <Input
                  id="title"
                  disabled={isPending}
                  onFocus={enableEditing}
                  defaultValue={title}
                  onKeyDown={handleEnterPress}
                  {...register("title")}
                  className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm items-start">
                    {errors.title.message}
                  </p>
                )}
                <button type="submit" />
              </form>
            </>
          ) : (
            <div
              onClick={enableEditing}
              className="flex flex-row items-center w-full text-sm px-2.5 py-1 h-7 font-bold border-transparent"
            >
              {data.title}
            </div>
          )}
        </Form>
        <p className="text-sm text-muted-foreground">
          In List <span className="underline">{data.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex-items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 ,t-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};

export default Header;
