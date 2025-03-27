import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockCreators, mockSupporters } from "@/app/_lib/data";

export default function CreatorProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const creator = mockCreators.find(
    (creator) => creator.username === params.username
  );
  if (!creator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Creator not found</h1>
          <p className="text-gray-600">
            The creator with username "{params.username}" doesn't exist.
          </p>
        </div>
      </div>
    );
  }
  const creatorWithSupporters = {
    ...creator,
    supporters: mockSupporters,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative w-full h-64 bg-gradient-to-r from-blue-900 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 opacity-70">
          <Image
            src="/placeholder.svg?height=300&width=1200"
            alt="Cover image"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="p-1 rounded-md bg-white/10 backdrop-blur-sm">
            <span className="text-lg text-white">☕</span>
          </div>
          <h1 className="font-bold text-white">Buy Me Coffee</h1>
        </div>
        <div className="absolute top-4 right-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 z-20">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={creatorWithSupporters.avatar}
                  alt={creatorWithSupporters.name}
                />
                <AvatarFallback>
                  {creatorWithSupporters.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">
                {creatorWithSupporters.name}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  About {creatorWithSupporters.name}
                </h3>
                <p className="text-gray-700">{creatorWithSupporters.about}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Social media URL</h3>
                <p className="text-gray-700">{creatorWithSupporters.url}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Recent Supporters
                </h3>

                {creatorWithSupporters.supporters.length > 0 ? (
                  <div className="space-y-6">
                    {creatorWithSupporters.supporters.map((supporter) => (
                      <div
                        key={supporter.id}
                        className="border-b pb-4 last:border-0"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          {supporter.avatar ? (
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={supporter.avatar}
                                alt={supporter.name}
                              />
                              <AvatarFallback>
                                {supporter.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full text-sm font-medium">
                              {supporter.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {supporter.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                bought {supporter.amount} coffee
                              </span>
                            </div>
                          </div>
                        </div>
                        {supporter.message && (
                          <p className="text-gray-700 ml-[52px]">
                            {supporter.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">
                      Be the first one to support {creatorWithSupporters.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 z-20">
            <h2 className="text-2xl font-bold mb-6">
              Buy {creatorWithSupporters.name} a Coffee
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select amount:
                </label>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="lg" className="rounded-md">
                    <span className="mr-1">☕</span> $1
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-md">
                    <span className="mr-1">☕</span> $2
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-md bg-gray-100"
                  >
                    <span className="mr-1">☕</span> $5
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-md">
                    <span className="mr-1">☕</span> $10
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="account-url"
                  className="block text-sm font-medium mb-2"
                >
                  Enter BuyMeCoffee or social account URL:
                </label>
                <Input
                  id="account-url"
                  placeholder="buymeacoffee.com/"
                  defaultValue={creatorWithSupporters.url}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Special message:
                </label>
                <Textarea
                  id="message"
                  placeholder="Please write your message here"
                  rows={4}
                  defaultValue="Thank you for being so awesome everyday!"
                />
              </div>

              <Button className="w-full bg-gray-900 hover:bg-gray-800">
                Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
