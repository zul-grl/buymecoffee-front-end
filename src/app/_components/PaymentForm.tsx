"use client";

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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "../context/UserContext";

const formSchema = z.object({
  country: z.string().nonempty({ message: "Please select a country" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  cardNumber: z.string().min(16, { message: "Card number must be 16 digits" }),
  expiryMonth: z.string().nonempty({ message: "Invalid month" }),
  expiryYear: z.string().nonempty({ message: "Invalid year" }),
  cvc: z.string().min(3, { message: "CVC is required" }),
});

const months = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const years = Array.from({ length: 15 }, (_, i) =>
  String(new Date().getFullYear() + i)
);

const PaymentForm = () => {
  const [countries, setCountries] = useState<{ name: string }[]>([]);
  const [countryValue, setCountryValue] = useState("");
  const [open, setOpen] = useState(false);
  const { userId } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      firstName: "",
      lastName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
    },
  });

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) =>
        setCountries(
          data.map((country: any) => ({ name: country.name.common }))
        )
      );
  }, []);
  const router = useRouter();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Submitting form with values:", values);

      const response = await axios.post(`/api/bank-card`, {
        ...values,
        userId: userId,
      });

      if (response.status === 201) {
        console.log("Bank card created successfully", response.data);
        router.push("/");
      } else {
        console.error(
          "Unexpected response status",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      if (axios.isAxiosError(error)) {
        console.error(
          "Error details:",
          error.response?.status,
          error.response?.data
        );
      } else {
        console.error("Unknown error:", error);
      }
    }
  }

  return (
    <div className="max-w-[510px] w-full m-auto flex flex-col gap-6">
      <h3 className="font-bold text-2xl">How would you like to be paid?</h3>
      <p className="text-muted-foreground">
        Enter location and payment details
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select country</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {countryValue || "Select country"}
                      <ChevronsUpDown className="opacity-50" />
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
                                setCountryValue(country.name);
                                field.onChange(country.name);
                                setOpen(false);
                              }}
                            >
                              {country.name}
                              <Check
                                className={
                                  countryValue === country.name
                                    ? "ml-auto opacity-100"
                                    : "opacity-0"
                                }
                              />
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

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your first name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card number</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="expiryMonth"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Month</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent className="h-[120px]">
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryYear"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="h-[120px]">
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cvc"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>CVC</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="CVC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="max-w-[250px] w-full">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentForm;
