"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useProfile } from "../context/ProfileContext";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  about: z.string().optional(),
  socialMediaURL: z.string().url("Invalid URL").or(z.literal("")).optional(),
  successMessage: z.string().optional(),
  backgroundImage: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function EditProfileDialog({ trigger }: { trigger?: React.ReactNode }) {
  const { profile, updateProfile } = useProfile();
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null
  );

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      about: profile?.about || "",
      socialMediaURL: profile?.socialMediaURL ?? "",
      successMessage: profile?.successMessage || "",
      backgroundImage: profile?.backgroundImage || "",
    },
  });

  useEffect(() => {
    if (open && profile) {
      setAvatarPreview(profile.avatarImage || null);
      setBackgroundPreview(profile.backgroundImage || null);
      form.reset({
        name: profile.name || "",
        about: profile.about || "",
        socialMediaURL: profile.socialMediaURL ?? "",
        successMessage: profile.successMessage || "",
        backgroundImage: profile.backgroundImage || "",
      });
    }
  }, [open, profile, form]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "background"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "buy-me-coffee");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dzb3xzqxv/image/upload",
        formData
      );

      if (type === "avatar") {
        setAvatarPreview(response.data.secure_url);
      } else {
        setBackgroundPreview(response.data.secure_url);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };
  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        ...data,
        avatarImage: avatarPreview || profile?.avatarImage || "",
        backgroundImage: backgroundPreview || profile?.backgroundImage || "",
      });
      toast.success("Profile updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" onClick={() => setOpen(true)}>
            Edit Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Profile photo
                </p>
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer relative"
                >
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      className="object-cover"
                      src={avatarPreview || undefined}
                    />
                    <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border hover:bg-gray-100">
                    <Camera className="h-4 w-4" />
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "avatar")}
                    disabled={isUploading}
                  />
                </label>
              </div>

              <div className="flex flex-col items-center w-full">
                <p className="text-sm text-muted-foreground mb-2">
                  Cover photo
                </p>
                <label
                  htmlFor="background-upload"
                  className="cursor-pointer w-full"
                >
                  <div
                    className="relative w-full h-32 rounded-md bg-gray-100 bg-cover bg-center"
                    style={{
                      backgroundImage: backgroundPreview
                        ? `url(${backgroundPreview})`
                        : "none",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="secondary" size="sm">
                        <Camera className="mr-2 h-4 w-4" />
                        {backgroundPreview ? "Change cover" : "Add cover"}
                      </Button>
                    </div>
                  </div>
                  <input
                    id="background-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "background")}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            {isUploading && (
              <p className="text-sm text-muted-foreground text-center">
                Uploading images...
              </p>
            )}

            <Form {...form}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialMediaURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Media URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://example.com/username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="successMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thank You Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Message shown after donation"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
