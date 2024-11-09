import { z } from "zod";

export const UpdateListOrder = z.object({
  position: z.number(),
});
