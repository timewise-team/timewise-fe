"use server";

import * as z from "zod";
import { RegisterSchema } from ".";
// remove toast from server-side code

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    const response = await fetch(
      "https://timewise.space/api/v1/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );
    const result = await response.json();
    //log password and confirm password
    console.log("pwd", values.password);
    console.log("cfpwd", values.passwordConfirmation);
    console.log("result", result);
    //log name of fetch api
    console.log("fetch", `${process.env.API_BASE_URL}/auth/register`);

    if (result.error) {
      return { error: result.error };
    }
    return { success: true, data: result };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
