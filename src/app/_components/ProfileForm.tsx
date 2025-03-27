"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter name",
  }),
  media: z.string().url().min(2, {
    message: "Please enter a social link",
  }),
  about: z.string().min(2, {
    message: "Please enter info about yourself",
  }),
  image: z.any().refine((files) => files?.length >= 1, {
    message: "Please enter image",
  }),
});

const ProfileForm = ({ Next }: { Next: () => void }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      name: "",
      about: "",
      media: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    Next();
  }

  return (
    <>
      <div className="max-w-[510px] w-full m-auto flex flex-col gap-6">
        <h3 className="font-bold text-2xl">Complete your profile page</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    <div
                      className={`flex justify-center rounded-full h-[160px] w-[160px] border items-center ${
                        fieldState.error ? "border-red-500" : "border-gray-500"
                      } border-dashed`}
                    >
                      <Camera color="gray" />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                      }}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your name here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write about yourself here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="media"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Media URL</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="https://" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button className="max-w-[250px] w-full" type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ProfileForm;
