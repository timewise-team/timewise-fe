/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdateCardOrder } from "@/actions/update-card-order/schema";
import { UpdateCard } from "@/actions/update-card/schema";
import { UpdateListOrder } from "@/actions/update-list-order/schema";
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

  if (response.status === 500) {
    throw new Error("User does not exist");
  }

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

//add comment
export const addComment = async (params: any, session: any): Promise<Card> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/comment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        schedule_id: params.schedule_id,
        content: params.content,
        commenter: "",
      }),
    }
  );
  const data: Card = await response.json();
  return data;
};

//detele comment by comment id
export const deleteComment = async (
  params: any,
  session: any
): Promise<Card> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/comment/${params.commentId}`,
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
  const data: Card = await response.json();
  return data;
};

//edit commnent
export const editComment = async (params: any, session: any): Promise<Card> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/comment/${params.commentId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        schedule_id: params.schedule_id,
        content: params.content,
        commenter: "",
      }),
    }
  );
  const data: Card = await response.json();
  return data;
};

//update user infor-
export const updateUserInfo = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/account/update-user`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calendar_settings: params.calendar_settings,
        first_name: params.first_name,
        last_name: params.last_name,
        notification_settings: params.notification_settings,
        profile_picture: params.profile_picture,
      }),
    }
  );
  const data = await response.json();
  return data;
};

//link email
export const linkEmail = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/account/user/emails/send?email=${params.email}`,
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

//unlink email
export const unlinkEmail = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/account/unlink-email/${params.email}`,
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

//assignee
export const AssigneeSchedules = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedule_participant/assign`,
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
        schedule_id: params.schedule_id,
        organizationId: params.organizationId,
      }),
    }
  );
  const data = await response.json();
  return data;
};

//get schedule by id
export const getScheduleByID = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedule_participant/schedule/${params.schedule_id}`,
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

//get user information
export const getAccountInformation = async (session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/account/user`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};

//detele board column by id
export const deleteListBoardColumns = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/board_columns/${params.listId}`,
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

//update board column by board id
export const updateListBoardColumns = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/board_columns/${params.listId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: params.name,
      }),
    }
  );
  const data = await response.json();
  return data;
};

//update card information
export const updateCardID = async (
  params: any,
  session: any
): Promise<Card> => {
  const validatedFields = UpdateCard.safeParse(params);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedules/${params.cardId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        all_day: params.all_day,
        description: params.description,
        end_time: params.end_time,
        extra_data: params.extra_data,
        location: params.location,
        priority: params.priority,
        recurrence_pattern: params.recurrence_pattern,
        start_time: params.start_time,
        status: params.status,
        title: params.title,
        video_transcript: params.video_transcript,
        visibility: params.visibility,
        workspace_id: params.workspace_id,
      }),
    }
  );

  const data: Card = await response.json();
  return data;
};

//get document by schedule id
export const getDocumentByScheduleID = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document/schedule/${params.cardId}`,
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

export const updateCardPosition = async (params: any, session: any) => {
  const validatedFields = UpdateCardOrder.safeParse(params);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedules/position/${params.cardId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_column_id: params.board_column_id,
        position: params.position,
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error("Server error: Failed to update card position");
    } else {
      throw new Error("Failed to update card position");
    }
  }

  return response.json();
};

export const updateBoardOrder = async (params: any, session: any) => {
  const validatedFields = UpdateListOrder.safeParse(params);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/board_columns/update_position/${params.board_column_id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        position: params.position,
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error("Server error: Failed to update Board position");
    } else {
      throw new Error("Failed to update Board position");
    }
  }

  const data = await response.json();
  return data;
};
