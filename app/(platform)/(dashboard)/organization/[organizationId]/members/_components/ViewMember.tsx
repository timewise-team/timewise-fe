/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import InviteMember from "../../_components/InviteMember";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getMembersInWorkspace } from "@/lib/fetcher";

const ViewMember = () => {
  const { data: session } = useSession();
  const params = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["listMembers", params.organizationId],
    queryFn: async () => {
      const data = await getMembersInWorkspace(params, session);
      return data;
    },
    
  });

  if (isLoading) {
    return <div className="w-full h-full">Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-between items-start mb-4 space-y-2">
      <h1 className="text-lg font-semibold">Collaborators</h1>
      <div className="flex flex-row  space-x-5">
        <p className="bg-sky-300 p-2 rounded-sm	 text-black text-md font-semibold">
          Members
        </p>
      </div>
      <div>
        <p className="text-black text-md font-semibold">Workspace Members</p>
        <p className="text-black text-sm font-medium">
          Workspace members can view and join all Workspace visible boards and
          create new boards in the Workspace. Adding new members will
          automatically update your billing.
        </p>
        <Separator className="my-2" />
        <div className="flex flex-row items-center">
          <p className="text-black text-sm font-semibold">
            Invite members to join you
          </p>

          <InviteMember />
        </div>
        <p className="text-black text-sm font-medium max-w-[320px]">
          Anyone with an invite link can join this paid Workspace. You’ll be
          billed for each member that joins. You can also disable and create a
          new invite link for this Workspace at any time.
        </p>
        <Separator className="my-2" />
        {(Array.isArray(data) ? data : []).map((member: any) => (
          <div
            key={member.id}
            className="flex flex-row justify-between items-center w-full"
          >
            <div className="flex flex-row items-center space-x-2">
              <Image
                src={member?.profile_picture}
                alt="user"
                className="w-6 h-6 rounded-full"
                width={24}
                height={24}
              />
              <div>
                <p className="text-black text-sm font-semibold">
                  {member?.email}
                </p>
                <p className="text-black text-sm font-medium">{member?.role}</p>
              </div>
            </div>
            <div>
              <button className="text-black text-md font-semibold">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMember;
