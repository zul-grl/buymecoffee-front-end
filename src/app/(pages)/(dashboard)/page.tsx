"use client";
import { useState } from "react";
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
import { mockTransactions, mockUser } from "@/app/_lib/data";

export default function Home() {
  const [earningsPeriod, setEarningsPeriod] = useState("Last 30 days");
  const [transactionFilter, setTransactionFilter] = useState("All");
  const filteredTransactions =
    transactionFilter === "All"
      ? mockTransactions
      : mockTransactions.filter((transaction) => {
          const amount = Number.parseFloat(
            transaction.amount?.replace("$", "")
          );
          return amount == Number(transactionFilter);
        });

  return (
    <div className="flex max-h-screen">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={mockUser.avatar}
                    className="object-cover"
                    alt={mockUser.name}
                  />
                  <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg">{mockUser.name}</h2>
                  <p className="text-sm text-gray-500">{mockUser.url}</p>
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
                          onClick={() => setEarningsPeriod(period)}
                        >
                          {period}{" "}
                          {earningsPeriod === period && (
                            <span className="ml-auto">✓</span>
                          )}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h2 className="text-4xl font-bold">$450</h2>
            </div>
          </Card>
          <Card className="py-0">
            <div className="p-6 max-h-[530px] overflow-scroll">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Recent transactions</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1">
                      {transactionFilter === "All"
                        ? "Amount"
                        : `$${transactionFilter}`}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setTransactionFilter("All")}
                    >
                      All
                      {transactionFilter === "All" && (
                        <span className="ml-auto">✓</span>
                      )}
                    </DropdownMenuItem>
                    {[1, 2, 5, 10].map((value) => (
                      <DropdownMenuItem
                        key={value}
                        onClick={() => setTransactionFilter(value.toString())}
                      >
                        {`$${value}`}
                        {transactionFilter === value.toString() && (
                          <span className="ml-auto">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-5">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <div key={transaction.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          {transaction?.avatar ? (
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={transaction?.avatar}
                                alt={transaction?.name}
                              />
                              <AvatarFallback>
                                {transaction.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full text-sm font-medium">
                              {transaction.name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium">{transaction?.name}</h4>
                            <p className="text-sm text-gray-500">
                              {transaction?.url}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-black">
                            + {transaction?.amount}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction?.timeAgo}
                          </p>
                        </div>
                      </div>
                      {transaction?.message && (
                        <p className="mt-2 text-gray-700 ml-[52px]">
                          {transaction?.message}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gray-100">
                      <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      You don't have any supporters yet
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Share your page with your audience to get started.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
