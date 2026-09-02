"use client";

import { useState, useEffect, useCallback } from "react";
import { Proposal, ProposalStatus } from "@/types";
import {
  getBrandProposals,
  getInfluencerProposals,
  getCampaignProposals,
  updateProposalStatus as apiUpdateStatus,
} from "@/services/proposalService";
import { formatFriendlyError } from "@/services/authService";

export function useProposals(options?: {
  brandId?: string;
  influencerId?: string;
  campaignId?: string;
}) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = useCallback(async () => {
    if (!options?.brandId && !options?.influencerId && !options?.campaignId) {
      setProposals([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (options.brandId) {
        const data = await getBrandProposals(options.brandId);
        setProposals(data);
      } else if (options.influencerId) {
        const data = await getInfluencerProposals(options.influencerId);
        setProposals(data);
      } else if (options.campaignId) {
        const data = await getCampaignProposals(options.campaignId);
        setProposals(data);
      }
    } catch (err) {
      setError(
        formatFriendlyError(err, "Não foi possível carregar as propostas no momento.")
      );
    } finally {
      setIsLoading(false);
    }
  }, [options?.brandId, options?.influencerId, options?.campaignId]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const updateStatus = async (proposalId: string, status: ProposalStatus) => {
    await apiUpdateStatus(proposalId, status);
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status } : p))
    );
  };

  return {
    proposals,
    isLoading,
    error,
    reload: fetchProposals,
    updateStatus,
  };
}
