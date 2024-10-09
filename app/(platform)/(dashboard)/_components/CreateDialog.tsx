"use client";
import { CreateWorkspace } from "@/actions/create-workspace/schema";
import CustomDialog from "@/components/custom-dialog";
import { Form } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const CreateDialog = () => {
  //get access token from next auth

  const form = useForm<z.infer<typeof CreateWorkspace>>({
    resolver: zodResolver(CreateWorkspace),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // const register = async (values: z.infer<typeof CreateWorkspace>) => {
  //   const validatedFields = CreateWorkspace.safeParse(values);

  //   if (!validatedFields.success) {
  //     return { error: "Invalid fields" };
  //   }
  //   const { title, description } = values;
  //   console.log("values", title);
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/register`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           // Authorization: `Bearer ${}`,
  //         },
  //         body: JSON.stringify({
  //           description,
  //           email: "asd",
  //           is_deleted: true,
  //           key: "asdad",
  //           title: "asd",
  //           type: "asd",
  //         }),
  //       }
  //     );
  //     // console.log("accesstoken in create", accessToken);
  //     const result = await response.json();

  //     if (result.error) {
  //       toast.error("error while registering");
  //       return { error: result.error };
  //     }
  //     return { success: true, data: result };
  //   } catch (error) {
  //     toast.error("error while registering");
  //     return { error: "Something went wrong!" };
  //   }
  // };

  return (
    <CustomDialog
      title={"Let's build a Workspace"}
      description={
        "Boost your productivity by making it easier for everyone to access boards in one location."
      }
      btnSubmitContent="Create Workspace"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})}>
          <div className="grid gap-4 py-4 ">
            <div className="grid grid-cols-4 items-center gap-4">
              {/* <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Username"
                        {...field}
                        type="text"
                        className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              {/* <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Username"
                        {...field}
                        type="text"
                        className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
};

export default CreateDialog;
