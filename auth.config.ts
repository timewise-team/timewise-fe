import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./actions/auth";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { username, password } = validatedFields.data;

          // const user = await getUserByEmail(email);
          // if (!user || !user.password) return null;

          // const passwordMatches = await bcrypt.compare(password, user.password);

          // if (passwordMatches) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
