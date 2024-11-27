/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, {useEffect, useState} from "react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import InviteMember from "../../_components/InviteMember";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { getCurrentWorkspaceUserInfo, getMembersInWorkspace, getMembersInWorkspaceForManage, updateRole, removeMember } from "@/lib/fetcher";
import { Delete } from "lucide-react";

const ViewMember = () => {
    const { data: session } = useSession();
    const params = useParams();
    const organizationId = params.organizationId;
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("first_name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [filteredMembers, setFilteredMembers] = useState<any[]>([]);

    // Fetch current user's workspace info
    const { data: currentUserInfo, isLoading: isLoadingUserInfo } = useQuery({
        queryKey: ["currentUserInfo", organizationId],
        queryFn: async ({ queryKey }) => {
            const [, orgId] = queryKey;
            if (!session?.user?.email || !orgId) return null;
            return await getCurrentWorkspaceUserInfo({ organizationId: orgId }, session);
        },
        enabled: !!organizationId,
    });

    const { data: membersData, isLoading, refetch } = useQuery({
        queryKey: ["listMembers", organizationId],
        queryFn: async () => {
            const fetcher =
                currentUserInfo?.role === "admin" || currentUserInfo?.role === "owner"
                    ? getMembersInWorkspaceForManage
                    : getMembersInWorkspace;
            return await fetcher(params, session);
        },
        enabled: !!currentUserInfo?.role,
    });

    useEffect(() => {
        let filtered = Array.isArray(membersData)
            ? membersData?.filter((member: any) => {
            const term = searchTerm.toLowerCase();
            return (
                member.first_name.toLowerCase().includes(term) ||
                member.last_name.toLowerCase().includes(term) ||
                member.email.toLowerCase().includes(term)
            );
        }) : [];

        filtered = filtered?.sort((a: any, b: any) => {
            const fieldA = a[sortBy]?.toLowerCase?.() || "";
            const fieldB = b[sortBy]?.toLowerCase?.() || "";
            if (sortOrder === "asc") {
                return fieldA > fieldB ? 1 : -1;
            }
            return fieldA < fieldB ? 1 : -1;
        });

        setFilteredMembers(filtered || []);
    }, [searchTerm, sortBy, sortOrder, membersData]);

    const mutationRoleChange = useMutation({
        mutationFn: async ({ organizationId, email, role }: { organizationId: any; email: any; role: any }) => {
            return updateRole({ organizationId, email, role }, session);
        },
        onSuccess: () => refetch(),
    });

    const mutationRemoveMember = useMutation({
        mutationFn: async (workspaceUserId) =>
            removeMember({ organizationId, workspaceUserId }, session),
        onSuccess: () => refetch(),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [members, setMembers] = React.useState<any[]>([]);

    const handleRoleChange = async (organizationId: string | string[], email: string, role: string) => {
        const currentUser = membersData?.find(
            (member: { email: string | null | undefined }) => member.email === session?.user?.email
        );
        if (currentUser?.role === "owner" && role === "owner" && email !== session?.user?.email) {
            await mutationRoleChange.mutateAsync({ organizationId, email, role });
            await mutationRoleChange.mutateAsync({ organizationId, email: session?.user?.email, role: "member" });
        } else if (currentUser?.role === "owner") {
            await mutationRoleChange.mutateAsync({ organizationId, email, role });

            if (email === session?.user?.email) {
                await mutationRoleChange.mutateAsync({ organizationId, email: session?.user?.email, role: "member" });
            }
        } else {
            await mutationRoleChange.mutateAsync({ organizationId, email, role });
        }
        setMembers((prevMembers: any[]) =>
            prevMembers.map((member) =>
                member.email === email ? { ...member, role: role } : member
            )
        );
        refetch();
    };

    const handleRemoveMember = (memberId: any) => {
        mutationRemoveMember.mutate(memberId);
    };

    const handleLeaveWorkspace = (wspUserId: any) => {
        mutationRemoveMember.mutate(wspUserId);
    };

    const handleModalAction = async () => {
        if (modalAction === "changeRole") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const { email, role } = modalData;
            await handleRoleChange(organizationId, email, role);
        } else if (modalAction === "removeMember") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const { memberId } = modalData;
            await handleRemoveMember(memberId);
        } else if (modalAction === "leaveWorkspace") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const { wspUserId } = modalData;
            await handleLeaveWorkspace(wspUserId);
        }
        setModalOpen(false);
        refetch();
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const openModal = (action, data) => {
        setModalAction(action);
        setModalData(data);
        setModalOpen(true);
    };

    if (isLoading || isLoadingUserInfo) {
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Team</h2>
                {currentUserInfo?.role === "owner" && <InviteMember/>}
            </div>
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by name or email"
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                >
                    <option value="first_name">First Name</option>
                    <option value="last_name">Last Name</option>
                    <option value="email">Email</option>
                </select>

                <button
                    onClick={toggleSortOrder}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                >
                    {sortOrder === "asc" ? "Sort ASC" : "Sort DESC"}
                </button>
            </div>

            <Separator className="my-2" style={{borderTop: "1px solid #e0e0e0"}}/>
            <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Team</h2>
                    {currentUserInfo?.role === "owner" && <InviteMember/>}
                </div>
                <Separator className="my-2" style={{borderTop: "1px solid #e0e0e0"}}/>
                <div className="overflow-y-auto max-h-[70vh]">
                    {(Array.isArray(filteredMembers) ? filteredMembers : []).map((member) => (
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
                                {
                                    (currentUserInfo?.role === "admin" || currentUserInfo?.role === "owner") ? (
                                        member.role === "owner" || member.email === session?.user?.email ? (
                                            <p className="text-sm text-gray-700 font-semibold">{member.role}</p>
                                        ) : member.status === "pending" || !member.is_active ? (
                                            <p className="text-sm text-gray-700">{member?.role}</p>
                                        ) : (
                                            <select
                                                value={member?.role}
                                                onChange={(e) =>
                                                    openModal("changeRole", {email: member.email, role: e.target.value})
                                                }
                                                className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:border-indigo-300 transition-all"
                                            >
                                                {(currentUserInfo?.role === "owner") ?
                                                    <option value="owner">Owner</option> : ""}
                                                <option value="admin">Admin</option>
                                                <option value="member">Member</option>
                                                <option value="guest">Guest</option>
                                            </select>
                                        )
                                    ) : (
                                        <p className="text-sm text-gray-700">{member?.role}</p>
                                    )
                                }
                                {(currentUserInfo?.role === "owner" || currentUserInfo?.role === "admin") && member?.email !== session?.user?.email
                                    && member?.role !== "owner" && (
                                        <button
                                            onClick={() => openModal("removeMember", {memberId: member.id})}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Delete size={18}/>
                                        </button>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    {currentUserInfo?.role === "owner" ? (
                        <p className="text-gray-600 italic">
                            Owners cannot leave the workspace without transferring ownership.
                        </p>
                    ) : (
                        <button
                            onClick={() => openModal("leaveWorkspace", {wspUserId: currentUserInfo?.ID})}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Leave Workspace
                        </button>
                    )}
                </div>
                {/* Confirmation Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <p className="text-lg font-semibold mb-4">
                                Are you sure you want to {modalAction === "changeRole" && "change the role"}
                                {modalAction === "removeMember" && "remove this member"}
                                {modalAction === "leaveWorkspace" && "leave this workspace"}?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleModalAction}
                                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewMember;
