"use client";

import React, { useState, useEffect } from "react";
import { Workspace } from "@/types/Board";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useLinkedEmails } from "@/hooks/useLinkedEmail";
import { fetchWorkspaces, getMembersInWorkspaceByParams } from "@/lib/fetcher";
import Link from "next/link";

// Import SVG icons
import ArrowLeftIcon from "@/assets/icons/arrow-left-icon.svg";
import ArrowRightIcon from "@/assets/icons/arrow-right-icon.svg";

type Member = {
    profile_picture: string;
    email: string;
    first_name: string;
    last_name: string;
};

const ManageWorkspaces = () => {
    const { data: session } = useSession();
    const { linkedEmails } = useLinkedEmails();

    const [workspacesFromApi, setWorkspacesFromApi] = useState<Record<string, Workspace[]>>({});
    const [memberAvatars, setMemberAvatars] = useState<Record<string, Member[]>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("name"); // Default sort by name
    const [pagination, setPagination] = useState<Record<string, { currentPage: number; totalPages: number }>>({});

    // Fetch workspaces
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

    // Fetch members for each workspace
    useEffect(() => {
        const fetchMembers = async () => {
            const avatars: Record<string, Member[]> = {};

            for (const email in workspacesFromApi) {
                for (const workspace of workspacesFromApi[email]) {
                    try {
                        const members = await getMembersInWorkspaceByParams(
                            { organizationId: workspace.ID, userEmail: email },
                            session
                        );
                        const memberList = Array.isArray(members) ? members : members.data || [];
                        avatars[workspace.ID] = memberList.map((member: any) => ({
                            profile_picture: member.profile_picture,
                            email: member.email,
                            first_name: member.first_name,
                            last_name: member.last_name,
                        }));
                    } catch (error) {
                        console.error(
                            `Failed to fetch members for workspace ID ${workspace.ID} and email ${email}`,
                            error
                        );
                    }
                }
            }
            setMemberAvatars(avatars);
        };

        if (Object.keys(workspacesFromApi).length > 0) {
            fetchMembers();
        }
    }, [workspacesFromApi, session]);

    // Filter workspaces
    const filteredWorkspaces = Object.keys(workspacesFromApi).reduce((result, email) => {
        result[email] = workspacesFromApi[email].filter((workspace) =>
            workspace.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return result;
    }, {} as Record<string, Workspace[]>);

    // Sort workspaces
    const sortWorkspaces = (workspaces: Workspace[]) => {
        if (sortOption === "name") {
            return workspaces.sort((a, b) => a.title.localeCompare(b.title));
        }
        if (sortOption === "created_at") {
            return workspaces.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
        }
        return workspaces; // Default: no sorting
    };

    // Initialize pagination for each email
    useEffect(() => {
        const newPagination: Record<string, { currentPage: number; totalPages: number }> = {};
        Object.keys(filteredWorkspaces).forEach((email) => {
            if (!newPagination[email]) {
                newPagination[email] = {
                    currentPage: 1,
                    totalPages: Math.ceil(filteredWorkspaces[email].length / 6),
                };
            }
        });
        setPagination(newPagination);
    }, [filteredWorkspaces]);

    // Get current workspaces for pagination
    const getCurrentWorkspaces = (email: string) => {
        const currentPage = pagination[email]?.currentPage || 1;
        const indexOfLastWorkspace = currentPage * 6;
        const indexOfFirstWorkspace = indexOfLastWorkspace - 6;
        return sortWorkspaces(filteredWorkspaces[email]).slice(indexOfFirstWorkspace, indexOfLastWorkspace);
    };

    // Pagination controls
    const changePage = (email: string, direction: "prev" | "next") => {
        setPagination((prev) => {
            const currentPage = prev[email]?.currentPage || 1;
            const totalPages = prev[email]?.totalPages || 1;

            const newPage =
                direction === "prev"
                    ? Math.max(currentPage - 1, 1)
                    : Math.min(currentPage + 1, totalPages);

            return {
                ...prev,
                [email]: {
                    ...prev[email],
                    currentPage: newPage,
                },
            };
        });
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Workspaces</h1>

                <div className="flex items-center justify-between mb-6 space-x-4">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="p-3 rounded-md border border-gray-300 w-1/3"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="created_at">Sort by Created At</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search workspaces..."
                        className="p-3 rounded-md border border-gray-300 w-1/3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {Object.keys(filteredWorkspaces).length > 0 ? (
                    <div className="space-y-6">
                        {Object.keys(filteredWorkspaces).map((email) => (
                            <div key={email} className="space-y-4">
                                <h3 className="text-xl font-medium text-gray-600">For {email}</h3>

                                <div className="flex items-center justify-between">
                                    {/* Left Pagination Button */}
                                    {pagination[email]?.currentPage > 1 && (
                                        <button
                                            onClick={() => changePage(email, "prev")}
                                            className="p-2 rounded-md hover:bg-gray-300 flex items-center justify-center"
                                        >
                                            <ArrowLeftIcon className="w-4 h-4" />
                                        </button>
                                    )}

                                    {/* Workspaces */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 mx-4">
                                        {getCurrentWorkspaces(email).map((workspace) => (
                                            <Link key={workspace.ID} href={`/organization/${workspace.ID}`}>
                                                <div
                                                    className="flex flex-col bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer relative">
                                                    <h4 className="text-lg font-semibold text-gray-800">{workspace.title}</h4>
                                                    <p className="text-sm text-gray-500 mt-2">{workspace.description}</p>

                                                    {/* Badge example */}
                                                    <div className="mt-4 flex items-center space-x-2">
                                                        {workspace.type && (
                                                            <span
                                                                className="px-2 py-1 text-sm font-medium text-white bg-green-500 rounded-md">
                                {workspace.type}
                              </span>
                                                        )}
                                                    </div>

                                                    {/* Member Avatars */}
                                                    <div
                                                        className="flex flex-row items-center justify-end mt-4 space-x-2">
                                                        {memberAvatars[workspace.ID]?.slice(0, 3).map((member, index) => (
                                                            <img
                                                                key={index}
                                                                src={member.profile_picture}
                                                                alt={member.first_name || "Member Avatar"}
                                                                className="w-8 h-8 rounded-full border border-gray-300"
                                                            />
                                                        ))}
                                                        {memberAvatars[workspace.ID]?.length > 3 && (
                                                            <div
                                                                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-semibold">
                                                                +{memberAvatars[workspace.ID].length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Right Pagination Button */}
                                    {pagination[email]?.currentPage < pagination[email]?.totalPages && (
                                        <button
                                            onClick={() => changePage(email, "next")}
                                            className="p-2 rounded-md hover:bg-gray-300 flex items-center justify-center"
                                        >
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No workspaces found.</p>
                )}
            </div>
        </div>
    );
};

export default ManageWorkspaces;
