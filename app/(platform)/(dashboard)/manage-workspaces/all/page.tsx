"use client";

import React, { useState } from "react";
import { Workspace } from "@/types/Board";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useLinkedEmails } from "@/hooks/useLinkedEmail";
import { fetchWorkspaces } from "@/lib/fetcher";
import Link from "next/link"; // Import Link from next/link

const ManageWorkspaces = () => {
    const { data: session } = useSession();
    const { linkedEmails } = useLinkedEmails();

    const [workspacesFromApi, setWorkspacesFromApi] = useState<Record<string, Workspace[]>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("name"); // Default sort by name

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isLoading: isWorkspacesLoading } = useQuery({
        queryKey: ["workspaces", linkedEmails],
        queryFn: async () => {
            if (!linkedEmails) return {};
            const workspacesByEmail: Record<string, Workspace[]> = {};
            await Promise.all(
                linkedEmails.map(async (email) => {
                    workspacesByEmail[email] = await fetchWorkspaces(email, session);
                })
            );
            setWorkspacesFromApi(workspacesByEmail);
            return workspacesByEmail;
        },
        enabled: !!session && !!linkedEmails,
    });

    // Lọc workspace theo tên
    const filteredWorkspaces = Object.keys(workspacesFromApi).reduce((result, email) => {
        result[email] = workspacesFromApi[email].filter((workspace) =>
            workspace.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return result;
    }, {} as Record<string, Workspace[]>);

    // Sắp xếp workspace theo tiêu chí đã chọn
    const sortWorkspaces = (workspaces: Workspace[]) => {
        if (sortOption === "name") {
            return workspaces.sort((a, b) => a.title.localeCompare(b.title)); // Sort by name
        }
        if (sortOption === "created_at") {
            return workspaces.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // Sort by created_at
        }
        return workspaces; // Default: no sorting
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Workspaces</h1>

                {/* Thêm ô lọc */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search workspaces..."
                        className="p-3 w-full rounded-md border border-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Thêm dropdown để chọn sắp xếp */}
                <div className="mb-6">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="p-3 w-full rounded-md border border-gray-300"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="created_at">Sort by Created At</option>
                    </select>
                </div>

                {/* Danh sách workspace từ API */}
                {Object.keys(filteredWorkspaces).length > 0 ? (
                    <div className="space-y-6">
                        {Object.keys(filteredWorkspaces).map((email) => (
                            <div key={email} className="space-y-4">
                                <h3 className="text-xl font-medium text-gray-600">For {email}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sortWorkspaces(filteredWorkspaces[email]).map((workspace) => (
                                        <Link
                                            key={workspace.ID}
                                            href={`/organization/${workspace.ID}`} // Redirect to workspace details page
                                        >
                                            <div className="flex flex-col bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                                                <h4 className="text-lg font-semibold text-gray-800">{workspace.title}</h4>
                                                <p className="text-sm text-gray-500 mt-2">{workspace.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-gray-500 mt-4">No workspaces found</div>
                )}
            </div>
        </div>
    );
};

export default ManageWorkspaces;
