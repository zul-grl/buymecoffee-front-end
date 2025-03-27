"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { ChevronsUpDown, Check } from "lucide-react";

const mockUser = {
  name: "John Doe",
  about: "Product designer",
  url: "https://twitter.com/johndoe",
  avatar: "/avatar.jpg",
  payment: {
    country: "United States",
    firstName: "John",
    lastName: "Doe",
    cardNumber: "4242424242424242",
    expiryMonth: "01",
    expiryYear: "2025",
    cvc: "123",
  },
  successMessage: "Thank you for your purchase!",
};

const months = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const years = Array.from({ length: 7 }, (_, i) =>
  String(new Date().getFullYear() + i)
);

const schemas = {
  personal: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    about: z.string().optional(),
    socialMediaUrl: z
      .string()
      .url("Please enter a valid URL")
      .or(z.literal(""))
      .optional(),
  }),
  password: z
    .object({
      newPassword: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
  payment: z.object({
    country: z.string().nonempty("Please select a country"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    cardNumber: z.string().min(16, "Card number must be 16 digits").max(16),
    expiryMonth: z.string().nonempty("Month is required"),
    expiryYear: z.string().nonempty("Year is required"),
    cvc: z
      .string()
      .min(3, "CVC must be 3 digits")
      .max(4, "CVC must be 3-4 digits"),
  }),
  success: z.object({
    confirmationMessage: z
      .string()
      .min(10, "Message should be at least 10 characters"),
  }),
};

export default function AccountSettings() {
  const [countries, setCountries] = useState<{ name: string }[]>([]);
  const [countryOpen, setCountryOpen] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) =>
        setCountries(
          data.map((country: any) => ({ name: country.name.common }))
        )
      );
  }, []);

  const forms = {
    personal: useForm({
      resolver: zodResolver(schemas.personal),
      defaultValues: {
        name: mockUser.name,
        about: mockUser.about,
        socialMediaUrl: mockUser.url,
      },
    }),
    password: useForm({ resolver: zodResolver(schemas.password) }),
    payment: useForm({
      resolver: zodResolver(schemas.payment),
      defaultValues: mockUser.payment,
    }),
    success: useForm({
      resolver: zodResolver(schemas.success),
      defaultValues: {
        confirmationMessage: mockUser.successMessage,
      },
    }),
  };

  const onSubmit = (formName: keyof typeof forms) => (data: any) => {
    console.log(`${formName} updated:`, data);
  };

  return (
    <div className="max-w-[650px] py-6 px-4 space-y-8">
      <h1 className="text-2xl font-bold">My account</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal info</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...forms.personal}>
            <form
              onSubmit={forms.personal.handleSubmit(onSubmit("personal"))}
              className="space-y-6"
            >
              <div className="flex flex-col items-center sm:items-start gap-4">
                <p className="text-sm text-muted-foreground">Add photo</p>
                <Avatar className="h-24 w-24">
                  <AvatarImage src={mockUser.avatar} />
                  <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <FormField
                control={forms.personal.control}
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
                control={forms.personal.control}
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
                control={forms.personal.control}
                name="socialMediaUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social media URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...forms.password}>
            <form
              onSubmit={forms.password.handleSubmit(onSubmit("password"))}
              className="space-y-4"
            >
              <FormField
                control={forms.password.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={forms.password.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...forms.payment}>
            <form
              onSubmit={forms.payment.handleSubmit(onSubmit("payment"))}
              className="space-y-4"
            >
              <FormField
                control={forms.payment.control}
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
                                    field.onChange(country.name);
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
                  control={forms.payment.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={forms.payment.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={forms.payment.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={forms.payment.control}
                  name="expiryMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="h-[200px]">
                          {months.map((month) => (
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
                  control={forms.payment.control}
                  name="expiryYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="h-[200px]">
                          {years.map((year) => (
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
                  control={forms.payment.control}
                  name="cvc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Save changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Success page</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...forms.success}>
            <form
              onSubmit={forms.success.handleSubmit(onSubmit("success"))}
              className="space-y-4"
            >
              <FormField
                control={forms.success.control}
                name="confirmationMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmation message</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
