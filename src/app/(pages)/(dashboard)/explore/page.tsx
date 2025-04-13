"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";
import { Loader } from "@/app/_components/Loader";

interface Creator {
  id: number;
  name: string;
  username: string;
  about: string;
  avatarImage: string;
  socialMediaURL: string;
  backgroundImage?: string;
  successMessage?: string;
}

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/profile/explore");

        if (response.data.success && response.data.data) {
          setCreators(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch creators");
        }
      } catch (err) {
        console.error("Error fetching creators:", err);
        setError("Failed to load creators. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, []);

  const filteredCreators = creators.filter((creator) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      creator.name.toLowerCase().includes(searchLower) ||
      (creator.username &&
        creator.username.toLowerCase().includes(searchLower)) ||
      creator.about.toLowerCase().includes(searchLower) ||
      creator.socialMediaURL.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-full overflow-scroll px-6 h-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Explore creators</h1>

      <div className="mb-5">
        <Input
          type="search"
          className="w-full md:w-1/2"
          placeholder="Search creators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCreators.length > 0 ? (
            filteredCreators.map((creator) => (
              <Card key={creator.id} className="overflow-hidden">
                <CardContent>
                  <div className="flex flex-col gap-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-2 items-center">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={creator.avatarImage}
                            alt={creator.name}
                          />
                          <AvatarFallback>
                            {creator.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-semibold">
                          {creator.name}
                        </h2>
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
                          <p className="text-sm text-gray-700">
                            {creator.about}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">
                            Social media URL
                          </h3>
                          <p className="text-sm text-gray-700">
                            {creator.socialMediaURL}
                          </p>
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
      )}
    </div>
  );
}
