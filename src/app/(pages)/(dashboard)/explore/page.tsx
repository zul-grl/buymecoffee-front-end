"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { mockCreators } from "@/app/_lib/data";

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCreators = mockCreators.filter((creator) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      creator.name.toLowerCase().includes(searchLower) ||
      creator.username.toLowerCase().includes(searchLower) ||
      creator.about.toLowerCase().includes(searchLower) ||
      creator.url.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Explore creators</h1>

      <div className="mb-5">
        <Input
          type="search"
          className="w-[50%]"
          placeholder="Search creators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {filteredCreators.length > 0 ? (
          filteredCreators.map((creator) => (
            <Card key={creator.id} className="overflow-hidden">
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>
                          {creator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-semibold">{creator.name}</h2>
                    </div>
                    <div className="flex items-start">
                      <Link href={`/profile/${creator.username}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <span>View profile</span>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex-1 md:ml-12">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium">
                          About {creator.name}
                        </h3>
                        <p className="text-sm text-gray-700">{creator.about}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Social media URL
                        </h3>
                        <p className="text-sm text-gray-700">{creator.url}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No creators found matching your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
