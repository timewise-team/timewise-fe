/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/Button";
import AddLinkEmail from "./add-link-email";
//import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLinkedEmailsForManage } from "@/hooks/useLinkedEmailForManage";
import { toast } from "sonner";
import {useState} from "react";

const emailStatusOptions = ["linked", "pending"];
//unlink email
export const unlinkEmail = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/account/user/emails/unlink?email=${params.email}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
      }),
    }
  );
  const data = await response.json();
  return data;
};

const LinkedEmail = () => {
  const [emailStatus, setEmailStatus] = useState<string>("linked");
  const { linkedEmails, isLoading } = useLinkedEmailsForManage(emailStatus);
  const queryClient = useQueryClient();

  const { mutate: unlinkEmailMutation } = useMutation({
    mutationFn: async (email: any) => {
      const { user } = queryClient.getQueryData(["session"]) as {
        user: { access_token: string };
      };
      return unlinkEmail(email, user.access_token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linked-email", emailStatus] });
      toast.success("Email unlinked successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unlink email");
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Linked Email</CardTitle>
        <div className="flex items-center gap-4 ml-auto">
          <select
              className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={emailStatus}
              onChange={(e) => setEmailStatus(e.target.value)}
          >
            {emailStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
            ))}
          </select>
          <AddLinkEmail/>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
            <p>Loading...</p>
        ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Linked Email</TableHead>
                  {emailStatus === "linked" ? (
                      <TableHead>Action</TableHead>
                  ) : (
                      <TableHead>Status</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkedEmails?.map((email: string) => (
                    <TableRow key={email}>
                      <TableCell className="font-medium">{email}</TableCell>
                      {emailStatus === "linked" ? (
                          <TableCell>
                            <Button
                                className="hover:bg-sky-50 bg-transparent text-red-500"
                                onClick={() => unlinkEmailMutation(email)}
                            >
                              Unlink
                            </Button>
                          </TableCell>
                      ) : (
                          <TableCell className="text-gray-500">Pending</TableCell>
                      )}
                    </TableRow>
                ))}
              </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={1}>Total</TableCell>
              <TableCell className="text-right">{linkedEmails?.length || 0}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedEmail;
