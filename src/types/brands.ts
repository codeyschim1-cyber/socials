import { Platform } from './common';

export type DealStatus = 'outreach' | 'negotiation' | 'confirmed' | 'completed';

export interface BrandDeal {
  id: string;
  brandName: string;
  contactName?: string;
  contactEmail?: string;
  platform: Platform;
  status: DealStatus;
  deliverables: string;
  rate: number;
  currency: string;
  deadline?: string;
  notes: string;
  results?: DealResults;
  createdAt: string;
  updatedAt: string;
}

export interface DealResults {
  views: number;
  impressions: number;
  clicks: number;
  saves: number;
  reach: number;
}

export interface IncomeEntry {
  id: string;
  source: string;
  amount: number;
  currency: string;
  date: string;
  category: 'sponsorship' | 'affiliate' | 'ad_revenue' | 'merchandise' | 'other';
  dealId?: string;
  notes: string;
  createdAt: string;
}

export interface IncomeGoal {
  id: string;
  period: 'monthly' | 'yearly';
  targetAmount: number;
  currency: string;
  year: number;
  month?: number;
  createdAt: string;
}
