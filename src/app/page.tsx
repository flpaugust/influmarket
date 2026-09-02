"use client";

import { useAuth } from "@/context/AuthContext";
import HomeLoadingSkeleton from "@/components/home/HomeLoadingSkeleton";
import GuestLandingPage from "@/components/home/GuestLandingPage";
import InfluencerDashboardView from "@/components/home/InfluencerDashboardView";
import BrandDashboardView from "@/components/home/BrandDashboardView";

export default function HomePage() {
  const { user, profile, role, loading } = useAuth();

  // 1. Enquanto o Firebase Auth resolve a sessão, exibe o esqueleto para evitar flash de tela pública
  if (loading) {
    return <HomeLoadingSkeleton />;
  }

  // 2. Se o usuário não estiver autenticado, exibe a Landing Page pública
  if (!user) {
    return <GuestLandingPage />;
  }

  const activeRole = role || (profile?.role as string) || "INFLUENCER";

  // 3. Se autenticado como Marca / Empresa -> Hub da Marca (Marketplace de Descoberta)
  if (activeRole === "BRAND") {
    return <BrandDashboardView />;
  }

  // 4. Se autenticado como Criador / Influenciador -> Feed Operacional do Creator
  return <InfluencerDashboardView />;
}
