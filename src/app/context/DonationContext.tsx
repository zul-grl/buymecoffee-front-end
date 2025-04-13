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
import { profile } from "console";

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
  const [donations, setDonations] = useState<Donation[]>([]);
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
          data
        );

        if (response.data.success) {
          await refreshDonations();
        }

        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create donation";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshDonations]
  );

  const fetchReceivedDonations = useCallback(async (profileId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse<Donation[]>>(
        `/api/donation/received/${profileId}`
      );
      setDonations(response.data.data || []);
    } catch (err) {
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
      const response = await axios.get<ApiResponse<DonationStats>>(
        `/api/donation/total-earnings/${userId}`
      );
      if (response.data.data) {
        setStats(response.data.data);
        setTotalEarnings(response.data.data.totalEarnings || 0);
        setDonationCount(response.data.data.donationCount || 0);
      }
    } catch (err) {
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
      const response = await axios.get<ApiResponse<Donation[]>>(
        `/api/donation/search-donations/${params.userId}`,
        {
          params: {
            minAmount: params.minAmount,
            maxAmount: params.maxAmount,
            startDate: params.startDate,
            endDate: params.endDate,
            donorName: params.donorName,
          },
        }
      );
      return response.data.data || [];
    } catch (err) {
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
