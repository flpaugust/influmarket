export type UserRole = "INFLUENCER" | "BRAND";
export type CampaignStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type ProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED";

/**
 * Result Pattern para retornos padronizados de serviços
 */
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Entidade de Domínio: Perfil de Usuário
 */
export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  createdAt?: string | Date;
  // Influencer fields:
  name?: string;
  handle?: string;
  avatar?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  followers?: number;
  engagementRate?: number;
  reach?: number;
  niche?: string;
  bio?: string;
  rating?: number;
  completedDeals?: number;
  // Brand fields:
  companyName?: string;
  logo?: string;
  industry?: string;
  budgetAvailable?: number;
}

/**
 * Entidade de Domínio: Campanha de Marketing
 */
export interface Campaign {
  id?: string;
  brandId: string;
  brandName: string;
  brandLogo?: string;
  brandIndustry?: string;
  title: string;
  description: string;
  deliverables?: string[];
  budget: number;
  niche: string;
  status: CampaignStatus;
  proposalsCount?: number;
  createdAt?: string | Date;
  deadline?: string;
}

/**
 * Entidade de Domínio: Proposta / Pitch
 */
export interface Proposal {
  id?: string;
  campaignId: string;
  campaignTitle: string;
  brandId: string;
  influencerId: string;
  influencerName: string;
  influencerAvatar?: string;
  influencerFollowers: number;
  influencerEngagementRate?: number;
  influencerNiche: string;
  requestedBudget?: number;
  message: string;
  status: ProposalStatus;
  createdAt?: string | Date;
}

/**
 * DTOs (Data Transfer Objects)
 */
export type CreateCampaignDTO = Omit<Campaign, "id" | "proposalsCount" | "createdAt" | "status"> & {
  status?: CampaignStatus;
};
export type UpdateProfileDTO = Partial<Omit<UserProfile, "uid" | "email" | "role">>;
export type SendProposalDTO = Omit<Proposal, "id" | "status" | "createdAt"> & {
  status?: ProposalStatus;
};

// Backward-compatibility aliases for UI components
export type Influencer = UserProfile & {
  name: string;
  handle: string;
  avatar: string;
  niche: string;
  followers: number;
  engagementRate: number;
  reach: number;
  bio: string;
};

export type Brand = UserProfile & {
  companyName: string;
  logo: string;
  industry: string;
  budgetAvailable: number;
};
