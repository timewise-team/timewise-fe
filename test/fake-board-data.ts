import { Organization } from "@/app/(platform)/(dashboard)/_components/NavItem";
import { defaultImages } from "@/constants/images";
import { Board } from "@/types/Board";

export const BOARD_DATA: Board[] = [
  {
    id: "1",
    title: "Board 1",
    image: defaultImages[2].urls.full,
  },
  {
    id: "2",
    title: "Board 2",
    image: defaultImages[2].urls.full,
  },
  {
    id: " 3",
    title: "Board 3",
    image: defaultImages[2].urls.full,
  },
  {
    id: "4",
    title: "Board 4",
    image: defaultImages[2].urls.full,
  },
];

export const fakeData: Organization[] = [
  {
    id: "1",
    name: "Organization 1",
    slug: "organization-1",
    imgUrl: "/images/1.jpg",
  },
  {
    id: "2",
    name: "Organization 1",
    slug: "organization-1",
    imgUrl: "/images/1.jpg",
  },
];
