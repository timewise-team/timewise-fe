import { cookies, headers } from "next/headers";

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

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
    //login with google
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // we use credentials provider here
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
      async authorize(credentials, req) {
        const payload = {
          username: credentials.username,
          password: credentials.password,
        };

        const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const user = await res.json();

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
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
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

        // if (user.idToken) {
        //   const decodedIdToken = JSON.parse(
        //     Buffer.from(user.idToken.split(".")[1], "base64").toString()
        //   );

        //   if (decodedIdToken) {
        //     token.email = decodedIdToken["email"];
        //     token.cognitoGroups = decodedIdToken["cognito:groups"];
        //   }
        // } else {
        //   console.error("user or user.idToken is undefined");
        // }
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
      const { pathname } = request.nextUrl;

      // get the route name from the url such as "/about"
      const searchTerm = request.nextUrl.pathname
        .split("/")
        .slice(0, 2)
        .join("/");
      console.log("searchTerm => ", searchTerm);
      // if the private routes array includes the search term, we ask authorization here and forward any unauthorized users to the login page
      if (privateRoutes.includes(searchTerm)) {
        console.log(
          `${!!auth ? "Can" : "Cannot"} access private route ${searchTerm}`
        );
        return !!auth;
        // if the pathname starts with one of the routes below and the user is already logged in, forward the user to the home page
      } else if (
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/sign-up")
      ) {
        const isLoggedIn = !!auth;

        if (isLoggedIn) {
          return Response.redirect(new URL("/organization", request.nextUrl));
        }

        return true;
      }

      return true;
    },
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

export const { auth, handlers } = NextAuth(config);
