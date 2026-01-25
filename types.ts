export enum OfferType {
  INSTALL = 'INSTALL',
  SIGNUP = 'SIGNUP',
  KYC = 'KYC',
  SURVEY = 'SURVEY'
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  balance: number;
  todayEarnings: number;
  lifetimeEarnings: number;
  referralCode: string;
  referredBy?: string;
  lastDailyCheckIn?: number;
  isAdmin?: boolean;
  isBanned?: boolean;
  deviceId: string; // Anti-fraud device binding
  ipAddress?: string;
  createdAt: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  reward: number;
  link: string;
  icon: string;
  type: OfferType;
  steps: string[];
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'EARNING' | 'WITHDRAWAL' | 'REFERRAL' | 'ADJUSTMENT';
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  reason: string;
  method?: string;
  upiId?: string;
  time: any; // Firestore serverTimestamp
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  method: 'UPI' | 'GPay' | 'PhonePe' | 'Paytm';
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  mobile: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export interface CompletedOffer {
  id: string; // Format: userId_offerId
  userId: string;
  offerId: string;
  timestamp: number;
  amount: number;
}