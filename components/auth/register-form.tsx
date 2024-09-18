"use client";
import { LoginSchema } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import FormSuccess from "../form/form-success";
import { login } from "@/actions/auth/login";
import FormErrorLogin from "../form/form-error-login";
import Wrapper from "../wrapper";

const Register = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onFinish = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    try {
      startTransition(() => {
        login(values).then((data) => {
          if (data) {
            if (data.error) {
              setError(data.error);
            }
            if (data.success) {
              setSuccess(data.success);
            }
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Wrapper
        headerLabel="Sign Un"
        backButtonLabel="Back to Home"
        backButtonHref="/"
        showSocial
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFinish)}
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
            <FormErrorLogin message={error} />
            <FormSuccess message={success} />
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

export default Register;
