import {Workspace} from "@/types/Board";

export const getUserEmailByWorkspace = (
    stateUserEmails: { email: string; id: number; status: string }[],
    stateWorkspacesByEmail: Record<string, Workspace[]>,
    workspaceId: number
) => {
    for (const email in stateWorkspacesByEmail) {
        const workspaces = stateWorkspacesByEmail[email];
        if (workspaces.some((workspace) => workspace.ID === workspaceId)) {
            return stateUserEmails.find(userEmail => userEmail.email === email);
        }
    }
    return null;
};
