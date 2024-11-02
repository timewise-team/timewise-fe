/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdateCard } from "@/actions/update-card/schema";
import { UpdateList } from "@/actions/update-list/schema";
import { Card } from "@/types/Board";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const getBoardColumns = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/board_columns/workspace/${params.organizationId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
      },
    }
  );

  const data = await response.json();

  return data;
};

export const getCardByID = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedules/${params.cardId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const updateListBoardColumns = async (params: any, session: any) => {
  const validatedFields = UpdateList.safeParse(params);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/board_columns/${params.listId}`;
  console.log("updateListBoardColumns", url);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/board_columns/${params.ID}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
      },
      body: JSON.stringify({
        name: params.title,
        position: params.position,
        workspace_id: params.workspaceId,
      }),
    }
  );

  const data = await response.json();
  console.log("updateListBoardColumns", data);
  return data;
};

export const deleteCardByCardID = async (
  params: any,
  session: any
): Promise<Card> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedules/${params.schedule_id}`,
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

  if (!response.ok) {
    throw new Error("Failed to delete card");
  }

  const data: Card = await response.json();
  return data;
};

export const updateCardID = async (
  params: any,
  session: any
): Promise<Card> => {
  const validatedFields = UpdateCard.safeParse(params);
  if (!validatedFields.success) {
    throw new Error(
      `Validation failed: ${validatedFields.error.errors
        .map((err) => err.message)
        .join(", ")}`
    );
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedules/${params.cardId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
      },
      body: JSON.stringify({
        all_day: params.all_day,
        board_column_id: params.board_column_id,
        description: params.description,
        end_time: params.end_time,
        extra_data: params.extra_data,
        is_deleted: params.is_deleted,
        location: params.location,
        recurrence_pattern: params.recurrence_pattern,
        start_time: params.start_time,
        status: params.status,
        title: params.title,
        video_transcript: params.video_transcript,
        visibility: params.visibility,
        workspace_id: params.workspace_id,
        workspace_user_id: params.workspace_user_id,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update card");
  }

  const data: Card = await response.json();
  console.log("Update data:", data);
  return data;
};

export const getMembersInWorkspace = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace_user/workspace_user_list`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const getCommentByScheduleID = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/comment/schedule/${params.cardId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const getActivitiesLogs = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedule_log/schedule/${params.cardId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const getListUserInvite = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user_email/search-user_email/${params.email}`,
    {
      method: "GET",
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

export const inviteMemberToWorkspace = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace_user/send-invitation`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        role: params.role,
      }),
    }
  );
  const data = await response.json();
  return data;
};

export const updateRole = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace_user/update-role`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        role: params.role,
      }),
    }
  );

  const data = await response.json();
  return data;
};

export const removeMember = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace_user/delete-workspace_user/workspace_user_id/${params.workspaceUserId}`,
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

export const inviteMemberToCard = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedule_participant/invite`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        schedule_id: params.schedule_id,
      }),
    }
  );
  const data = await response.json();
  return data;
};
