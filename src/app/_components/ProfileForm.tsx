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
import { useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

// Modified schema to properly handle the image field
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
  // Modified image validation
  image: z.any(),
});

const ProfileForm = ({ Next }: { Next: () => void }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { userId } = useUser(); // Get the userId from context

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      about: "",
      media: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Update the form value as well
      form.setValue("image", file);
    }
  };

  const uploadImage = async (file: File) => {
    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", "buy-me-coffee");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dzb3xzqxv/image/upload",
        imageData
      );

      if (!response.data.secure_url) {
        throw new Error("Cloudinary did not return a secure URL");
      }

      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      form.setError("root", {
        type: "manual",
        message: "You must be logged in to create a profile",
      });
      return;
    }

    if (!imageFile) {
      form.setError("image", {
        type: "manual",
        message: "Please select a profile image",
      });
      return;
    }

    setIsUploading(true);

    try {
      const imageUrl = await uploadImage(imageFile);
      const submissionData = {
        userId: userId,
        name: values.name,
        about: values.about,
        avatarImage: imageUrl,
        socialMediaURL: values.media,
      };

      const response = await axios.post("/api/profile", submissionData, {});
      Next();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Profile creation failed";
        form.setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    } finally {
      setIsUploading(false);
    }
  }
  return (
    <div className="max-w-[510px] w-full m-auto flex flex-col gap-6">
      <h3 className="font-bold text-2xl">Complete your profile page</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="image"
            render={({
              field: { value, onChange, ...fieldProps },
              fieldState,
            }) => (
              <FormItem>
                <FormLabel>
                  <div
                    className={`flex justify-center rounded-full h-[160px] w-[160px] border items-center ${
                      fieldState.error ? "border-red-500" : "border-gray-500"
                    } border-dashed`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <Camera color="gray" />
                    )}
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    {...fieldProps}
                  />
                </FormControl>
                <FormDescription>Upload your profile picture</FormDescription>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
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
            <Button
              className="max-w-[250px] w-full"
              type="submit"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
