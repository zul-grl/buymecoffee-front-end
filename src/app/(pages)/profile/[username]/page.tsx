"use client";

import { use, useEffect, useState } from "react";
import { Camera, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useParams, useRouter } from "next/navigation";
import { useDonation } from "@/app/context/DonationContext";
import { useUser } from "@/app/context/UserContext";
import { useProfile } from "@/app/context/ProfileContext";
import axios from "axios";
import { Loader } from "@/app/_components/Loader";

const formSchema = z.object({
  coverImage: z.instanceof(File).optional(),
  amount: z.string().min(1, "Please select an amount"),
  accountUrl: z.string().url("Please enter a valid URL").optional(),
  message: z.string().optional(),
});

export default function ViewPage() {
  const { username } = useParams();
  const { createDonation, fetchReceivedDonations, donations } = useDonation();
  const { fetchProfileData } = useProfile();
  const [profile, setProfile] = useState<any>(null);
  const { userId } = useUser();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      accountUrl: "",
      message: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get(`/api/profile/view/${username}`);
        setProfile(response.data.data);

        fetchProfileData();
        if (response.data.backgroundImage) {
          setPreviewImage(response.data.backgroundImage);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };
    loadProfile();
  }, [username]);
  const uploadImage = async (file: File) => {
    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", "buy-me-coffee");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dzb3xzqxv/image/upload",
      imageData
    );
    return response.data.secure_url;
  };

  const handleCoverImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setPreviewImage(imageUrl);
      }
    } catch (error) {
      console.error("Error uploading cover image:", error);
    } finally {
      setIsUploading(false);
    }
  };
  console.log("Profile data:", profile);
  useEffect(() => {
    const fetchDonations = async () => {
      if (profile?.userId) {
        try {
          const userId = profile.userId;
          fetchReceivedDonations(userId);
        } catch (error) {
          console.error("Failed to fetch donations:", error);
        }
      }
    };
    fetchDonations();
  }, [profile?.id]);
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!profile?.id || !userId) {
        console.error("Missing required IDs");
        return;
      }

      const donationData = {
        amount: Number(data.amount),
        specialMessage: data.message || undefined,
        socialURL: data.accountUrl || undefined,
        donorId: userId,
        recipientId: profile.id,
      };

      const response = await createDonation(donationData);

      if (response && response.data) {
        const donation = response.data;
        if (donation) {
          await fetchProfileData();
          setShowSuccess(true);
        }
      }
    } catch (error) {
      console.error("Failed to create donation:", error);
    }
  };

  const handleReturnToExplore = () => {
    setShowSuccess(false);
    router.push("/explore");
  };
  if (!profile && !donations) {
    return <Loader />;
  }

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
                    <AvatarImage
                      src={profile?.avatarImage}
                      alt={profile?.name}
                    />
                    <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{profile?.name}:</span>
                </div>

                <p className="text-gray-700">
                  {profile?.successMessage || "Thank you for your support!"}
                </p>
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
                : profile?.backgroundImage
                ? `url(${profile.backgroundImage})`
                : "none",
            }}
          >
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImageChange}
              disabled={isUploading}
            />
            <label
              htmlFor="coverImage"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Button variant="default" size="sm" asChild>
                <div className="flex items-center">
                  <Camera className="mr-2 h-4 w-4" />
                  {isUploading
                    ? "Uploading..."
                    : previewImage
                    ? "Change cover image"
                    : "Add a cover image"}
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
                      <AvatarImage
                        src={profile?.avatarImage}
                        alt={profile?.name}
                      />
                      <AvatarFallback>
                        {profile?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold">{profile?.name}</h2>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      About {profile?.name}
                    </h3>
                    <p className="text-gray-700">{profile?.about}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Social media URL
                    </h3>
                    <p className="text-gray-700">{profile?.socialMediaURL}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Recent Supporters
                    </h3>
                    {donations.length > 0 ? (
                      <div className="space-y-4">
                        {donations.map((donation) => (
                          <div
                            key={donation.id}
                            className="flex items-center gap-3 p-4"
                          >
                            <img
                              src={donation.donorImage || "/default-avatar.png"}
                              alt={donation.donorName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium">
                                {donation.donorName} bought you $
                                {donation.amount.toFixed(2)} coffee
                              </p>
                              {donation.specialMessage && (
                                <p className="text-gray-600 italic">
                                  "{donation.specialMessage}"
                                </p>
                              )}
                              <p className="text-sm text-gray-500">
                                {new Date(
                                  donation.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Be the first one to support {profile?.name}!
                      </p>
                    )}
                  </div>
                </div>
              </Card>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="z-20">
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-6">
                      Buy {profile?.name} a Coffee
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
