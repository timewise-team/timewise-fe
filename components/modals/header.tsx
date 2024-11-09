import { CardWithList } from "@/types/Board";
import { Layout } from "lucide-react";
import React, { useRef, useState } from "react";
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
      queryClient.invalidateQueries({
        queryKey: ["detailCard", data.id],
      });
      setTitle(data.title);
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

  const { handleSubmit } = form;

  const handleSubmission = handleSubmit((values) => {
    updateCardInformation(values);
  });

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="w-5 h-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <Form {...form}>
          <form
            className="flex items-center gap-x-1"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmission();
            }}
          >
            <Input
              id="title"
              ref={inputRef}
              defaultValue={title}
              onKeyDown={handleEnterPress}
              className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
            />
          </form>
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
