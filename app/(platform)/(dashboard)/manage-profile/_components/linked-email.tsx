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
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  accountInformation: any;
}

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

const LinkedEmail = ({ accountInformation }: Props) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { mutate: unlinkEmailMutation } = useMutation({
    mutationFn: async (params: any) => {
      const response = await unlinkEmail(params, session);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accountInformation"],
      });
      toast.success("Unlink successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unlink email");
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <CardTitle>Linked Email</CardTitle>
        <AddLinkEmail />
      </CardHeader>
      <CardContent className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Linked Email</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(accountInformation?.email) &&
              accountInformation?.email.map(
                (emailObj: { email: string; status: string }) => (
                  <TableRow key={emailObj.email}>
                    <TableCell className="font-medium">
                      {emailObj.email}
                    </TableCell>
                    {session?.user.email !== emailObj.email && (
                      <TableCell>
                        <Button
                          className="hover:bg-sky-50 bg-transparent text-red-500"
                          onClick={() => {
                            unlinkEmailMutation({ email: emailObj.email });
                          }}
                        >
                          Unlink
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                )
              )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={1}>Total</TableCell>
              <TableCell className="text-right">
                {Array.isArray(accountInformation?.email)
                  ? accountInformation?.email.length
                  : 0}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LinkedEmail;
