import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";
import { UpdateList } from "./schema";
import { List } from "@/types/Board";

export type InputType = z.infer<typeof UpdateList>;
export type ReturnType = ActionState<InputType, List>;
