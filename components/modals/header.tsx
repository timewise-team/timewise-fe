import { CardWithList } from "@/types/Board";
import { Layout } from "lucide-react";
import React, { ElementRef, useRef, useState } from "react";
import FormInput from "../form/form-input";
import { Skeleton } from "../ui/skeleton";

interface Props {
  data: CardWithList;
}
const Header = ({ data }: Props) => {
  const [title, setTitle] = useState(data.title);
  const inputRef = useRef<ElementRef<"input">>(null);

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
    setTitle(data.title);
  };

  // const { execute } = useAction(updateCard, {
  //   onSuccess: (data: Card) => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["card", data.id],
  //     });

  //     queryClient.invalidateQueries({
  //       queryKey: ["card-logs", data.id],
  //     });

  //     toast.success(`Renamed to ${data.title}!`);
  //     setTitle(data.title);
  //   },
  //   onError: (error) => {
  //     toast.error(error);
  //   },
  // });

  // const onSubmit = (formData: FormData) => {
  //   const title = formData.get("title") as string;
  //   // const boardId = params.boardId as string;

  //   if (title === data.title) {
  //     return;
  //   }

  //   // execute({
  //   //   title,
  //   //   boardId,
  //   //   id: data.id,
  //   // });
  // };

  return (
    <div className=" flex items-start gap-x-3 mb-6 w-full">
      <Layout className="w-5 h-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form action="">
          <FormInput
            id="title"
            ref={inputRef}
            onBlur={onBlur}
            defaltValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
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
