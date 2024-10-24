import * as z from "zod";

export const UpdateCard = z.object({
  all_day: z.boolean(),
  board_column_id: z.number(),
  description: z.string().min(3, {
    message: "Description is too short!",
  }),
  end_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid datetime format for end_time",
  }),
  extra_data: z.string(),
  is_deleted: z.boolean(),
  location: z.string(),
  recurrence_pattern: z.string(),
  start_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid datetime format for start_time",
  }),
  status: z.string(),
  title: z.string().min(3, {
    message: "Title is too short!",
  }),
  video_transcript: z.string(),
  visibility: z.string(),
  workspace_id: z.number(),
  workspace_user_id: z.number(),
});


