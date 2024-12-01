/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

interface Props {
  accountInformation: any;
}

export const ManageAccount = z.object({
  first_name: z
    .string()
    .min(3, "First name must be at least 3 characters long"),
  last_name: z.string().min(3, "Last name must be at least 3 characters long"),
  profile_picture: z.string(),
});

const AccountInformation = ({ accountInformation }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    accountInformation?.profile_picture || null
  );
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof ManageAccount>>({
    resolver: zodResolver(ManageAccount),
    defaultValues: {
      first_name: "",
      last_name: "",
      profile_picture: "",
    },
  });

  // Load data when accountInformation changes
  useEffect(() => {
    if (accountInformation) {
      reset({
        first_name: accountInformation.first_name || "",
        last_name: accountInformation.last_name || "",
        profile_picture: accountInformation.profile_picture || "",
      });
      setAvatarPreview(accountInformation.profile_picture || null);
    }
  }, [accountInformation, reset]);

  const handleEdit = () => {
    setIsEditing(true);

    // Reset the form to remove disabled state
    reset((prev) => ({
      ...prev,
      first_name: accountInformation.first_name || "",
      last_name: accountInformation.last_name || "",
    }));
  };

  const handleSaveChanges = async (data: z.infer<typeof ManageAccount>) => {
    setIsEditing(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/account/user`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: data.first_name,
            last_name: data.last_name,
            profile_picture: data.profile_picture, // Send updated avatar URL if changed
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }

      const responseData = await response.json();
      console.log("User information updated successfully:", responseData);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update user information:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSaveChanges)}
      key={isEditing ? "edit" : "view"}
    >
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <Image
            src={avatarPreview || "/default-avatar.png"}
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
              {...register("first_name")}
              disabled={!isEditing}
            />
            {errors.first_name && (
              <p className="text-red-500">{errors.first_name.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              id="last-name"
              {...register("last_name")}
              disabled={!isEditing}
            />
            {errors.last_name && (
              <p className="text-red-500">{errors.last_name.message}</p>
            )}
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
          {!isEditing ? (
            <Button type="button" onClick={handleEdit}>
              Change Information
            </Button>
          ) : (
            <Button type="submit">Save Changes</Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default AccountInformation;
