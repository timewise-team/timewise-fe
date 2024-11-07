/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";

interface Props {
  accountInformation: any;
}

export const ManageAccount = z.object({
  first_name: z
    .string({
      required_error: "First name is required",
      invalid_type_error: "First name must be a string",
    })
    .min(3, {
      message: "Title must be at least 3 characters long",
    }),
  last_name: z
    .string({
      required_error: "Last name is required",
      invalid_type_error: "Last name must be a string",
    })
    .min(3, {
      message: "Last name must be at least 3 characters long",
    }),
  profile_picture: z.string({
    required_error: "Profile picture is required",
    invalid_type_error: "Profile picture is required",
  }),
});

export const updateUserInfo = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/account/update-user`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calendar_settings: params.calendar_settings,
        first_name: params.first_name,
        last_name: params.last_name,
        notification_settings: params.notification_settings,
        profile_picture: params.profile_picture,
      }),
    }
  );
  const data = await response.json();
  return data;
};

const AccountInformation = ({ accountInformation }: Props) => {
  const form = useForm<z.infer<typeof ManageAccount>>({
    resolver: zodResolver(ManageAccount),
    defaultValues: {
      first_name: accountInformation?.first_name,
      last_name: accountInformation?.last_name,
      profile_picture: accountInformation?.profile_picture,
    },
  });

  // const { mutate: updateUserInfoMutation } = useMutation({
  //   mutationFn: async (values: z.infer<typeof ManageAccount>) => {
  //     const validatedFields = ManageAccount.safeParse(values);
  //     if (!validatedFields.success) {
  //       throw new Error("Invalid fields");
  //     }
  //     const response = await updateUserInfo(
  //       {
  //         first_name: values.first_name,
  //         last_name: values.last_name,
  //         profile_picture: values.profile_picture,
  //       },
  //       session
  //     );
  //     return response;
  //   },
  //   onSuccess: () => {
  //     toast.success("User information updated successfully");
  //     queryClient.invalidateQueries({ queryKey: ["accountInformation"] });
  //   },
  //   onError: () => {
  //     toast.error("Error updating user information");
  //   },
  // });

  return (
    <Form {...form}>
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <Image
              src={accountInformation?.profile_picture}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                defaultValue={accountInformation?.first_name}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                defaultValue={accountInformation?.last_name}
              />
            </div>
            <div className="space-y-1">
              {accountInformation?.is_verified &&
                accountInformation?.is_active && (
                  <div className="space-y-1">
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      defaultValue="Verified and Active"
                      readOnly
                    />
                  </div>
                )}
            </div>
          </CardContent>

          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AccountInformation;
