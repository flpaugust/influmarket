"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewCampaignModal from "@/components/modals/NewCampaignModal";
import { useAuth } from "@/context/AuthContext";
import { getCampaignsByBrand } from "@/services/campaignService";
import { getProposalsByBrand } from "@/services/proposalService";
import { listInfluencers } from "@/services/profileService";
import { formatFriendlyError } from "@/services/authService";
import { Campaign, Proposal, UserProfile } from "@/types";
import {
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Filter,
  Users,
  Building2,
  Camera,
  Video,
  Globe,
  Loader2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export default function BrandDashboardView() {
  const { user, profile, showToast } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [influencers, setInfluencers] = useState<UserProfile[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Discovery Filters
  const [selectedNiche, setSelectedNiche] = useState<string>("TODOS");
  const [selectedFollowerRange, setSelectedFollowerRange] = useState<string>("ALL");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);

  const companyName = profile?.companyName || user?.email?.split("@")[0] || "Minha Marca";
  const companyIndustry = profile?.industry || "E-commerce & Varejo";
  const companyLogo = profile?.logo || "";
  const initialLetter = (companyName || "M").charAt(0).toUpperCase();

  const loadData = useCallback(async () => {
    setLoadingData(true);
    setErrorMessage(null);
    try {
      const [camps, props, infs] = await Promise.all([
        user ? getCampaignsByBrand(user.uid) : Promise.resolve([]),
        user ? getProposalsByBrand(user.uid) : Promise.resolve([]),
        listInfluencers({
          niche: selectedNiche,
          followerRange: selectedFollowerRange,
          platform: selectedPlatform,
        }),
      ]);
      setCampaigns(camps);
      setProposals(props);
      setInfluencers(infs);
    } catch (err: any) {
      console.error("Erro ao carregar hub da marca:", err);
      setErrorMessage(
        formatFriendlyError(err, "Não foi possível carregar o marketplace de criadores. Tente novamente.")
      );
    } finally {
      setLoadingData(false);
    }
  }, [user, selectedNiche, selectedFollowerRange, selectedPlatform]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeCampaignsCount = campaigns.filter((c) => c.status === "OPEN").length;
  const pendingProposalsCount = proposals.filter((p) => p.status === "PENDING").length;
  const acceptedProposalsCount = proposals.filter((p) => p.status === "ACCEPTED").length;

  const handleInviteCreator = (creator: UserProfile) => {
    if (activeCampaignsCount === 0) {
      setIsNewCampaignModalOpen(true);
      showToast("💡 Crie uma campanha para convidar criadores diretamente.");
    } else {
      showToast(`📩 Convite enviado com sucesso para ${creator.name || "o criador"}!`);
    }
  };

  const availableNiches = [
    "TODOS",
    "Tech",
    "Moda",
    "Fitness",
    "Gastronomia",
    "Games",
    "Beleza",
    "Lifestyle",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* 1. Header Operacional da Marca */}
          <div className="card-editorial p-6 sm:p-8 bg-white border border-stone-200/90 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-stone-900/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative">
              <div className="flex items-start sm:items-center gap-4">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-stone-100 shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white font-extrabold text-xl flex items-center justify-center ring-2 ring-stone-100 shadow-xs">
                    {initialLetter}
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                      Olá, {companyName}!
                    </h1>
                    <span className="pill-badge pill-lime text-[11px]">Empresa Verificada</span>
                    <span className="pill-badge pill-stone text-[11px]">{companyIndustry}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Você possui{" "}
                    <strong className="text-stone-900 font-bold">{activeCampaignsCount} campanha(s) ativa(s)</strong>{" "}
                    e{" "}
                    <strong className="text-stone-900 font-bold">
                      {pendingProposalsCount} proposta(s)
                    </strong>{" "}
                    aguardando análise de contratação.
                  </p>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-100">
                <Link
                  href="/dashboard/marca?tab=campanhas"
                  className="btn-outline text-xs py-2.5 px-4 flex items-center gap-1.5"
                >
                  Minhas Campanhas ({campaigns.length})
                </Link>
                <button
                  onClick={() => setIsNewCampaignModalOpen(true)}
                  className="btn-lime text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Publicar Nova Campanha
                </button>
              </div>
            </div>
          </div>

          {/* 2. Métricas Rápidas (Clickable cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/dashboard/marca?tab=campanhas"
              className="card-editorial p-5 bg-white border border-stone-200/90 shadow-xs flex items-center justify-between hover:border-stone-400 transition-all group"
            >
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Campanhas Ativas
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-stone-900">
                    {activeCampaignsCount}
                  </span>
                  <span className="text-xs text-stone-500 group-hover:text-stone-900 font-medium">ver todas →</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </Link>

            <Link
              href="/dashboard/marca?tab=propostas"
              className="card-editorial p-5 bg-white border border-stone-200/90 shadow-xs flex items-center justify-between hover:border-stone-400 transition-all group"
            >
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Propostas para Análise
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-amber-600">
                    {pendingProposalsCount}
                  </span>
                  <span className="text-xs text-amber-600 group-hover:underline font-semibold">abrir inbox →</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
            </Link>

            <Link
              href="/dashboard/marca?tab=propostas"
              className="card-editorial p-5 bg-white border border-stone-200/90 shadow-xs flex items-center justify-between hover:border-stone-400 transition-all group"
            >
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Criadores Contratados
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-emerald-600">
                    {acceptedProposalsCount}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">parcerias fechadas</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </Link>
          </div>

          {/* 3. Vitrine / Marketplace de Descoberta de Criadores */}
          <div className="space-y-4">
            {/* Header & Filter Bar */}
            <div className="card-editorial p-5 bg-white border border-stone-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 uppercase tracking-wider mb-0.5">
                    <Users className="w-3.5 h-3.5 text-lime-600" />
                    Marketplace de Descoberta de Criadores
                  </div>
                  <p className="text-xs text-stone-500">
                    Encontre nano e micro criadores verificados para contratar diretamente.
                  </p>
                </div>

                <span className="text-xs font-bold text-stone-700">
                  {influencers.length} criador(es) disponível(is)
                </span>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Niche Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {availableNiches.map((niche) => (
                    <button
                      key={niche}
                      onClick={() => setSelectedNiche(niche)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        selectedNiche === niche
                          ? "bg-stone-900 text-white shadow-xs"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>

                {/* Dropdowns for Follower Range & Platform */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-stone-500 font-medium">Seguidores:</span>
                    <select
                      value={selectedFollowerRange}
                      onChange={(e) => setSelectedFollowerRange(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 focus:outline-none"
                    >
                      <option value="ALL">Todas as faixas</option>
                      <option value="ENTRY">Iniciante (&lt; 10k)</option>
                      <option value="NANO">Nano (10k a 50k)</option>
                      <option value="MICRO">Micro (50k a 200k)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-stone-500 font-medium">Rede:</span>
                    <select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 focus:outline-none"
                    >
                      <option value="ALL">Todas as redes</option>
                      <option value="INSTAGRAM">Instagram</option>
                      <option value="TIKTOK">TikTok</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Creators Grid */}
            {loadingData ? (
              <div className="card-editorial p-12 text-center bg-white flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-stone-900" />
                <p className="text-xs text-stone-500">Buscando criadores no marketplace...</p>
              </div>
            ) : errorMessage ? (
              <div className="card-editorial p-8 text-center bg-rose-50/50 border border-rose-200 flex flex-col items-center gap-3">
                <AlertCircle className="w-8 h-8 text-rose-600" />
                <h3 className="text-sm font-bold text-rose-900">Erro ao carregar criadores</h3>
                <p className="text-xs text-rose-600 max-w-md">{errorMessage}</p>
                <button
                  onClick={() => loadData()}
                  className="btn-dark text-xs py-2 px-4 mt-2"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : influencers.length === 0 ? (
              <div className="card-editorial p-12 text-center bg-white border border-dashed border-stone-300">
                <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-800">
                  Nenhum criador encontrado com os filtros atuais
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
                  Tente ajustar ou limpar seus filtros de nicho, faixa de seguidores e rede social.
                </p>
                <button
                  onClick={() => {
                    setSelectedNiche("TODOS");
                    setSelectedFollowerRange("ALL");
                    setSelectedPlatform("ALL");
                  }}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {influencers.map((inf) => {
                  const creatorInitial = (inf.name || "C").charAt(0).toUpperCase();
                  const followersCount = Number(inf.followers || 0);
                  const engagementVal = Number(inf.engagementRate || 0);

                  return (
                    <div
                      key={inf.uid}
                      className="card-editorial p-6 bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-all group"
                    >
                      <div>
                        {/* Avatar & Header Info */}
                        <div className="flex items-start gap-3.5 mb-4">
                          {inf.avatar ? (
                            <img
                              src={inf.avatar}
                              alt={inf.name || "Criador"}
                              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-100 shadow-xs shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white font-extrabold text-lg flex items-center justify-center ring-2 ring-stone-100 shadow-xs shrink-0">
                              {creatorInitial}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-sm font-bold text-stone-900 truncate">
                                {inf.name || "Criador"}
                              </h3>
                              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Disponível" />
                            </div>
                            <span className="text-xs text-stone-500 block truncate">
                              {inf.handle || `@${(inf.name || "creator").toLowerCase().replace(/\s+/g, "")}`}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="pill-badge pill-stone text-[10px]">
                                {inf.niche || "Geral"}
                              </span>
                              <span className="pill-badge pill-lime text-[10px]">
                                Disponível
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                          {inf.bio || "Criador de conteúdo focado em parcerias e campanhas de alta performance."}
                        </p>

                        {/* Key Metrics Bento */}
                        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-stone-50 border border-stone-100 mb-4 text-center">
                          <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                              Seguidores
                            </span>
                            <span className="text-xs font-extrabold text-stone-900">
                              {followersCount > 0 ? followersCount.toLocaleString("pt-BR") : "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                              Engajamento
                            </span>
                            <span className="text-xs font-extrabold text-emerald-600">
                              {engagementVal > 0 ? `${engagementVal}%` : "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                              Público
                            </span>
                            <span className="text-xs font-extrabold text-stone-700">
                              85% BR
                            </span>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-2 mb-4 text-xs text-stone-500">
                          {inf.instagram && (
                            <a
                              href={inf.instagram.startsWith("http") ? inf.instagram : `https://instagram.com/${inf.instagram.replace("@", "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-stone-600 hover:text-stone-900 font-medium"
                            >
                              <Camera className="w-3.5 h-3.5 text-rose-600" />
                              Instagram
                            </a>
                          )}
                          {inf.tiktok && (
                            <a
                              href={inf.tiktok.startsWith("http") ? inf.tiktok : `https://tiktok.com/@${inf.tiktok.replace("@", "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-stone-600 hover:text-stone-900 font-medium"
                            >
                              <Video className="w-3.5 h-3.5 text-stone-900" />
                              TikTok
                            </a>
                          )}
                          {!inf.instagram && !inf.tiktok && (
                            <span className="text-[11px] text-stone-400">Redes sociais não vinculadas</span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
                        <button
                          onClick={() => handleInviteCreator(inf)}
                          className="w-full btn-dark text-xs py-2 px-3 flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Convidar para Campanha
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal to create a new campaign */}
      <NewCampaignModal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
        onCampaignCreated={() => {
          loadData();
        }}
      />
    </div>
  );
}
