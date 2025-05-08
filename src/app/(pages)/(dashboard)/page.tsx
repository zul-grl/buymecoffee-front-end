"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Heart, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDonation } from "@/app/context/DonationContext";
import { useUser } from "@/app/context/UserContext";
import { useProfile } from "@/app/context/ProfileContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/app/_components/Loader";
import { DonationWithDonor } from "@/app/_lib/type";
import { useRouter } from "next/navigation";

export default function Home() {
  const {
    donations,
    stats,
    loading,
    fetchReceivedDonations,
    fetchDonationStats,
  } = useDonation();
  const { userId, loading: userloading } = useUser();
  const { profile } = useProfile();

  const [earningsPeriod, setEarningsPeriod] = useState("Last 30 days");
  const [amountFilter, setAmountFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All time");
  const [filteredDonations, setFilteredDonations] = useState<
    DonationWithDonor[]
  >([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userloading && !userId) {
      router.push("/sign-in");
    }
  }, [userId, userloading, router]);

  useEffect(() => {
    setIsClient(true);
    if (userId) {
      fetchReceivedDonations(userId);
      fetchDonationStats(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!isClient) return;

    let result = [...donations];

    if (amountFilter !== "All") {
      result = result.filter((d) => d.amount === Number(amountFilter));
    }

    const now = new Date();
    if (dateFilter === "Last 30 days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      result = result.filter((d) => new Date(d.created_at) >= thirtyDaysAgo);
    } else if (dateFilter === "Last 90 days") {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(now.getDate() - 90);
      result = result.filter((d) => new Date(d.created_at) >= ninetyDaysAgo);
    }

    setFilteredDonations(result);
  }, [donations, amountFilter, dateFilter, isClient]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading && !donations.length && !profile && userloading && !isClient) {
    return <Loader />;
  }

  return (
    <div className="flex max-h-screen">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {profile?.avatarImage ? (
                    <AvatarImage
                      src={profile.avatarImage}
                      className="object-cover"
                      alt={profile?.name || "Profile"}
                    />
                  ) : (
                    <Skeleton className="h-12 w-12 rounded-full" />
                  )}
                  <AvatarFallback>
                    {profile?.name ? profile.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg">
                    {profile?.name || <Skeleton className="h-6 w-32" />}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {profile?.socialMediaURL || (
                      <Skeleton className="h-4 w-48 mt-1" />
                    )}
                  </div>
                </div>
              </div>
              <Button variant="default" className="gap-2">
                <Share className="h-4 w-4" />
                Share page link
              </Button>
            </div>
            <Separator />
            <div className="mb-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Earnings</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      {earningsPeriod}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {["Last 30 days", "Last 90 days", "All time"].map(
                      (period) => (
                        <DropdownMenuItem
                          key={period}
                          onClick={() => {
                            setEarningsPeriod(period);
                            setDateFilter(period);
                          }}
                        >
                          {period}
                          {earningsPeriod === period && (
                            <span className="ml-auto">✓</span>
                          )}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h2 className="text-4xl font-bold">
                {stats ? (
                  formatCurrency(stats.totalEarnings)
                ) : (
                  <Skeleton className="h-10 w-32" />
                )}
              </h2>
              <div className="text-sm text-gray-500">
                {stats ? (
                  `${stats.donationCount} donations`
                ) : (
                  <Skeleton className="h-4 w-24 mt-1" />
                )}
              </div>
            </div>
          </Card>

          <Card className="py-0">
            <div className="p-6 h-[500px] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Recent transactions</h3>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        {amountFilter === "All"
                          ? "All amounts"
                          : `$${amountFilter}`}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setAmountFilter("All")}>
                        All amounts
                        {amountFilter === "All" && (
                          <span className="ml-auto">✓</span>
                        )}
                      </DropdownMenuItem>
                      {[1, 2, 5, 10].map((value) => (
                        <DropdownMenuItem
                          key={value}
                          onClick={() => setAmountFilter(value.toString())}
                        >
                          {formatCurrency(value)}
                          {amountFilter === value.toString() && (
                            <span className="ml-auto">✓</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {filteredDonations.length > 0 ? (
                <div className="space-y-5">
                  {filteredDonations.map((transaction) => (
                    <div key={transaction.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={transaction.donorImage}
                              alt={transaction.donorName}
                            />
                            <AvatarFallback>
                              {transaction.donorName?.charAt(0) || "G"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">
                              {transaction.donorName || "Guest"}
                            </h4>
                            <div className="text-sm text-gray-500">
                              {transaction.donorEmail || "No email provided"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-black">
                            +{formatCurrency(transaction.amount)}
                          </p>
                          <div className="text-sm text-gray-500">
                            {formatDate(transaction.created_at)}
                          </div>
                        </div>
                      </div>
                      {transaction.specialMessage && (
                        <p className="mt-2 text-gray-700 ml-[52px]">
                          {transaction.specialMessage}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gray-100">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {donations.length === 0
                      ? "You don't have any supporters yet"
                      : "No matching transactions found"}
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    {donations.length === 0
                      ? "Share your page with your audience to get started."
                      : "Try adjusting your filters"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
