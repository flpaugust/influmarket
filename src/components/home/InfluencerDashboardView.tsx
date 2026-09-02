"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EditMediaKitModal from "@/components/modals/EditMediaKitModal";
import SendProposalModal from "@/components/modals/SendProposalModal";
import { useAuth } from "@/context/AuthContext";
import { getOpenCampaigns } from "@/services/campaignService";
import { getProposalsByInfluencer } from "@/services/proposalService";
import { formatFriendlyError } from "@/services/authService";
import { Campaign, Proposal } from "@/types";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  Filter,
  Flame,
  UserCheck,
  Send,
  Edit3,
  Loader2,
  AlertCircle,
  Building2,
  Image as ImageIcon,
} from "lucide-react";

export default function InfluencerDashboardView() {
  const { user, profile } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters & State
  const [selectedNiche, setSelectedNiche] = useState<string>("TODOS");
  const [sortBy, setSortBy] = useState<"NEWEST" | "BUDGET_DESC">("NEWEST");
  const [selectedCampaignForProposal, setSelectedCampaignForProposal] = useState<Campaign | null>(null);
  const [isMediaKitModalOpen, setIsMediaKitModalOpen] = useState(false);

  const creatorName = profile?.name || user?.email?.split("@")[0] || "Criador";
  const creatorNiche = profile?.niche || "Tech";
  const creatorFollowers = profile?.followers ?? 0;
  const creatorEngagement = profile?.engagementRate ?? 0;
  const creatorReach = profile?.reach ?? 0;
  const creatorAvatar = profile?.avatar || "";
  const initialLetter = (creatorName || "C").charAt(0).toUpperCase();

  const loadData = useCallback(async () => {
    setLoadingData(true);
    setErrorMessage(null);
    try {
      const [camps, props] = await Promise.all([
        getOpenCampaigns(),
        user ? getProposalsByInfluencer(user.uid) : Promise.resolve([]),
      ]);
      setCampaigns(camps);
      setProposals(props);
    } catch (err: any) {
      console.error("Erro ao carregar feed do criador:", err);
      setErrorMessage(
        formatFriendlyError(err, "Não foi possível carregar as campanhas no momento. Tente novamente.")
      );
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculations
  const compatibleCampaignsCount = campaigns.filter(
    (c) =>
      c.niche.toLowerCase().includes(creatorNiche.toLowerCase()) ||
      creatorNiche.toLowerCase().includes(c.niche.toLowerCase())
  ).length;

  const pendingProposals = proposals.filter((p) => p.status === "PENDING").length;
  const acceptedProposals = proposals.filter((p) => p.status === "ACCEPTED").length;
  const inNegotiationValue = proposals
    .filter((p) => p.status === "PENDING" || p.status === "ACCEPTED")
    .reduce((acc, p) => acc + (Number(p.requestedBudget) || 0), 0);

  // Filtered & Sorted campaigns
  const filteredCampaigns = campaigns
    .filter((camp) => {
      if (selectedNiche === "TODOS") return true;
      return camp.niche.toLowerCase().includes(selectedNiche.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "BUDGET_DESC") {
        return Number(b.budget) - Number(a.budget);
      }
      return 0; // default order from query
    });

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
          {/* 1. Header de Boas-vindas Personalizado */}
          <div className="card-editorial p-6 sm:p-8 bg-white border border-stone-200/90 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative">
              {/* Profile & Greeting */}
              <div className="flex items-start sm:items-center gap-4">
                {creatorAvatar ? (
                  <img
                    src={creatorAvatar}
                    alt={creatorName}
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
                      Olá, {creatorName}!
                    </h1>
                    <span className="pill-badge pill-lime text-[11px]">
                      Criador Verificado
                    </span>
                    <span className="pill-badge pill-stone text-[11px]">
                      {creatorNiche}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Existem{" "}
                    <strong className="text-stone-900 font-bold">
                      {compatibleCampaignsCount > 0 ? compatibleCampaignsCount : campaigns.length} campanhas
                    </strong>{" "}
                    compatíveis com o seu nicho prontas para receber propostas.
                  </p>
                </div>
              </div>

              {/* Mídia Kit Summary Shortcut */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-100">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Alcance • Engajamento
                  </span>
                  <span className="text-xs font-extrabold text-stone-900">
                    {creatorReach > 0 ? creatorReach.toLocaleString("pt-BR") : "0"} alc. •{" "}
                    <span className="text-emerald-600">{creatorEngagement}% eng.</span>
                  </span>
                </div>

                <button
                  onClick={() => setIsMediaKitModalOpen(true)}
                  className="btn-dark text-xs py-2 px-3.5 flex items-center gap-1.5 shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Editar Mídia Kit
                </button>
              </div>
            </div>
          </div>

          {/* 2. Métricas Rápidas (Pílulas / Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-editorial p-5 bg-white border border-stone-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Propostas Enviadas
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-stone-900">
                    {proposals.length}
                  </span>
                  <span className="text-xs text-stone-500">
                    ({pendingProposals} pendentes • {acceptedProposals} aceitas)
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
            </div>

            <div className="card-editorial p-5 bg-white border border-stone-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Parcerias Fechadas
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-emerald-600">
                    {acceptedProposals}
                  </span>
                  <span className="text-xs text-stone-500">contratos ativos</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="card-editorial p-5 bg-white border border-stone-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Valor em Negociação
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-stone-900">
                    R${" "}
                    {inNegotiationValue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* 3. Mural de Campanhas Abertas */}
          <div className="space-y-4">
            {/* Filter & Sort Bar */}
            <div className="card-editorial p-4 bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Niche Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider mr-1">
                  Nicho:
                </span>
                {availableNiches.map((niche) => (
                  <button
                    key={niche}
                    onClick={() => setSelectedNiche(niche)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedNiche === niche
                        ? "bg-stone-900 text-white shadow-xs"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <span className="text-xs text-stone-500 font-medium">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 focus:outline-none"
                >
                  <option value="NEWEST">Mais Recentes</option>
                  <option value="BUDGET_DESC">Maior Orçamento (Cachê)</option>
                </select>
              </div>
            </div>

            {/* Campaign Grid */}
            {loadingData ? (
              <div className="card-editorial p-12 text-center bg-white flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-stone-900" />
                <p className="text-xs text-stone-500">Buscando oportunidades em aberto...</p>
              </div>
            ) : errorMessage ? (
              <div className="card-editorial p-8 text-center bg-rose-50/50 border border-rose-200 flex flex-col items-center gap-3">
                <AlertCircle className="w-8 h-8 text-rose-600" />
                <h3 className="text-sm font-bold text-rose-900">Erro ao carregar oportunidades</h3>
                <p className="text-xs text-rose-600 max-w-md">{errorMessage}</p>
                <button
                  onClick={() => loadData()}
                  className="btn-dark text-xs py-2 px-4 mt-2"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="card-editorial p-12 text-center bg-white border border-dashed border-stone-300">
                <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-800">
                  Nenhuma campanha encontrada no momento
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
                  {selectedNiche !== "TODOS"
                    ? `Não há campanhas com o nicho "${selectedNiche}". Tente selecionar "TODOS" para ver mais vagas.`
                    : "Novas campanhas de marcas parceiras serão publicadas em breve."}
                </p>
                {selectedNiche !== "TODOS" && (
                  <button
                    onClick={() => setSelectedNiche("TODOS")}
                    className="btn-outline text-xs py-2 px-4"
                  >
                    Ver Todos os Nichos
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="card-editorial p-6 bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-all group"
                  >
                    <div>
                      {/* Top Brand info & Budget */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2.5">
                          {camp.brandLogo ? (
                            <img
                              src={camp.brandLogo}
                              alt={camp.brandName}
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-stone-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                              {camp.brandName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-bold text-stone-900 block line-clamp-1">
                              {camp.brandName}
                            </span>
                            <span className="text-[10px] text-stone-400 block">
                              {camp.brandIndustry || "E-commerce"}
                            </span>
                          </div>
                        </div>

                        <span className="pill-badge pill-lime text-xs font-extrabold shrink-0">
                          R${" "}
                          {Number(camp.budget).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      {/* Title & Niche */}
                      <div className="mb-2">
                        <span className="pill-badge pill-stone text-[10px] mb-1.5">
                          {camp.niche}
                        </span>
                        <h3 className="text-base font-bold text-stone-900 leading-snug group-hover:text-stone-700 transition-colors">
                          {camp.title}
                        </h3>
                      </div>

                      <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed mb-4">
                        {camp.description}
                      </p>

                      {/* Deliverables summary */}
                      {camp.deliverables && camp.deliverables.length > 0 && (
                        <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-stone-50 border border-stone-100">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                            Entregáveis Requeridos:
                          </span>
                          {camp.deliverables.map((del, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 text-xs text-stone-700"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                              <span className="line-clamp-1">{del}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {camp.deadline || "Prazo flexível"}
                      </span>
                      <button
                        onClick={() => setSelectedCampaignForProposal(camp)}
                        className="btn-dark text-xs py-2 px-4 flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" /> Enviar Proposta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Interactive Send Proposal Modal */}
      {selectedCampaignForProposal && (
        <SendProposalModal
          campaign={selectedCampaignForProposal}
          isOpen={Boolean(selectedCampaignForProposal)}
          onClose={() => setSelectedCampaignForProposal(null)}
          onProposalSent={() => {
            loadData();
          }}
        />
      )}

      {/* Edit Media Kit Modal */}
      <EditMediaKitModal
        isOpen={isMediaKitModalOpen}
        onClose={() => setIsMediaKitModalOpen(false)}
        onProfileUpdated={() => {
          loadData();
        }}
      />
    </div>
  );
}
