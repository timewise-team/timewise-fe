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
  id: string;
  title: string;
  order: number;
  description: string;
  listId: string;
  list: List;
  createdAt: Date;
  updatedAt: Date;
};

export type List = {
  id: string;
  title: string;
  order: number;
  boardId: string;
  board: Board;
  card: Card[];
  createdAt: Date;
  updatedAt: Date;
};

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & { list: List };
