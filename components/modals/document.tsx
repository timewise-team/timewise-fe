/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { BookText, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Input } from "../ui/input";

interface Props {
  data: any;
  document: any;
  disabled?: boolean;
}

//delete file document
export const deleteDocument = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document/delete?scheduleId=${params.scheduleId}&fileName=${params.fileName}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return data;
};

const Document = ({ data, document, disabled }: Props) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const scheduleId = data.id;
  const wsId = data.workspace_id;

  const { mutate: deleteCommentMutation } = useMutation({
    mutationFn: async (document: any) => {
      const response = await deleteDocument(
        {
          scheduleId: document.schedule_id,
          fileName: document.file_name,
          organizationId: wsId,
        },
        session
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listBoardColumns"],
      });
      toast.success("Document removed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove document");
    },
  });

  const { mutate: uploadDocumentMutation } = useMutation({
    mutationFn: async () => {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("scheduleId", scheduleId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
            "X-User-Email": `${session?.user.email}`,
            "X-Workspace-ID": `${wsId}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listBoardColumns"],
      });
      toast.success("Document uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload document");
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (disabled) return;
    uploadDocumentMutation();
  };

  return (
    <>
      <Input
        type="file"
        onChange={handleFileChange}
        className="border-none cursor-pointer"
      />
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleUpload();
        }}
        className="p-2 text-black bg-transparent hover:bg-transparent gap-x-1 rounded-md w-fit "
      >
        <Plus className="h-4 w-4" />
        Add Document
      </Button>
      <div className="flex flex-row space-x-4 overflow-auto ">
        {document?.map((document: any) => (
          <div
            key={document.id}
            className="relative flex p-2 items-center bg-white shadow rounded-lg border-solid border-2 border-gray-200 h-[100px] "
          >
            <BookText className="h-6 w-6 text-gray-500" />
            <div className="flex flex-col flex-grow ml-4">
              <a
                href={document.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 font-semibold hover:cursor-pointer"
              >
                {document.file_name}
              </a>
              <span className="text-gray-500 text-sm">
                {document.file_size > 1024
                  ? `${(document.file_size / 1024).toFixed(2)} MB * Download`
                  : document.file_size}{" "}
              </span>
            </div>

            <Button
              onClick={() => deleteCommentMutation(document)}
              className="top-[-8px] right-[-9px] ml-2 p-2 rounded-full border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 bg-transparent hover:bg-transparent absolute"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Document;
