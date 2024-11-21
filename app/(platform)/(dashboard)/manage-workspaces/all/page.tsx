"use client";

import React, { useState, useEffect } from "react";
import { Workspace } from "@/types/Board";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useLinkedEmails } from "@/hooks/useLinkedEmail";
import { fetchWorkspaces, getMembersInWorkspaceByParams } from "@/lib/fetcher";
import Link from "next/link";
import ArrowLeftIcon from "@/assets/icons/arrow-left-icon.svg";
import ArrowRightIcon from "@/assets/icons/arrow-right-icon.svg";
import {ArrowDownIcon, ArrowUpIcon} from "lucide-react";

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
    const [filterOption, setFilterOption] = useState<string>("");
    const [filterValue, setFilterValue] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [pagination, setPagination] = useState<Record<string, { currentPage: number; totalPages: number }>>({});

    const { data: workspacesData, isLoading: isWorkspacesLoading } = useQuery({
        queryKey: ["workspaces", linkedEmails],
        queryFn: async () => {
            if (!linkedEmails) return {};
            const workspacesByEmail: Record<string, Workspace[]> = {};
            await Promise.all(
                linkedEmails.map(async (email) => {
                    workspacesByEmail[email] = await fetchWorkspaces(email, session);
                })
            );
            return workspacesByEmail;
        },
        enabled: !!session && !!linkedEmails,
    });

    useEffect(() => {
        if (workspacesData) {
            setWorkspacesFromApi(workspacesData);
        }
    }, [workspacesData]);

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
                        console.error(`Failed to fetch members for workspace ID ${workspace.ID}`, error);
                    }
                }
            }
            setMemberAvatars(avatars);
        };

        if (Object.keys(workspacesFromApi).length > 0) {
            fetchMembers();
        }
    }, [JSON.stringify(workspacesFromApi), session]);

    useEffect(() => {
        // Reset filter value when the filter option changes
        setFilterValue("");
    }, [filterOption]);

    const filteredWorkspaces = Object.keys(workspacesFromApi).reduce((result, email) => {
        result[email] = workspacesFromApi[email].filter((workspace) => {
            if (filterOption === "") {
                return workspace;
            }
            if (filterOption === "type") {
                if (filterValue === "") {
                    return workspace;
                }
                return workspace.type?.toLowerCase() === filterValue.toLowerCase();
            }
            if (filterOption === "email") {
                return email.toLowerCase().includes(filterValue.toLowerCase());
            }
            if (filterOption === "name") {
                return workspace.title.toLowerCase().includes(filterValue.toLowerCase());
            }
            return true;
        });
        return result;
    }, {} as Record<string, Workspace[]>);

    const sortWorkspaces = (workspaces: Workspace[]) => {
        const sorted = [...workspaces];

        if (sortOption === "name") {
            sorted.sort((a, b) =>
                sortDirection === "asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title)
            );
        }
        if (sortOption === "created_at") {
            sorted.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
                return sortDirection === "asc"
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            });
        }
        return sorted;
    };

    useEffect(() => {
        const newPagination: Record<string, { currentPage: number; totalPages: number }> = {};
        Object.keys(filteredWorkspaces).forEach((email) => {
            if (!newPagination[email]) {
                newPagination[email] = {
                    currentPage: 1,
                    totalPages: Math.ceil(filteredWorkspaces[email].length / 3),
                };
            }
        });
        setPagination(newPagination);
    }, [JSON.stringify(filteredWorkspaces)]);

    const getCurrentWorkspaces = (email: string) => {
        const currentPage = pagination[email]?.currentPage || 1;
        const indexOfLastWorkspace = currentPage * 3;
        const indexOfFirstWorkspace = indexOfLastWorkspace - 3;
        return sortWorkspaces(filteredWorkspaces[email]).slice(indexOfFirstWorkspace, indexOfLastWorkspace);
    };

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
                    <div className="relative w-1/3">
                        <select
                            value={filterOption}
                            onChange={(e) => setFilterOption(e.target.value)}
                            className="p-3 rounded-md border border-gray-300 w-full"
                        >
                            <option value="">Filter</option>
                            <option value="type">Filter by Type</option>
                            <option value="email">Filter by Email</option>
                            <option value="name">Filter by Name</option>
                        </select>

                        {filterOption === "type" && (
                            <select
                                className="p-3 mt-2 rounded-md border border-gray-300 w-full"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="workspace">Workspace</option>
                                <option value="personal">Personal</option>
                            </select>
                        )}

                        {filterOption === "email" && (
                            <select
                                className="p-3 mt-2 rounded-md border border-gray-300 w-full"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                            >
                                <option value="">All Emails</option>
                                {linkedEmails?.map((email) => (
                                    <option key={email} value={email}>
                                        {email}
                                    </option>
                                ))}
                            </select>
                        )}

                        {filterOption === "name" && (
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="p-3 mt-2 rounded-md border border-gray-300 w-full"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                            />
                        )}
                    </div>

                    <div className="flex items-center w-1/3">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="p-3 rounded-md border border-gray-300 w-full"
                        >
                            <option value="">Sort</option>
                            <option value="name">Sort by Name</option>
                            <option value="created_at">Sort by Created At</option>
                        </select>

                        {/* Arrow button positioned to the right */}
                        {sortOption && (
                            <button
                                onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                                className="text-gray-500 p-2 ml-2"
                            >
                                {sortDirection === "asc" ? (
                                    <ArrowDownIcon/>
                                ) : (
                                    <ArrowUpIcon/>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {Object.keys(filteredWorkspaces).length > 0 ? (
                    <div className="space-y-6">
                        {Object.keys(filteredWorkspaces).map((email) => (
                            <div key={email} className="space-y-4">
                                <h3 className="text-xl font-medium text-gray-600">For {email}</h3>

                                <div className="flex items-center justify-between">
                                    {/* Left Pagination Button */}
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        {pagination[email]?.currentPage > 1 ? (
                                            <button
                                                onClick={() => changePage(email, "prev")}
                                                className="p-2 rounded-md hover:bg-gray-300 flex items-center justify-center"
                                            >
                                                <ArrowLeftIcon className="w-4 h-4"/>
                                            </button>
                                        ) : (
                                            <div className="w-4 h-4"></div>
                                            )}
                                    </div>

                                    {/* Workspaces */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 mx-4">
                                        {getCurrentWorkspaces(email).map((workspace) => (
                                            <Link key={workspace.ID} href={`/organization/${workspace.ID}`}>
                                                <div
                                                    className="flex flex-col bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer relative min-h-full">
                                                    <h4 className="text-lg font-semibold text-gray-800">{workspace.title}</h4>
                                                    <p className="text-sm text-gray-500 mt-2">{workspace.description}</p>
                                                    {workspace.extraData && (
                                                        <div className="mt-4">
                                                        <span className="px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded-md">
                                                            {workspace.extraData}
                                                        </span>
                                                        </div>
                                                    )}
                                                    {/* Badge example */}
                                                    <div className="mt-4 flex items-center space-x-2">
                                                        {workspace.type && (
                                                            <span
                                                                className="px-2 py-1 text-sm font-medium text-white bg-[#6750a4] rounded-md">
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
