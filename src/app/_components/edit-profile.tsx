"use client";

import { useState } from "react";
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

interface PaymentInfo {
  country: string;
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
}

interface UserData {
  id: number;
  username: string;
  name: string;
  about: string;
  url: string;
  avatar: string;
  coverImage: string;
  payment: PaymentInfo;
  successMessage: string;
}

interface EditProfileDialogProps {
  user: UserData;
  onSave: (data: UserData) => void;
  trigger?: React.ReactNode;
}
export function EditProfileDialog({
  user,
  onSave,
  trigger,
}: EditProfileDialogProps) {
  const [formData, setFormData] = useState<UserData>(user);
  const [open, setOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className="z-10"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            Edit profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">Profile photo</p>
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar} alt="Profile" />
                  <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1 border hover:bg-gray-100"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="about" className="text-sm font-medium">
                About
              </label>
              <Textarea
                id="about"
                name="about"
                rows={4}
                value={formData.about}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Buy Me a Coffee URL
              </label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://buymeacoffee.com/yourusername"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="successMessage" className="text-sm font-medium">
                Thank You Message
              </label>
              <Textarea
                id="successMessage"
                name="successMessage"
                rows={3}
                value={formData.successMessage}
                onChange={handleChange}
                placeholder="Message to show after someone supports you"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              {" "}
              {/* 🔹 Close on cancel */}
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
