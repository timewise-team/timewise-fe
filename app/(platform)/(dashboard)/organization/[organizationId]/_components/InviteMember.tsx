import CustomDialog from "@/components/custom-dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { toast } from "sonner";
import FormSubmit from "@/components/form/form-submit";
import Tab from "./tab";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { getListUserInvite, inviteMemberToWorkspace } from "@/lib/fetcher";
import { SendingInvitation } from "@/actions/invite-member/schema";

const InviteMember = () => {
  const { data: session } = useSession();
  const params = useParams();
  const [isCommandListOpen, setIsCommandListOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");

  const debouncedEmail = useDebounce(email, 1000);

  const form = useForm<z.infer<typeof SendingInvitation>>({
    resolver: zodResolver(SendingInvitation),
    defaultValues: {
      email: "",
      role: "admin",
    },
  });

  const handleRoleChange = (value: string) => {
    form.setValue("role", value);
  };

  const { setValue, handleSubmit } = form;

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setValue("email", value);
    if (value !== "") {
      setIsCommandListOpen(true);
    } else {
      setIsCommandListOpen(false);
    }
  };

  const { data: userInvite } = useQuery({
    queryKey: ["listUserInvite", debouncedEmail],
    queryFn: () =>
      getListUserInvite(
        {
          email: debouncedEmail,
          organizationId: params.organizationId,
        },
        session
      ),
    enabled: !!debouncedEmail && !!session,
  });

  const { mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof SendingInvitation>) => {
      const validatedFields = SendingInvitation.safeParse(values);
      if (!validatedFields.success) {
        throw new Error("Invalid fields");
      }

      const response = await inviteMemberToWorkspace(
        {
          email: values.email,
          role: values.role,
          organizationId: params.organizationId,
        },
        session
      );
      return response;
    },
  });

  const handleSubmission = handleSubmit((values) => {
    startTransition(() => {
      mutate(values, {
        onSuccess: () => toast.success("Invitation sent successfully"),
        onError: (error) => toast.error(error.message),
      });
    });
  });

  return (
    <CustomDialog
      title={"Invite to workspace"}
      description={
        "Boost your productivity by making it easier for everyone to access boards in one location."
      }
      btnSubmitContent="Invite"
      btnContentIcon={"Invite Member"}
    >
      <Form {...form}>
        <form onSubmit={handleSubmission}>
          <div className="flex flex-row items-start space-x-2 justify-between ">
            <Command className="rounded-lg border shadow-md md:min-w-[200px] w-[200px] h-auto">
              <Input
                disabled={isPending}
                id="email"
                placeholder="Type email or search..."
                onChange={(e) => handleEmailChange(e.target.value)}
                value={email}
              />
              {isCommandListOpen && (
                <CommandList>
                  <CommandGroup heading="Suggestions">
                    {Array.isArray(userInvite) && userInvite.length > 0 ? (
                      userInvite.map((user) => (
                        <CommandItem
                          key={user.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEmailChange(user.email);
                          }}
                          className="cursor-pointer"
                        >
                          <span>{user.email}</span>
                        </CommandItem>
                      ))
                    ) : (
                      <CommandEmpty>No user found</CommandEmpty>
                    )}
                  </CommandGroup>
                  <CommandSeparator />
                </CommandList>
              )}
            </Command>

            <FormField
              control={form.control}
              name={"role"}
              render={({ field }) => {
                return (
                  <FormItem key={field.value} className="w-full">
                    <Select
                      onValueChange={handleRoleChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={"Select role"}>
                            {field.value}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={"admin"}>Admin</SelectItem>
                          <SelectItem value={"member"}>Member</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                );
              }}
            />
            <FormSubmit className="w-full">Invite</FormSubmit>
          </div>
        </form>
      </Form>
      <Tab />
    </CustomDialog>
  );
};

export default InviteMember;
