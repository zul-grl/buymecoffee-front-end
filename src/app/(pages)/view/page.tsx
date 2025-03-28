"use client";

import type React from "react";

import { useState } from "react";
import { Camera, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditProfileDialog } from "@/app/_components/edit-profile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRouter } from "next/navigation";

export const mockUser = {
  id: 1,
  username: "baconpancakes1",
  name: "Jake",
  avatar:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-27%20at%2016.51.15-UwcanO8MSKeMYBFUsd4Zb09ALrbOmF.png",
  about:
    "I'm a typical person who enjoys exploring different things. I also make music art as a hobby. Follow me along.",
  url: "https://buymeacoffee.com/baconpancakes1",
  coverImage: "/placeholder.svg?height=300&width=1200",
  payment: {
    country: "United States",
    firstName: "Jake",
    lastName: "Mulligan",
    cardNumber: "XXXX-XXXX-XXXX-XXXX",
    expiryMonth: "August",
    expiryYear: "2028",
    cvc: "590",
  },
  successMessage:
    "Thank you for supporting me! It means a lot to have your support. It's a step toward creating a more inclusive and accepting community of artists.",
};

const formSchema = z.object({
  coverImage: z.instanceof(File).optional(),
  amount: z.string().min(1, "Please select an amount"),
  accountUrl: z.string().url("Please enter a valid URL").optional(),
  message: z.string().optional(),
});

export default function ViewPage() {
  const [user, setUser] = useState(mockUser);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      accountUrl: user.url,
      message: "",
    },
  });

  const handleSaveProfile = (updatedData: typeof mockUser) => {
    setUser(updatedData);
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("coverImage", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
    setShowSuccess(true);
  };

  const handleReturnToExplore = () => {
    setShowSuccess(false);
    router.push("/explore");
  };

  return (
    <div className="min-h-screen bg-white">
      {showSuccess ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-[520px] w-full p-8 mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-xl font-bold mb-8">Donation Complete!</h2>

              <div className="border border-dashed border-blue-200 rounded-md p-6 mb-6 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}:</span>
                </div>

                <p className="text-gray-700">{user.successMessage}</p>
              </div>

              <Button
                onClick={handleReturnToExplore}
                className="bg-gray-900 w-[40%] hover:bg-gray-800 text-white"
              >
                Return to explore
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className="relative w-full h-64 z-0 bg-gray-200 bg-cover bg-center"
            style={{
              backgroundImage: previewImage
                ? `url(${previewImage})`
                : `url(${user.coverImage})`,
            }}
          >
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImageChange}
            />
            <label
              htmlFor="coverImage"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Button variant="default" size="sm" asChild>
                <div className="flex items-center">
                  <Camera className="mr-2 h-4 w-4" />
                  {previewImage ? "Change cover image" : "Add a cover image"}
                </div>
              </Button>
            </label>
          </div>

          <div className="max-w-6xl mx-auto px-4 -mt-16">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 z-20">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                  </div>
                  <EditProfileDialog user={user} onSave={handleSaveProfile} />
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      About {user.name}
                    </h3>
                    <p className="text-gray-700">{user.about}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Buy Me a Coffee URL
                    </h3>
                    <p className="text-gray-700">{user.url}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Thank You Message
                    </h3>
                    <p className="text-gray-700">{user.successMessage}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Recent Supporters
                    </h3>
                    <div className="text-center py-8">
                      <Heart className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">
                        Be the first one to support {user.name}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="z-20">
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-6">
                      Buy {user.name} a Coffee
                    </h2>

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select amount:</FormLabel>
                            <FormControl>
                              <ToggleGroup
                                type="single"
                                value={field.value}
                                onValueChange={field.onChange}
                                className="flex flex-wrap gap-3"
                              >
                                <ToggleGroupItem
                                  value="1"
                                  className="rounded-md border data-[state=on]:border-black"
                                >
                                  <span className="mr-1">☕</span> $1
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  value="2"
                                  className="rounded-md border data-[state=on]:border-black"
                                >
                                  <span className="mr-1">☕</span> $2
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  value="5"
                                  className="rounded-md border data-[state=on]:border-black"
                                >
                                  <span className="mr-1">☕</span> $5
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  value="10"
                                  className="rounded-md border data-[state=on]:border-black"
                                >
                                  <span className="mr-1">☕</span> $10
                                </ToggleGroupItem>
                              </ToggleGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="accountUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Your BuyMeCoffee or social account URL:
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="buymeacoffee.com/yourusername"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special message:</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please write your message here"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                      >
                        Support
                      </Button>
                    </div>
                  </Card>
                </form>
              </Form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
