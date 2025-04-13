// types.ts
export type User = {
  id: number;
  password?: string;
  username: string;
  email: string;
  profile?: Profile;
  bankCard?: BankCard;
  receivedDonations: number[];
  sentDonations: number[];
  created_at: Date;
  updated_at: Date;
};

export type Profile = {
  id: number;
  userId: number;
  name: string;
  about: string;
  avatarImage: string;
  socialMediaURL?: string;
  backgroundImage?: string;
  successMessage?: string;
  created_at: Date;
  updated_at: Date;
};

export type BankCard = {
  id: number;
  userId: number;
  country: string;
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiryYear?: string;
  expiryMonth?: string;
  expiryDate?: string;
  created_at: Date;
  updated_at: Date;
  cvc: string;
};

export interface DonationWithDonor {
  id: number;
  amount: number;
  specialMessage?: string;
  created_at: string;
  donorId: number;
  donorName: string;
  donorImage?: string;
  donorEmail?: string;
}

export type Donation = {
  id: number;
  amount: number;
  specialMessage?: string;
  socialURL?: string;
  donorId?: number;
  donorName?: string;
  recipientId: number;
  created_at: Date;
  updated_at: Date;
};
export type DonationStats = {
  totalEarnings: number;
  recentDonations: Donation[];
  donationCount: number;
  totalDonations: number;
  topDonors: Array<{
    donorId?: number;
    donorName: string;
    totalAmount: number;
    count: number;
  }>;
};

export type CreateDonationRequest = {
  amount: number;
  specialMessage?: string;
  socialURL?: string;
  donorId?: number | null;
  donorName?: string;
  recipientId: number;
};

export type DonationSearchParams = {
  userId: number;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  donorName?: string;
};

export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
};
export type CompleteProfileResponse = {
  profile?: Profile | undefined;
  bankCard?: BankCard | undefined;
  success?: boolean;
};
