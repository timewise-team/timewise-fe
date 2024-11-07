import * as z from "zod";

export const UpdateCard = z.object({
  all_day: z.boolean(),
  board_column_id: z.number(),
  description: z.string(),
  end_time: z.string(),
  extra_data: z.string(),
  is_deleted: z.boolean(),
  location: z.string(),
  position: z.number(),
  priority: z.string(),
  recurrence_pattern: z.string(),
  start_time: z.string(),
  status: z.string(),
  title: z.string(),
  video_transcript: z.string(),
  visibility: z.string(),
  workspace_id: z.number(),
  workspace_user_id: z.number(),
});
