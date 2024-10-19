export type Board = {
  id: string;
  orgId: string;
  title: string;
  imageId: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  imageUserName: string;
  imageLinkHTML: string;
  createdAt: Date;
  updatedAt: Date;
  list: List[];
};
export type Card = {
  allDay: boolean;
  boardColumnId: number;
  commentsCount: number;
  createdAt: string;
  createdBy: number;
  description: string;
  documentsCount: number;
  endTime: string;
  id: number;
  isDeleted: boolean;
  location: string;
  recurrencePattern: string;
  scheduleParticipants: string[];
  startTime: string;
  status: string;
  title: string;
  updatedAt: string;
  videoTranscript: string;
  visibility: string;
  workspaceId: number;
  order: number;
};

export type List = {
  id: string;
  createdAt: string;
  deletedAt: string;
  description: string;
  extraData: string;
  isDeleted: boolean;
  key: string;
  title: string;
  type: string;
  updatedAt: string;
  name: string;
  position: number;
  workspaceId: number;
  schedules: Card[];
};

export type AuditLog = {
  id: string;
  orgId: string;
  action: ACTION;
  entityId: string;
  entityType: ENTITY_TYPE;
};

export type Workspace = {
  ID: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  title: string;
  extraData: string;
  description: string;
  key: string;
  type: string;
  isDeleted: boolean;
  lists: List[];
};

export enum ACTION {
  CREATE,
  UPDATE,
  DELETE,
}

export enum ENTITY_TYPE {
  BOARD,
  LIST,
  CARD,
}

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & { list: List };
