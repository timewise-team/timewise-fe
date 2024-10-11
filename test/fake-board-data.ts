import { defaultImages } from "@/constants/images";
import { Board, Card, List } from "@/types/Board";

export const BOARD_DATA: Board[] = [
  {
    id: "1",
    orgId: "1",
    title: "Board 1",
    imageId: "1",
    imageThumbUrl: defaultImages[2].urls.thumb,
    imageFullUrl: defaultImages[2].urls.full,
    imageUserName: "User 1",
    imageLinkHTML: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    list: [],
  },
  {
    id: "2",
    orgId: "1",
    title: "Board 2",
    imageId: "2",
    imageThumbUrl: defaultImages[2].urls.thumb,
    imageFullUrl: defaultImages[2].urls.full,
    imageUserName: "User 2",
    imageLinkHTML: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    list: [],
  },
  {
    id: "3",
    orgId: "1",
    title: "Board 3",
    imageId: "3",
    imageThumbUrl: defaultImages[2].urls.thumb,
    imageFullUrl: defaultImages[2].urls.full,
    imageUserName: "User 3",
    imageLinkHTML: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    list: [],
  },
];

export const fakeListData: List[] = [
  {
    id: "1",
    title: "List 1",
    order: 1,
    boardId: "1",
    board: BOARD_DATA[0],
    card: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "2",
    title: "List 2",
    order: 2,
    boardId: "1",
    board: BOARD_DATA[0],
    card: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const fakeCardData: Card[] = [
  {
    id: "1",
    title: "Card 1",
    order: 1,
    description: "Description 1",
    listId: "1",
    list: fakeListData[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "2",
    title: "Card 2",
    order: 2,
    description: "Description 2",
    listId: "1",
    list: fakeListData[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export type CardWithList = Card & { list: List };
