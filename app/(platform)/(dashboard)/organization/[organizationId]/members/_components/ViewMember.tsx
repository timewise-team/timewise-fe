/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import InviteMember from "../../_components/InviteMember";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { getMembersInWorkspaceForManage, updateRole, removeMember } from "@/lib/fetcher";
import { Delete } from "lucide-react"; // Add icon library for delete icon

const ViewMember = () => {
    const { data: session } = useSession();
    const params = useParams();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["listMembers", params.organizationId],
        queryFn: async () => {
            const data = await getMembersInWorkspaceForManage(params, session);
            return data;
        },
    });

    const mutationRoleChange = useMutation({
        mutationFn: async ({ memberId, newRole }: { memberId: any; newRole: string }) => {
            return updateRole({ memberId, newRole }, session);
        },
        onSuccess: () => refetch(),
    });

    const mutationRemoveMember = useMutation({
        mutationFn: async (memberId) =>
            removeMember({ ...params, memberId }, session),
        onSuccess: () => refetch(),
    });

    const handleRoleChange = (memberId: any, newRole: string) => {
        mutationRoleChange.mutate({ memberId, newRole });
    };

    const handleRemoveMember = (memberId: any) => {
        mutationRemoveMember.mutate(memberId);
    };

    if (isLoading) {
        return (
            <div
                className="flex justify-center items-center"
                style={{
                    fontSize: "18px",
                    color: "#6c5ce7",
                    height: "100vh",
                }}
            >
                Loading...
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Team</h2>
                <InviteMember/>
            </div>
            <Separator className="my-2" style={{borderTop: "1px solid #e0e0e0"}}/>
            {/* Container with scroll */}
            <div className="overflow-y-auto max-h-[70vh]">
                {(Array.isArray(data) ? data : []).map((member) => (
                    <div
                        key={member.id}
                        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-3 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <Image
                                src={member?.profile_picture || "/default-avatar.png"}
                                alt="user"
                                className="w-10 h-10 rounded-full"
                                width={40}
                                height={40}
                            />
                            <div>
                                <p className="text-sm text-gray-800" style={{fontSize: "20px"}}>
                                    {member?.first_name} {member?.last_name}
                                    {member?.email === session?.user?.email && " (You)"}
                                </p>
                                <p className="text-sm text-gray-500">{member?.email}</p>
                                <span
                                    className={`text-xs font-semibold px-2 py-1 rounded ${
                                        member?.is_active
                                            ? "bg-green-100 text-green-700"
                                            : member?.status === "joined"
                                                ? "bg-gray-100 text-gray-700"
                                                : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                            {member?.is_active
                                ? "Active"
                                : member?.status === "joined"
                                    ? "Inactive"
                                    : "Invited"}
                        </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={member?.role}
                                onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                                <option value="owner">Owner</option>
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                                <option value="viewer">Guest</option>
                            </select>
                            {member?.email !== session?.user?.email && (
                                <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Delete size={18}/>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewMember;
