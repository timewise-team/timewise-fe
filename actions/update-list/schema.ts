import { z } from "zod";

export const UpdateList = z.object({
  name: z
    .string({
      required_error: "Title is required!",
      invalid_type_error: "Title is required!",
    })
    .min(3, {
      message: "Title is too short!",
    }),
  workspace_id: z.number(),
  position: z.number(),
});
