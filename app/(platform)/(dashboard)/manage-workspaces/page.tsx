"use client";

import React, { useState } from "react";
import { Workspace } from "@/types/Board";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useLinkedEmails } from "@/hooks/useLinkedEmail";

const ManageWorkspaces = () => {
    const { data: session } = useSession();
    const { linkedEmails, isLoading: isEmailsLoading } = useLinkedEmails();

    // Danh sách workspaces từ API
    const [workspacesFromApi, setWorkspacesFromApi] = useState<Record<string, Workspace[]>>({});

    const { isLoading: isWorkspacesLoading } = useQuery({
        queryKey: ["workspaces", linkedEmails],
        queryFn: async () => {
            if (!linkedEmails) return {};
            const workspacesByEmail: Record<string, Workspace[]> = {};
            await Promise.all(
                linkedEmails.map(async (email: string) => {
                    workspacesByEmail[email] = await fetchWorkspaces(email);
                })
            );
            setWorkspacesFromApi(workspacesByEmail);
            return workspacesByEmail;
        },
        enabled: !!session && !!linkedEmails,
    });

    const fetchWorkspaces = async (email: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace/get-workspaces-by-email/${email}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${session?.user.access_token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Error fetching workspaces for email: ${email}`);
            }
            const data = await response.json();
            return data.map((workspace: Workspace) => workspace);
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    // Hàm xử lý thêm workspace
    const handleAddWorkspace = () => {
        // const newId = localWorkspaces.length + 1;
        // const newWorkspace = {
        //     id: newId,
        //     title: `Workspace ${newId}`,
        //     description: `Description for workspace ${newId}`,
        // };
        // setLocalWorkspaces([...localWorkspaces, newWorkspace]);
    };

    // Hàm xử lý xóa workspace
    const handleDeleteWorkspace = (id: number) => {
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Workspaces</h1>

                {/* Danh sách workspace từ API */}
                {Object.keys(workspacesFromApi).length > 0 && (
                    <div>
                        {Object.keys(workspacesFromApi).map((email) => (
                            <div key={email} className="mb-6">
                                <h3 className="text-xl font-medium text-gray-600">For {email}</h3>
                                {workspacesFromApi[email].map((workspace) => (
                                    <div
                                        key={workspace.ID}
                                        className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl mt-4 transition-all"
                                    >
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800">{workspace.title}</h4>
                                            <p className="text-sm text-gray-500">{workspace.description}</p>
                                        </div>
                                        {/* Xử lý xóa workspace (nếu cần) */}
                                        {/* <button
                                            onClick={() => handleDeleteWorkspace(workspace.id)}
                                            className="text-red-500 hover:text-red-600 font-bold"
                                        >
                                            Delete
                                        </button> */}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {/* Nút thêm workspace */}
                <div className="mt-8 flex justify-start">
                    <button
                        onClick={handleAddWorkspace}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg"
                    >
                        Add Workspace
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageWorkspaces;
