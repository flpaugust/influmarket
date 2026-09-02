"use client";

import { useState, useEffect, useCallback } from "react";
import { Campaign } from "@/types";
import { getOpenCampaigns, getBrandCampaigns } from "@/services/campaignService";
import { formatFriendlyError } from "@/services/authService";

export function useCampaigns(options?: { brandId?: string; niche?: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (options?.brandId) {
        const data = await getBrandCampaigns(options.brandId);
        setCampaigns(data);
      } else {
        const data = await getOpenCampaigns(options?.niche);
        setCampaigns(data);
      }
    } catch (err) {
      setError(
        formatFriendlyError(err, "Não foi possível carregar as campanhas no momento.")
      );
    } finally {
      setIsLoading(false);
    }
  }, [options?.brandId, options?.niche]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    isLoading,
    error,
    reload: fetchCampaigns,
  };
}
