import { z } from "zod";

export const CreateWorkspace = z.object({
  title: z
    .string({
      required_error: "Title is required!",
      invalid_type_error: "Title is required!",
    })
    .min(3, {
      message: "Title is too short!",
    }),
  description: z
    .string({
      required_error: "Description is required!",
      invalid_type_error: "Description is required!",
    })
    .min(5, {
      message: "Description is too short!",
    }),
  email: z.string({
    required_error: "Email is required!",
    invalid_type_error: "Email is required!",
  }),
});
