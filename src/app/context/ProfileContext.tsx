"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "./UserContext";
import {
  ApiResponse,
  BankCard,
  CompleteProfileResponse,
  Profile,
} from "../_lib/type";
import axios from "axios";

type ProfileContextType = {
  profile: Profile | null;
  bankCard: BankCard | null;
  loading: boolean;
  error: string | null;
  fetchProfileData: () => Promise<CompleteProfileResponse>;
  loadProfile: (params: { username: string }) => Promise<Profile | null>;
  profileId: number | null;
  updateProfile: (updatedData: Partial<Profile>) => Promise<void>;
  updateBankCard: (updatedData: Partial<BankCard>) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { userId } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [bankCard, setBankCard] = useState<BankCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchProfileData = async () => {
    if (!userId) return null;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/profile/current-user", {
        userId,
      });
      const data = response.data;
      setBankCard(data.data.bankCard);
      setProfile(data.data.profile);
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);
  const loadProfile = async ({ username }: { username: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse<Profile>>(
        `/api/profile/view/${username}`
      );

      if (response.data.success && response.data.data) {
        setProfile(response.data.data);
        console.log("Loaded profile data:", response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to load profile");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to load profile";
      setError(errorMsg);
      console.error("Profile loading error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const updateProfile = async (updatedData: Partial<Profile>) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    setLoading(true);
    try {
      const response = await axios.patch("/api/profile/update", {
        userId,
        ...updatedData,
      });

      if (response.data.success && response.data.data) {
        setProfile(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.error || "Update failed");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Update failed";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBankCard = async (updatedData: Partial<BankCard>) => {
    setLoading(true);
    try {
      if (bankCard) {
        const response = await axios.patch("/api/bank-card/update", {
          bankCardId: bankCard?.id,
          ...updatedData,
        });

        if (response.data.bankCard) {
          setBankCard(response.data.bankCard);
        }
        fetchProfileData();
        return response.data.bankCard;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        bankCard,
        loading,
        error,
        fetchProfileData,
        loadProfile,
        profileId,
        updateProfile,
        updateBankCard,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
