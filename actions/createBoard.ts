"use server";

import { error } from "console";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

export type State = {
  error?: {
    title?: string[];
  };
  message?: string | null;
};

const CreateBoard = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
});

export async function create(formData: FormData) {
  const validatedFields = CreateBoard.safeParse({
    title: formData.get("title"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields",
    };
  }

  const { title } = validatedFields.data;

  try {
    const response = await fetch("/api/board", {
      method: "POST",
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error("Failed to create board");
    }
    revalidatePath("/api/board");
    redirect("/dashboard/organization/[organizationId]");
  } catch (error) {
    return { message: "Failed to create board" };
  }
}
