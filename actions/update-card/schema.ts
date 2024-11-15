import * as z from "zod";

export const UpdateCard = z.object({
  all_day: z.boolean(),
  description: z.string(),
  end_time: z.string().refine(
    (val) => {
      const endDate = new Date(val);
      const currentDate = new Date();
      if (endDate < currentDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date must be greater than or equal to the current date",
    }
  ),
  extra_data: z.string(),
  location: z.string(),
  priority: z.string(),
  recurrence_pattern: z.string(),
  start_time: z.string().refine(
    (val) => {
      const startDate = new Date(val);
      const currentDate = new Date();
      if (startDate < currentDate) {
        return false;
      }
      return true;
    },
    {
      message: "Start date must be greater than or equal to the current date",
    }
  ),
  status: z.string(),
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(3, {
      message: "Title must be at least 3 characters long",
    }),
});
