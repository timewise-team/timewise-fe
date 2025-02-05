import { ActionState } from "@/lib/create-safe-action";
import { List } from "@/types/Board";
import { z } from "zod";
import { DeleteList } from "./schema";

export type InputType = z.infer<typeof DeleteList>;
export type ReturnType = ActionState<InputType, List>;
