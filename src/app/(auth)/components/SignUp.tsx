"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputForm } from "../components/InputForm";
import { useRouter } from "next/navigation";
import Link from "next/link";

const usernameSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
});

const emailPasswordSchema = z.object({
  email: z.string().email().min(12, {
    message: "Email must be at least 12 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const usernameForm = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const emailPasswordForm = useForm<z.infer<typeof emailPasswordSchema>>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleUsernameSubmit(values: z.infer<typeof usernameSchema>) {
    setUsername(values.username);
    emailPasswordForm.reset();
    setStep(2);
  }

  function handleFinalSubmit(values: z.infer<typeof emailPasswordSchema>) {
    console.log({ username, ...values });
    router.push("/sign-in");
  }

  return (
    <div className="flex justify-center items-center w-[50vw] relative">
      <Link href={"/sign-in"}>
        <Button
          variant={"outline"}
          className="absolute top-[32px] right-[80px]"
        >
          Log in
        </Button>
      </Link>
      {step === 1 ? (
        <div className="p-6">
          <div className=" flex flex-col gap-[6px] mb-6">
            <h3 className="text-2xl font-bold">Create Your Account</h3>
            <p className="text-muted-foreground text-[14px] font-medium">
              Choose a username for your page
            </p>
          </div>
          <Form {...usernameForm}>
            <form
              onSubmit={usernameForm.handleSubmit(handleUsernameSubmit)}
              className="space-y-6"
            >
              <InputForm
                name="username"
                label="Username"
                form={usernameForm}
                type="text"
                placeholder="Enter username here"
              />
              <Button className="w-full" type="submit">
                Continue
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div>
          <div className=" flex flex-col gap-[6px] mb-6">
            <h3 className="text-2xl font-bold">Welcome, {username}</h3>
            <p className="text-muted-foreground text-[14px] font-medium">
              Connect email and set a password
            </p>
          </div>
          <Form {...emailPasswordForm}>
            <form
              onSubmit={emailPasswordForm.handleSubmit(handleFinalSubmit)}
              className="space-y-6"
            >
              <FormField
                control={emailPasswordForm.control}
                name={"email"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <InputForm
                placeholder="Enter password here"
                type="password"
                name="password"
                label="Password"
                form={emailPasswordForm}
              />
              <Button className="w-full" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default SignUp;
