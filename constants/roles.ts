export const ParticipantRole = {
    creator: 'creator',
    assignTo: 'assign to',
    participant: 'participant',
    fullAccess: 'full-access',
    viewOnly: 'view-only',
}

export const ScheduleAction = {
    visibility: 'visibility',
    status: 'status',
    date: 'date',
    reminder_participant: 'reminder_participant',
    invite: 'invite',
    description: 'description',
    meet: 'meet',
    delete: 'delete',
    position: 'position',
    reminder_personal: 'reminder_personal',
    comment: 'comment',
    document: 'document',
    assign: 'assign',
};

const actionPermissions = {
    visibility: [ParticipantRole.creator, ParticipantRole.assignTo],
    status: [ParticipantRole.creator, ParticipantRole.assignTo],
    date: [ParticipantRole.creator],
    reminder_participant: [ParticipantRole.creator],
    assign: [ParticipantRole.creator],
    invite: [ParticipantRole.creator, ParticipantRole.assignTo],
    description: [ParticipantRole.creator],
    meet: [ParticipantRole.creator, ParticipantRole.assignTo],
    delete: [ParticipantRole.creator],
    position: [ParticipantRole.creator, ParticipantRole.assignTo],
    reminder_personal: [ParticipantRole.creator, ParticipantRole.assignTo, ParticipantRole.participant, ParticipantRole.fullAccess, ParticipantRole.viewOnly],
    comment: [ParticipantRole.creator, ParticipantRole.assignTo, ParticipantRole.participant, ParticipantRole.fullAccess, ParticipantRole.viewOnly],
    document: [ParticipantRole.creator, ParticipantRole.assignTo, ParticipantRole.participant, ParticipantRole.fullAccess]
};

export const checkSchedulePermission = (role: string, action: string) => {
    if (role === ParticipantRole.fullAccess) {
        return true;
    }
    const allowedRoles = actionPermissions[action];
    console.log('check', allowedRoles ? allowedRoles.includes(role) : false);
    return allowedRoles ? allowedRoles.includes(role) : false;
};