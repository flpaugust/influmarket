"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SendProposalModal from "@/components/modals/SendProposalModal";
import EditMediaKitModal from "@/components/modals/EditMediaKitModal";
import { useAuth } from "@/context/AuthContext";
import { getOpenCampaigns } from "@/services/campaignService";
import { getInfluencerProposals } from "@/services/proposalService";
import { formatFriendlyError } from "@/services/authService";
import { Campaign, Proposal } from "@/types";
import {
  Sparkles,
  Users,
  TrendingUp,
  Radio,
  ExternalLink,
  Edit3,
  Filter,
  DollarSign,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Video,
  Layers,
  Check,
  Camera,
  Loader2,
  Inbox,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function CreatorDashboardPage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"opportunities" | "proposals">("opportunities");
  const [selectedNiche, setSelectedNiche] = useState<string>("TODOS");
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<string>("ALL");
  const [selectedCampaignForProposal, setSelectedCampaignForProposal] = useState<Campaign | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isMediaKitModalOpen, setIsMediaKitModalOpen] = useState(false);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    setErrorMessage(null);
    try {
      const camps = await getOpenCampaigns();
      setCampaigns(camps);

      if (user) {
        const props = await getInfluencerProposals(user.uid);
        setProposals(props);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do criador:", err);
      setErrorMessage(
        formatFriendlyError(err, "Não foi possível carregar as oportunidades no momento. Tente novamente.")
      );
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [authLoading, loadData]);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesNiche =
      selectedNiche === "TODOS" ||
      camp.niche.toLowerCase().includes(selectedNiche.toLowerCase());

    const matchesBudget =
      selectedBudgetRange === "ALL" ||
      (selectedBudgetRange === "LOW" && Number(camp.budget) <= 1500) ||
      (selectedBudgetRange === "HIGH" && Number(camp.budget) > 1500);

    return matchesNiche && matchesBudget;
  });

  const creatorName = profile?.name || user?.email?.split("@")[0] || "Criador de Conteúdo";
  const creatorHandle = profile?.handle || `@${creatorName.toLowerCase().replace(/\s+/g, "")}`;
  const creatorNiche = profile?.niche || "Geral";
  const creatorFollowers = profile?.followers ?? 0;
  const creatorEngagement = profile?.engagementRate ?? 0;
  const creatorReach = profile?.reach ?? 0;
  const creatorBio =
    profile?.bio || "Defina sua proposta editorial no botão Editar Mídia Kit.";
  const creatorAvatar = profile?.avatar || "";
  const initialLetter = (creatorName || "C").charAt(0).toUpperCase();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-stone-900" />
          <p className="text-sm font-medium text-stone-600">Carregando painel do criador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Grid: Media Kit Summary (Bento / Editorial card) */}
          <div className="card-editorial p-6 sm:p-8 bg-white mb-8 border border-stone-200/90 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative">
              {/* Left Profile Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {creatorAvatar ? (
                  <img
                    src={creatorAvatar}
                    alt={creatorName}
                    className="w-20 h-20 rounded-3xl object-cover ring-2 ring-stone-100 shadow-xs"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-3xl bg-stone-900 text-white font-extrabold text-2xl flex items-center justify-center ring-2 ring-stone-100 shadow-xs">
                    {initialLetter}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                      {creatorName}
                    </h1>
                    <span className="pill-badge pill-lime text-[11px]">
                      Creator Verificado
                    </span>
                    <span className="pill-badge pill-stone text-[11px]">
                      {creatorNiche}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 font-medium">
                    {creatorHandle} • {user ? user.email : "Conta de Criador"}
                  </p>

                  <p className="text-xs text-stone-600 max-w-xl line-clamp-2 mt-1 leading-relaxed">
                    {creatorBio}
                  </p>
                </div>
              </div>

              {/* Right Action & Socials */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                {user ? (
                  <button
                    onClick={() => setIsMediaKitModalOpen(true)}
                    className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Editar Mídia Kit
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="btn-dark text-xs py-2.5 px-4 flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    Entrar para Salvar Mídia Kit
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Metrics Bar (Live numbers from Firestore) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Seguidores
                </span>
                <span className="text-xl font-extrabold text-stone-900">
                  {creatorFollowers.toLocaleString("pt-BR")}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Taxa de Engajamento
                </span>
                <span className="text-xl font-extrabold text-emerald-600">
                  {creatorEngagement}%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Alcance Estimado
                </span>
                <span className="text-xl font-extrabold text-stone-900">
                  {creatorReach.toLocaleString("pt-BR")}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Candidaturas
                </span>
                <span className="text-xl font-extrabold text-stone-900">
                  {proposals.length}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between mb-6 border-b border-stone-200">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setActiveTab("opportunities")}
                className={`pb-3.5 text-sm font-bold transition-all relative ${
                  activeTab === "opportunities"
                    ? "text-stone-900 border-b-2 border-stone-900"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                Mural de Oportunidades ({filteredCampaigns.length})
              </button>
              <button
                onClick={() => setActiveTab("proposals")}
                className={`pb-3.5 text-sm font-bold transition-all relative ${
                  activeTab === "proposals"
                    ? "text-stone-900 border-b-2 border-stone-900"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                Minhas Candidaturas ({proposals.length})
              </button>
            </div>
          </div>

          {/* TAB 1: OPPORTUNITIES FEED */}
          {activeTab === "opportunities" && (
            <div className="space-y-6">
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Nicho:
                  </span>
                  {["TODOS", "Tech", "Moda", "Fitness", "Gastronomia", "Games"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedNiche(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedNiche === cat
                          ? "bg-stone-900 text-white shadow-xs"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-stone-500 font-medium">Orçamento:</span>
                  <select
                    value={selectedBudgetRange}
                    onChange={(e) => setSelectedBudgetRange(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 focus:outline-none"
                  >
                    <option value="ALL">Todos os valores</option>
                    <option value="LOW">Até R$ 1.500</option>
                    <option value="HIGH">Acima de R$ 1.500</option>
                  </select>
                </div>
              </div>

              {/* Campaigns Grid */}
              {loadingData ? (
                <div className="card-editorial p-12 text-center bg-white flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-stone-900" />
                  <p className="text-xs text-stone-500">Buscando oportunidades...</p>
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
                  <Inbox className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                  <h3 className="text-base font-bold text-stone-800 mb-1">
                    Nenhuma oportunidade encontrada
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Não há campanhas abertas para este filtro no momento. Tente selecionar outro nicho ou aguarde novas publicações das marcas.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className="card-editorial p-6 flex flex-col justify-between bg-white border border-stone-200/90 shadow-xs group"
                    >
                      <div>
                        {/* Brand header */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={
                                camp.brandLogo ||
                                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80"
                              }
                              alt={camp.brandName}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-stone-200"
                            />
                            <div>
                              <span className="text-xs font-bold text-stone-900 block leading-none">
                                {camp.brandName}
                              </span>
                              <span className="text-[10px] text-stone-400">
                                {camp.brandIndustry || "E-commerce"}
                              </span>
                            </div>
                          </div>

                          <span className="pill-badge pill-lime text-[11px] font-extrabold">
                            R${" "}
                            {Number(camp.budget).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>

                        <div className="mb-3">
                          <span className="pill-badge pill-stone text-[10px] mb-2 inline-flex">
                            {camp.niche}
                          </span>
                          <h3 className="text-base font-bold text-stone-900 leading-snug">
                            {camp.title}
                          </h3>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                          {camp.description}
                        </p>

                        {/* Deliverables checklist */}
                        {camp.deliverables && camp.deliverables.length > 0 && (
                          <div className="space-y-1.5 p-3 rounded-xl bg-stone-50 border border-stone-200/60 mb-4">
                            <span className="text-[10px] font-bold text-stone-400 block uppercase">
                              Entregáveis Solicitados:
                            </span>
                            {camp.deliverables.slice(0, 2).map((del, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                                <span className="line-clamp-1">{del}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer & CTA */}
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400">
                          {camp.deadline || "Em aberto"}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCampaignForProposal(camp);
                            setIsProposalModalOpen(true);
                          }}
                          className="btn-dark text-xs py-2 px-3.5 flex items-center gap-1.5"
                        >
                          <Send className="w-3 h-3" /> Enviar Pitch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY PROPOSALS */}
          {activeTab === "proposals" && (
            <div className="space-y-4">
              {!user ? (
                <div className="card-editorial p-12 text-center bg-white border border-dashed border-stone-300">
                  <UserCheck className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                  <h3 className="text-base font-bold text-stone-800 mb-1">
                    Faça login para ver suas candidaturas
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                    Acesse sua conta de criador para visualizar o histórico de propostas enviadas e status de aprovação.
                  </p>
                  <Link href="/login" className="btn-dark text-xs py-2 px-5">
                    Entrar na Conta
                  </Link>
                </div>
              ) : proposals.length === 0 ? (
                <div className="card-editorial p-12 text-center bg-white border border-dashed border-stone-300">
                  <Inbox className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                  <h3 className="text-base font-bold text-stone-800 mb-1">
                    Você ainda não enviou nenhuma proposta
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                    Explore o mural de oportunidades e envie sua mensagem personalizada com seu Mídia Kit para as marcas parceiras.
                  </p>
                  <button
                    onClick={() => setActiveTab("opportunities")}
                    className="btn-lime text-xs py-2 px-5 font-bold text-stone-950"
                  >
                    Ver Oportunidades
                  </button>
                </div>
              ) : (
                proposals.map((prop) => (
                  <div
                    key={prop.id}
                    className="card-editorial p-6 bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`pill-badge text-xs font-bold ${
                            prop.status === "ACCEPTED"
                              ? "pill-emerald"
                              : prop.status === "REJECTED"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {prop.status === "ACCEPTED"
                            ? "✓ Aprovada pela Marca"
                            : prop.status === "REJECTED"
                            ? "✕ Recusada"
                            : "⏳ Em Análise"}
                        </span>
                        <span className="text-xs text-stone-400">
                          Enviada em {prop.createdAt ? new Date(prop.createdAt).toLocaleDateString("pt-BR") : "Recente"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900">
                        {prop.campaignTitle}
                      </h3>

                      <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                        "{prop.message}"
                      </p>
                    </div>

                    <div className="text-right self-end md:self-center shrink-0">
                      <span className="text-[10px] text-stone-400 block uppercase font-bold">
                        Valor Proposto
                      </span>
                      <span className="text-base font-extrabold text-stone-900">
                        R${" "}
                        {Number(prop.requestedBudget || 0).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <SendProposalModal
        campaign={selectedCampaignForProposal}
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        onProposalSent={loadData}
      />

      <EditMediaKitModal
        isOpen={isMediaKitModalOpen}
        onClose={() => setIsMediaKitModalOpen(false)}
        onProfileUpdated={refreshProfile}
      />

      <Footer />
    </div>
  );
}
