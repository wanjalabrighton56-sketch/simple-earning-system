export interface UserProfile {
  id: string;
  username: string;
  email: string | null;
  phone_number: string | null;
  referred_by: string | null;
  is_activated: boolean;
  activation_date: string | null;
  balance: number;
  task_balance: number;
  referral_balance: number;
  wallet_balance: number;
  total_earnings: number;
  total_referrals: number;
  active_referrals: number;
  referral_earnings: number;
  level1_count: number;
  level2_count: number;
  level3_count: number;
  created_at: string;
  updated_at: string;
}

export interface ActivationPayment {
  id: string;
  user_id: string;
  phone_number: string;
  amount: number;
  external_reference: string;
  checkout_request_id: string | null;
  status: 'QUEUED' | 'SUCCESS' | 'FAILED';
  payhero_response: any;
  created_at: string;
  confirmed_at: string | null;
}

export interface DailyTask {
  id: string;
  user_id: string;
  task_date: string;
  question: string;
  content: string;
  word_count: number;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_notes: string | null;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  wallet_source: 'Task' | 'Referral';
  status: string;
  requested_at: string;
  processed_at: string | null;
  processor_notes: string | null;
  admin_id: string | null;
  rejection_reason: string | null;
  approved_at: string | null;
  rejected_at: string | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  balance_after: number;
  source: string | null;
  description: string | null;
  created_at: string;
}

export const COMMISSION_RATES = {
  LEVEL_1: 300,
  LEVEL_2: 100,
  LEVEL_3: 50,
} as const;

export const ACTIVATION_FEE = 500;
