"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import {
  Donation,
  DonationStats,
  ApiResponse,
  CreateDonationRequest,
  DonationSearchParams,
  DonationWithDonor,
} from "../_lib/type";
import axios from "axios";
import { useUser } from "./UserContext";

type DonationContextType = {
  donations: DonationWithDonor[];
  stats: DonationStats | null;
  loading: boolean;
  error: string | null;
  totalEarnings: number;
  donationCount: number;
  createDonation: (
    data: CreateDonationRequest
  ) => Promise<ApiResponse<Donation>>;
  fetchReceivedDonations: (userId: number) => Promise<void>;
  fetchDonationStats: (userId: number) => Promise<void>;
  searchDonations: (params: DonationSearchParams) => Promise<Donation[]>;
  refreshDonations: () => Promise<void>;
};

const DonationContext = createContext<DonationContextType | undefined>(
  undefined
);

export function DonationProvider({ children }: { children: ReactNode }) {
  const { userId } = useUser();
  const [donations, setDonations] = useState<DonationWithDonor[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [donationCount, setDonationCount] = useState(0);

  const refreshDonations = useCallback(async () => {
    if (userId) {
      await fetchReceivedDonations(userId);
      await fetchDonationStats(userId);
    }
  }, [userId]);

  useEffect(() => {
    refreshDonations();
  }, [refreshDonations]);

  const createDonation = useCallback(
    async (data: CreateDonationRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post<ApiResponse<Donation>>(
          "/api/donation/create-donation",
          data,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to create donation");
        }

        await refreshDonations();
        return response.data;
      } catch (err) {
        let errorMessage = "Failed to create donation";

        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.message || err.message;
          console.error("API Error:", {
            status: err.response?.status,
            data: err.response?.data,
          });
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        console.error("Donation creation error:", errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [refreshDonations]
  );

  const fetchReceivedDonations = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse<DonationWithDonor[]>>(
        `/api/donation/received`,
        { userId }
      );

      setDonations(response.data.data || []);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch donations"
      );
      setDonations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDonationStats = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse<DonationStats>>(
        `/api/donation/total-earnings`,
        { userId }
      );

      if (response.data.data) {
        setStats(response.data.data);
        setTotalEarnings(response.data.data.totalEarnings || 0);
        setDonationCount(response.data.data.donationCount || 0);
      }
    } catch (err) {
      console.error("Error fetching donation stats:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch donation stats"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const searchDonations = useCallback(async (params: DonationSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse<Donation[]>>(
        `/api/donation/search-donations`,
        params
      );
      return response.data.data || [];
    } catch (err) {
      console.error("Error searching donations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to search donations"
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DonationContext.Provider
      value={{
        donations,
        stats,
        loading,
        error,
        totalEarnings,
        donationCount,
        createDonation,
        fetchReceivedDonations,
        fetchDonationStats,
        searchDonations,
        refreshDonations,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error("useDonation must be used within a DonationProvider");
  }
  return context;
}
