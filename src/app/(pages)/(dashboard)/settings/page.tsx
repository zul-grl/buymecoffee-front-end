"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useUser } from "@/app/context/UserContext";
import { useProfile } from "@/app/context/ProfileContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/app/_components/Loader";

const personalSchema = z.object({
  name: z.string().min(2),
  about: z.string().optional(),
  socialMediaURL: z.string().url().or(z.literal("")).optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const paymentSchema = z.object({
  country: z.string().min(1).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  cardNumber: z.string().length(16).optional(),
  expiryMonth: z.string().length(2),
  expiryYear: z.string().length(4),
  cvc: z.string().min(3).max(4),
});

const successSchema = z.object({
  successMessage: z.string().min(10),
});

export default function AccountSettings() {
  const { userId } = useUser();
  const { profile, bankCard, updateProfile, updateBankCard } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [countries, setCountries] = useState<{ name: string }[]>([]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const personalForm = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      name: "",
      about: "",
      socialMediaURL: "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema as any),
    defaultValues: {
      country: bankCard?.country,
      firstName: bankCard?.firstName,
      lastName: bankCard?.lastName,
      cardNumber: bankCard?.cardNumber,
      expiryMonth: bankCard?.expiryDate
        ? String(new Date(bankCard.expiryDate).getMonth() + 1).padStart(2, "0")
        : "",
      expiryYear: bankCard?.expiryDate
        ? String(new Date(bankCard.expiryDate).getFullYear())
        : "",
      cvc: bankCard?.cvc || "",
    },
  });

  const successForm = useForm({
    resolver: zodResolver(successSchema),
    defaultValues: {
      successMessage: "Thank you for your support!",
    },
  });
  const expiryMonth = bankCard?.expiryDate
    ? String(new Date(bankCard.expiryDate).getMonth() + 1).padStart(2, "0")
    : "";

  const expiryYear = bankCard?.expiryDate
    ? String(new Date(bankCard.expiryDate).getFullYear())
    : "";
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const countriesResponse = await fetch(
          "https://restcountries.com/v3.1/all"
        );
        const countriesData = await countriesResponse.json();
        setCountries(countriesData.map((c: any) => ({ name: c.name.common })));

        if (profile) {
          personalForm.reset({
            name: profile.name || "",
            about: profile.about || "",
            socialMediaURL: profile.socialMediaURL || "",
          });
          successForm.reset({
            successMessage:
              profile.successMessage || "Thank you for your support!",
          });
          setAvatarPreview(profile.avatarImage || null);
        }

        if (bankCard) {
          paymentForm.reset({
            country: bankCard.country || "",
            firstName: bankCard.firstName || "",
            lastName: bankCard.lastName || "",
            cardNumber: bankCard.cardNumber || "",
            expiryMonth:
              expiryMonth || String(new Date().getMonth() + 1).padStart(2, "0"),
            expiryYear: expiryYear || String(new Date().getFullYear()),
            cvc: bankCard.cvc?.toString() || "",
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profile, bankCard]);

  if (isLoading) {
    return <Loader />;
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setAvatarPreview(response.data.secure_url);
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePersonalSubmit = async (data: z.infer<typeof personalSchema>) => {
    try {
      await updateProfile({
        ...data,
        avatarImage: avatarPreview || profile?.avatarImage,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      await axios.post("/api/auth/update", {
        userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      passwordForm.reset();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to change password");
      }
    }
  };

  const handlePaymentSubmit = async (data: z.infer<typeof paymentSchema>) => {
    try {
      await updateBankCard({
        country: data.country,
        firstName: data.firstName,
        lastName: data.lastName,
        cardNumber: data.cardNumber,
        expiryYear: data.expiryYear,
        expiryMonth: data.expiryMonth,
        cvc: data.cvc,
      });
      toast.success("Payment details updated");
    } catch (error) {
      toast.error("Failed to update payment details");
    }
  };

  const handleSuccessSubmit = async (data: z.infer<typeof successSchema>) => {
    try {
      await updateProfile({
        ...profile,
        successMessage: data.successMessage,
      });
      toast.success("Success message updated");
    } catch (error) {
      toast.error("Failed to update success message");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8 max-h-[90vh] overflow-y-auto">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Info</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...personalForm}>
            <form
              onSubmit={personalForm.handleSubmit(handlePersonalSubmit)}
              className="space-y-6"
            >
              <div className="flex flex-col items-center sm:items-start gap-4">
                <p className="text-sm text-muted-foreground">Profile photo</p>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      className="object-cover"
                      src={avatarPreview || profile?.avatarImage}
                    />
                    <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                  />
                </label>
                {isUploading && (
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                )}
              </div>

              <FormField
                control={personalForm.control}
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
                control={personalForm.control}
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
                control={personalForm.control}
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

              <Button type="submit" className="w-full" disabled={isUploading}>
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...paymentForm}>
            <form
              onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}
              className="space-y-4"
            >
              <FormField
                control={paymentForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={countryOpen}
                          className="w-full justify-between"
                        >
                          {field.value || "Select country"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search country..." />
                          <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {countries.map((country) => (
                                <CommandItem
                                  key={country.name}
                                  value={country.name}
                                  onSelect={() => {
                                    paymentForm.setValue(
                                      "country",
                                      country.name
                                    );
                                    setCountryOpen(false);
                                  }}
                                >
                                  <Check
                                    className={
                                      field.value === country.name
                                        ? "mr-2 h-4 w-4 opacity-100"
                                        : "opacity-0"
                                    }
                                  />
                                  {country.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={paymentForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={paymentForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={paymentForm.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={paymentForm.control}
                  name="expiryMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) =>
                            String(i + 1).padStart(2, "0")
                          ).map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={paymentForm.control}
                  name="expiryYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="h-[200px]">
                          {Array.from({ length: 7 }, (_, i) =>
                            String(new Date().getFullYear() + i)
                          ).map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={paymentForm.control}
                  name="cvc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Save Payment Details
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Success Page</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...successForm}>
            <form
              onSubmit={successForm.handleSubmit(handleSuccessSubmit)}
              className="space-y-4"
            >
              <FormField
                control={successForm.control}
                name="successMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thank You Message</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        {...field}
                        placeholder="Message shown after donation"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save Message
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
