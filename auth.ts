import { cookies, headers } from "next/headers";

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { InvalidEmailPasswordError } from "./utils/error";

export const privateRoutes = ["/account", "/settings"];
// @ts-ignore
async function refreshAccessToken(token) {
  // this is our refresh token method
  console.log("Now refreshing the expired token...");
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ userID: token.userId }),
      }
    );

    const { success, data } = await res.json();

    if (!success) {
      console.log("The token could not be refreshed!");
      throw data;
    }

    console.log("The token has been refreshed successfully.");

    // get some data from the new access token such as exp (expiration time)
    const decodedAccessToken = JSON.parse(
      Buffer.from(data.accessToken.split(".")[1], "base64").toString()
    );

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      idToken: data.idToken,
      accessTokenExpires: decodedAccessToken["exp"] * 1000,
      error: "",
    };
  } catch (error) {
    console.log(error);

    // return an error if somethings goes wrong
    return {
      ...token,
      error: "RefreshAccessTokenError", // attention!
    };
  }
}

export const config = {
  trustHost: true,
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          username: "username",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const payload = {
          username: credentials.username,
          password: credentials.password,
        };

        const res = await fetch(
          `${process.env.API_BASE_URL}/api/v1/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const user = await res.json();

        if (!user) {
          throw new InvalidEmailPasswordError();
        }

        if (!res.ok) {
          throw new Error(user.message);
        }

        if (res.ok && user) {
          const prefix = process.env.NODE_ENV === "development" ? "__Dev-" : "";

          cookies().set({
            name: `${prefix}xxx.refresh-token`,
            value: user.refreshToken,
            httpOnly: true,
            sameSite: "strict",
            secure: true,
          } as any);
          console.log("user => ", user);
          console.log("cookies => ", cookies().getAll());
          return user;
        }
        return null;
      },
    }),
  ],
  // this is required
  secret: process.env.AUTH_SECRET,
  // our custom login page
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.email = user.email;
        token.id = user.id;
        token.userId = user.id;
        token.name = user.name;
        token.access_token = user.access_token;
        token.expires_in = user.expires_in;
        token.token_type = user.token_type;

        if (user.access_token) {
          const decodedAccessToken = JSON.parse(
            Buffer.from(user.access_token.split(".")[1], "base64").toString()
          );

          if (decodedAccessToken) {
            token.userId = decodedAccessToken["sub"] as string;
            token.accessTokenExpires = decodedAccessToken["exp"] * 1000;
          }
        } else {
          console.error("user or user.accesstoken is undefined");
        }
        console.log("úsers => ", user);
        console.log("jwt => ", token);
        return token;
      }

      return token;
    },
    async session({ session, token }) {
      const newSession = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          cognitoGroups: token.cognitoGroups as string[],
          access_token: token.accessToken as string,
          accessTokenExpires: token.accessTokenExpires as number,
          role: token.role as string,
        },
        error: token.error,
      };

      console.log("session", newSession);
      return newSession;
    },

    async signIn({ user, account, profile, email, credentials }) {
      if (user) {
        return `/organization`;
      }
      //if error return to sign in page
      return `/sign-in?error=CredentialsSignin`;
    },

    authorized({ request, auth }) {
      if (auth) {
        return true;
      }
      return false;
    },
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

export const { auth, handlers } = NextAuth(config);
