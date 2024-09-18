import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { InvalidEmailPasswordError } from "./utils/error";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log("credentials are", credentials);
        let user = null;
        if (!user) {
          throw new InvalidEmailPasswordError();
        }
        console.log("user is", user);
        return user;
      },
    }),
    //add provider google
  ],

  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
});
