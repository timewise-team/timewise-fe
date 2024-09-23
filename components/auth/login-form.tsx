/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { LoginSchema } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/Button";
import Wrapper from "../wrapper";
import { useSearchParams } from "next/navigation";
import { SignInResponse, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

type LoginData = z.infer<typeof LoginSchema>;

const Login = () => {
  const [isPending, startTransition] = useTransition();
  // const [error, setError] = useState<string | undefined>("");
  // const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  async function login({ username, password }: LoginData) {
    const callbackUrl = searchParams.get("callbackUrl");
    console.log("callbackUrl", callbackUrl);
    signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    }).then((res: SignInResponse | undefined) => {
      if (!res) {
        toast.error("No response!");
        return;
      }

      if (!res.ok)
        toast.error("Could not login! Please check your credentials.");
      else if (res.error) {
        if (res.error == "CallbackRouteError")
          toast.error("Could not login! Please check your credentials");
      } else {
        if (typeof window !== "undefined") {
          if (callbackUrl) router.push(callbackUrl as string);
          else router.push("/organization");
        }
      }
    });
  }

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <>
      <Wrapper
        headerLabel="Log In"
        backButtonLabel="Back to Home"
        backButtonHref="/"
        showSocial
      >
        <Form {...form}>
          <form
            onSubmit={
              //call login pass email and password
              form.handleSubmit((values) => {
                startTransition(() => {
                  login(values);
                });
              })
            }
            className="flex flex-col space-y-5"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Username"
                        {...field}
                        type="text"
                        className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Password"
                        {...field}
                        type="password"
                        className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* <FormErrorLogin message={error} />
            <FormSuccess message={success} /> */}
            <div>
              <Button
                disabled={isPending}
                type="submit"
                className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
              >
                Log In
              </Button>
            </div>
          </form>
        </Form>
      </Wrapper>
    </>
  );
};

export default Login;
