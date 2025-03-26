"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputForm } from "../components/InputForm";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email().min(12, {
    message: "Email must be at least 12 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const SignIn = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push("/createProfile");
    console.log(values);
  }
  return (
    <div className="w-[50vw] h-screen flex justify-center relative items-center">
      <Link href={"/sign-up"}>
        <Button
          variant={"outline"}
          className="absolute top-[32px] right-[80px]"
        >
          Sign up
        </Button>
      </Link>
      <div className="p-6">
        <h3 className="text-2xl mb-6 font-bold">Welcome back</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <InputForm
              name="email"
              placeholder="Enter email here"
              label="Email"
              form={form}
              type="email"
            />
            <InputForm
              name="password"
              label="Password"
              placeholder="Enter password here"
              form={form}
              type="password"
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
