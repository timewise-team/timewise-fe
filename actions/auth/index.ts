import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string({
    message: "Username is required",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const RegisterSchema = z.object({
  username: z.string({
    message: "Username is required",
  }),
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  passwordConfirmation: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});
