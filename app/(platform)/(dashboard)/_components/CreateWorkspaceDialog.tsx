/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { CreateWorkspace } from "@/actions/create-workspace/schema";
import CustomDialog from "@/components/custom-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import FormSubmit from "@/components/form/form-submit";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  onWorkspaceCreated: () => void;
}

const CreateDialog = ({ onWorkspaceCreated }: Props) => {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [linkedEmails, setLinkedEmails] = useState<string[]>([]);

  const form = useForm<z.infer<typeof CreateWorkspace>>({
    resolver: zodResolver(CreateWorkspace),
    defaultValues: {
      title: "",
      description: "",
      email: "",
    },
  });

  const getAllLinkedEmail = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user_emails/get-linked-email`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        }
      );
      const data = await response.json();
      const linkedEmails = data.map((email: any) => email.email);
      setLinkedEmails(linkedEmails);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (session) {
      getAllLinkedEmail();
    }
  }, [session]);

  const createWorkspace = async (values: z.infer<typeof CreateWorkspace>) => {
    const validatedFields = CreateWorkspace.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }
    console.log("session", session?.user.access_token);
    const { title, description, email } = values;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace/create-workspace`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.access_token}`,
          },
          body: JSON.stringify({
            description,
            email,
            title,
          }),
        }
      );
      const result = await response.json();

      if (result.error) {
        toast.error("error while registering");
        return { error: result.error };
      } else {
        toast.success("Workspace created successfully");
        onWorkspaceCreated();
      }

      return { success: true, data: result };
    } catch (error) {
      toast.error("error while create workspace");
      return { error: "Something went wrong!" };
    }
  };

  return (
    <CustomDialog
      title={"Let's build a Workspace"}
      description={
        "Boost your productivity by making it easier for everyone to access boards in one location."
      }
      btnSubmitContent="Create Workspace"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            startTransition(() => {
              createWorkspace(values);
            });
          })}
        >
          <div className="grid gap-4  ">
            <div className="grid grid-cols-1 items-center gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Title"
                        {...field}
                        type="text"
                        className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Description"
                        {...field}
                        type="text"
                        className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <FormField
                control={form.control}
                name={"email"}
                render={({ field }) => {
                  return (
                    <FormItem key={field.value} className="w-full">
                      <FormLabel>Email</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value)} // Update the field value with the selected email
                        value={field.value} // Pass the selected email as the value of the Select component
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={"Select email to create workspace"}
                            >
                              {field.value}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {linkedEmails.map((email) => (
                            <SelectGroup key={email}>
                              <SelectItem value={email}>
                                <SelectLabel>{email}</SelectLabel>
                              </SelectItem>
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  );
                }}
              />
            </div>
            <FormSubmit className="w-full">Create Workspace</FormSubmit>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
};

export default CreateDialog;
