import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface InputFormProps {
  name: string;
  label: string;
  placeholder?: string;
  form: UseFormReturn<any>;
  type: string;
  onChange?: () => void;
}

export const InputForm = ({
  name,
  label,
  placeholder,
  form,
  type,
  onChange,
}: InputFormProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange && onChange();
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
