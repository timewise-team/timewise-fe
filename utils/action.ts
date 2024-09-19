"use server";
import { signIn } from "@/auth";

export async function authenticate(username: string, password: string) {
  try {
    const r = await signIn("credentials", {
      username: username,
      password: password,
      //   callbackUrl: "/",
      redirect: false,
    });
    console.log("r", r);
    return r;
  } catch (error) {
    return {
      error: "incorrect username or password",
    };
  }
}
