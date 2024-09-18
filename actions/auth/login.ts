"use server";

import { z } from "zod";
import { LoginSchema } from ".";

export const login = async (value: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(value);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }
  const { username, password } = validatedFields.data;

  try {
    // const r = await signIn({
    //     // username,
    //     // password,
    //     // redirect: false,
    // });
  } catch (error) {
    return {
      error: "incorrect username or password",
      success: "",
    };
  }
};
