"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewCampaignModal from "@/components/modals/NewCampaignModal";
import { useAuth } from "@/context/AuthContext";
import { getBrandCampaigns } from "@/services/campaignService";
import { getBrandProposals, updateProposalStatus } from "@/services/proposalService";
import { formatFriendlyError } from "@/services/authService";
import { Campaign, Proposal } from "@/types";
import {
  Building2,
  Plus,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Send,
  Loader2,
  Inbox,
  AlertCircle,
  Filter,
  MessageSquare,
  FileText,
} from "lucide-react";
import Link from "next/link";

function BrandDashboardContent() {
  const { user, profile, loading: authLoading, showToast } = useAuth();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "propostas" ? "propostas" : "campanhas";

  const [activeTab, setActiveTab] = useState<"campanhas" | "propostas">(initialTab);
  const [selectedProposalFilter, setSelectedProposalFilter] = useState<"ALL" | "PENDING" | "ACCEPTED" | "REJECTED">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "propostas" || tabParam === "campanhas") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    setErrorMessage(null);
    try {
      const [camps, props] = await Promise.all([
        getBrandCampaigns(user.uid),
        getBrandProposals(user.uid),
      ]);
      setCampaigns(camps);
      setProposals(props);
      if (camps.length > 0 && !expandedCampaignId) {
        setExpandedCampaignId(camps[0].id || null);
      }
    } catch (err) {
      console.error("Erro ao carregar dados da marca:", err);
      setErrorMessage(
        formatFriendlyError(err, "Não foi possível carregar os dados. Verifique sua conexão e tente novamente.")
      );
    } finally {
      setLoadingData(false);
    }
  }, [user, expandedCampaignId]);

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    } else if (!authLoading && !user) {
      setLoadingData(false);
    }
  }, [user, authLoading, loadData]);

  const handleUpdateStatus = async (proposalId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      await updateProposalStatus(proposalId, status);
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status } : p))
      );
      showToast(
        status === "ACCEPTED"
          ? "🎉 Proposta aceita! O contrato foi gerado com sucesso."
          : "Proposta recusada com feedback cordial."
      );
    } catch (err) {
      console.error("Erro ao atualizar status da proposta:", err);
      showToast("❌ Erro ao atualizar proposta.");
    }
  };

  const companyName = profile?.companyName || user?.email?.split("@")[0] || "Minha Marca";
  const companyIndustry = profile?.industry || "E-commerce & Varejo";
  const companyLogo = profile?.logo || "";
  const initialLetter = (companyName || "M").charAt(0).toUpperCase();

  const activeCampaignsCount = campaigns.filter((c) => c.status === "OPEN").length;
  const totalBudget = campaigns.reduce((acc, c) => acc + (Number(c.budget) || 0), 0);
  const pendingProposalsCount = proposals.filter((p) => p.status === "PENDING").length;
  const acceptedProposalsCount = proposals.filter((p) => p.status === "ACCEPTED").length;
  const matchRate = proposals.length > 0 ? Math.round((acceptedProposalsCount / proposals.length) * 100) : 0;

  // Filtered proposals list for the dedicated tab
  const filteredProposals = proposals.filter((p) => {
    if (selectedProposalFilter === "ALL") return true;
    return p.status === selectedProposalFilter;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-stone-900" />
          <p className="text-sm font-medium text-stone-600">Carregando painel da marca...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
          <div className="card-editorial p-8 max-w-md w-full text-center bg-white border border-stone-200">
            <Building2 className="w-12 h-12 mx-auto text-stone-400 mb-4" />
            <h2 className="text-xl font-bold text-stone-900 mb-2">Acesso Restrito</h2>
            <p className="text-xs text-stone-500 mb-6">
              Faça login com sua conta de empresa para visualizar e gerenciar suas campanhas e propostas.
            </p>
            <div className="flex gap-3">
              <Link href="/login" className="flex-1 btn-dark text-xs py-2.5">
                Entrar
              </Link>
              <Link href="/cadastro" className="flex-1 btn-outline text-xs py-2.5">
                Criar Conta
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Bar / Brand Identifier */}
          <div className="card-editorial p-6 sm:p-8 bg-white border border-stone-200/90 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
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
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                      {companyName}
                    </h1>
                    <span className="pill-badge pill-lime text-[11px]">Empresa Verificada</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {companyIndustry} • ID: <span className="font-mono">{user.uid.slice(0, 8)}...</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-lime text-xs py-2.5 px-4 w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-stone-950"
                >
                  <Plus className="w-4 h-4" /> Publicar Nova Campanha
                </button>
              </div>
            </div>
          </div>

          {/* Metrics Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTab("campanhas")}
              className={`card-editorial p-5 bg-white border text-left transition-all ${
                activeTab === "campanhas" ? "ring-2 ring-stone-900 border-stone-900" : "border-stone-200/80 hover:border-stone-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Campanhas Ativas
                </span>
                <span className="p-2 rounded-xl bg-stone-100 text-stone-700">
                  <Building2 className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-stone-900">
                  {activeCampaignsCount}
                </span>
                <span className="text-xs text-stone-400">no mural público</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("propostas")}
              className={`card-editorial p-5 bg-white border text-left transition-all ${
                activeTab === "propostas" ? "ring-2 ring-stone-900 border-stone-900" : "border-stone-200/80 hover:border-stone-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Propostas Recebidas
                </span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <MessageSquare className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-stone-900">
                  {proposals.length}
                </span>
                <span className="text-xs text-amber-600 font-semibold">
                  {pendingProposalsCount} pendente(s)
                </span>
              </div>
            </button>

            <div className="card-editorial p-5 bg-white border border-stone-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Orçamento Total
                </span>
                <span className="p-2 rounded-xl bg-stone-100 text-stone-700">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-stone-900">
                  R$ {totalBudget.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="card-editorial p-5 bg-white border border-stone-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Taxa de Conversão
                </span>
                <span className="p-2 rounded-xl bg-lime-100/70 text-lime-900">
                  <TrendingUp className="w-4 h-4 text-lime-700" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-stone-900">{matchRate}%</span>
                <span className="text-xs text-stone-400">propostas aceitas</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation Header */}
          <div className="border-b border-stone-200 flex items-center gap-6">
            <button
              onClick={() => setActiveTab("campanhas")}
              className={`pb-3 text-sm font-bold transition-all relative ${
                activeTab === "campanhas"
                  ? "text-stone-900 border-b-2 border-stone-900"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Minhas Campanhas ({campaigns.length})
            </button>
            <button
              onClick={() => setActiveTab("propostas")}
              className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
                activeTab === "propostas"
                  ? "text-stone-900 border-b-2 border-stone-900"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Propostas Recebidas ({proposals.length})
              {pendingProposalsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
                  {pendingProposalsCount}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: MINHAS CAMPANHAS */}
          {activeTab === "campanhas" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                    Minhas Campanhas Publicadas
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Gerencie seus briefings, entregáveis e visualize candidaturas por campanha.
                  </p>
                </div>

                <span className="text-xs font-medium text-stone-500">
                  Total: {campaigns.length} campanha(s)
                </span>
              </div>

              {loadingData ? (
                <div className="card-editorial p-12 text-center bg-white flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-stone-900" />
                  <p className="text-xs text-stone-500">Buscando campanhas...</p>
                </div>
              ) : errorMessage ? (
                <div className="card-editorial p-8 text-center bg-rose-50/50 border border-rose-200 flex flex-col items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-rose-600" />
                  <h3 className="text-sm font-bold text-rose-900">Erro ao carregar dados</h3>
                  <p className="text-xs text-rose-600 max-w-md">{errorMessage}</p>
                  <button
                    onClick={() => loadData()}
                    className="btn-dark text-xs py-2 px-4 mt-2"
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="card-editorial p-12 text-center bg-white border border-dashed border-stone-300">
                  <Inbox className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                  <h3 className="text-base font-bold text-stone-800 mb-1">
                    Nenhuma campanha criada ainda
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                    Publique sua primeira oportunidade de parceria para que nano e micro criadores qualificados enviem propostas com seus Mídia Kits.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-lime text-xs py-2.5 px-5 font-bold text-stone-950 inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Criar Primeira Campanha
                  </button>
                </div>
              ) : (
                campaigns.map((camp) => {
                  const isExpanded = expandedCampaignId === camp.id;
                  const campaignProposals = proposals.filter((p) => p.campaignId === camp.id);

                  return (
                    <div
                      key={camp.id}
                      className="card-editorial bg-white border border-stone-200/90 overflow-hidden shadow-xs"
                    >
                      {/* Header bar of campaign */}
                      <div
                        onClick={() => setExpandedCampaignId(isExpanded ? null : (camp.id || null))}
                        className="p-6 cursor-pointer hover:bg-stone-50/60 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2.5">
                            <span className="pill-badge pill-stone text-[11px] font-bold">
                              {camp.niche}
                            </span>
                            <span
                              className={`pill-badge text-[11px] ${
                                camp.status === "OPEN"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-stone-100 text-stone-500 border-stone-200"
                              }`}
                            >
                              {camp.status === "OPEN" ? "Aberta para Propostas" : "Encerrada"}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-stone-900">{camp.title}</h3>
                          <p className="text-xs text-stone-500 line-clamp-1 max-w-2xl">
                            {camp.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-6 self-end md:self-center">
                          <div className="text-right">
                            <span className="text-[10px] text-stone-400 block uppercase font-bold">
                              Orçamento
                            </span>
                            <span className="text-base font-extrabold text-stone-900">
                              R$ {Number(camp.budget).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-stone-400 block uppercase font-bold">
                              Propostas
                            </span>
                            <span className="text-base font-extrabold text-stone-900">
                              {campaignProposals.length}
                            </span>
                          </div>

                          <button className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Proposals Panel (Accordion) */}
                      {isExpanded && (
                        <div className="p-6 bg-stone-50/50 border-t border-stone-100 space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                              Candidaturas Recebidas ({campaignProposals.length})
                            </h4>
                            <span className="text-[11px] text-stone-400">
                              Valores sob custódia segura
                            </span>
                          </div>

                          {campaignProposals.length === 0 ? (
                            <div className="p-8 text-center bg-white rounded-xl border border-stone-200/70">
                              <p className="text-xs text-stone-500">
                                Nenhum criador enviou proposta para esta campanha ainda.
                              </p>
                            </div>
                          ) : (
                            campaignProposals.map((prop) => (
                              <div
                                key={prop.id}
                                className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                              >
                                <div className="flex items-start gap-3.5 flex-1">
                                  {prop.influencerAvatar ? (
                                    <img
                                      src={prop.influencerAvatar}
                                      alt={prop.influencerName}
                                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-stone-200 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white font-bold text-base flex items-center justify-center shrink-0">
                                      {(prop.influencerName || "C").charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-stone-900 text-sm">
                                        {prop.influencerName}
                                      </span>
                                      <span className="pill-badge pill-stone text-[10px]">
                                        {prop.influencerNiche}
                                      </span>
                                      <span className="text-xs text-stone-400">
                                        • {(prop.influencerFollowers || 0).toLocaleString("pt-BR")} segs
                                      </span>
                                    </div>

                                    <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                                      "{prop.message}"
                                    </p>

                                    <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-400">
                                      <span>Engajamento: {prop.influencerEngagementRate || 5.0}%</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right proposal budget & actions */}
                                <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                                  <div className="text-right">
                                    <span className="text-[10px] text-stone-400 block uppercase font-bold">
                                      Valor Solicitado
                                    </span>
                                    <span className="text-sm font-extrabold text-stone-900">
                                      R${" "}
                                      {Number(prop.requestedBudget || camp.budget).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                      })}
                                    </span>
                                  </div>

                                  {prop.status === "PENDING" ? (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleUpdateStatus(prop.id!, "ACCEPTED")}
                                        className="p-2 rounded-xl bg-lime-400 text-stone-950 font-bold hover:bg-lime-300 transition-all text-xs flex items-center gap-1 shadow-xs"
                                        title="Aceitar Proposta"
                                      >
                                        <CheckCircle2 className="w-4 h-4" /> Aceitar
                                      </button>
                                      <button
                                        onClick={() => handleUpdateStatus(prop.id!, "REJECTED")}
                                        className="p-2 rounded-xl bg-stone-100 text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-all text-xs flex items-center gap-1"
                                        title="Recusar Proposta"
                                      >
                                        <XCircle className="w-4 h-4" /> Recusar
                                      </button>
                                    </div>
                                  ) : (
                                    <span
                                      className={`pill-badge text-xs ${
                                        prop.status === "ACCEPTED"
                                          ? "pill-emerald"
                                          : "bg-rose-50 text-rose-700 border-rose-200"
                                      }`}
                                    >
                                      {prop.status === "ACCEPTED" ? "✓ Proposta Aceita" : "✕ Recusada"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: PROPOSTAS RECEBIDAS (INBOX CENTRALIZADA) */}
          {activeTab === "propostas" && (
            <div className="space-y-6">
              {/* Header and Filter Bar */}
              <div className="card-editorial p-5 bg-white border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                    Inbox de Propostas Recebidas
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Avalie os pitches enviados por criadores para todas as suas campanhas ativas.
                  </p>
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setSelectedProposalFilter("ALL")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedProposalFilter === "ALL"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    Todas ({proposals.length})
                  </button>
                  <button
                    onClick={() => setSelectedProposalFilter("PENDING")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedProposalFilter === "PENDING"
                        ? "bg-amber-500 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    Pendentes ({pendingProposalsCount})
                  </button>
                  <button
                    onClick={() => setSelectedProposalFilter("ACCEPTED")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedProposalFilter === "ACCEPTED"
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    Aceitas ({acceptedProposalsCount})
                  </button>
                  <button
                    onClick={() => setSelectedProposalFilter("REJECTED")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedProposalFilter === "REJECTED"
                        ? "bg-rose-600 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    Recusadas ({proposals.filter((p) => p.status === "REJECTED").length})
                  </button>
                </div>
              </div>

              {/* Proposals List */}
              {loadingData ? (
                <div className="card-editorial p-12 text-center bg-white flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-stone-900" />
                  <p className="text-xs text-stone-500">Buscando propostas...</p>
                </div>
              ) : filteredProposals.length === 0 ? (
                <div className="card-editorial p-12 text-center bg-white border border-dashed border-stone-300">
                  <MessageSquare className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                  <h3 className="text-base font-bold text-stone-800 mb-1">
                    Nenhuma proposta encontrada
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                    {selectedProposalFilter !== "ALL"
                      ? "Nenhuma proposta com este status no momento."
                      : "Assim que influenciadores enviarem propostas para suas campanhas, elas aparecerão aqui."}
                  </p>
                  {selectedProposalFilter !== "ALL" && (
                    <button
                      onClick={() => setSelectedProposalFilter("ALL")}
                      className="btn-outline text-xs py-2 px-4"
                    >
                      Ver Todas as Propostas
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProposals.map((prop) => {
                    const creatorInitial = (prop.influencerName || "C").charAt(0).toUpperCase();

                    return (
                      <div
                        key={prop.id}
                        className="card-editorial p-6 bg-white border border-stone-200/90 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-stone-400 transition-all"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          {prop.influencerAvatar ? (
                            <img
                              src={prop.influencerAvatar}
                              alt={prop.influencerName}
                              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-100 shadow-xs shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white font-extrabold text-lg flex items-center justify-center shrink-0">
                              {creatorInitial}
                            </div>
                          )}

                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-bold text-stone-900">
                                {prop.influencerName}
                              </h3>
                              <span className="pill-badge pill-stone text-[10px]">
                                {prop.influencerNiche}
                              </span>
                              <span className="text-xs text-stone-500">
                                • {(prop.influencerFollowers || 0).toLocaleString("pt-BR")} seguidores
                              </span>
                              <span className="text-xs text-emerald-600 font-semibold">
                                • {prop.influencerEngagementRate || 5.0}% eng.
                              </span>
                            </div>

                            <div className="text-xs text-stone-500">
                              Campanha: <strong className="text-stone-800">{prop.campaignTitle}</strong>
                            </div>

                            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-700 leading-relaxed">
                              "{prop.message}"
                            </div>
                          </div>
                        </div>

                        {/* Right: Budget & Actions */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                          <div className="text-left lg:text-right">
                            <span className="text-[10px] text-stone-400 block uppercase font-bold">
                              Proposta de Cachê
                            </span>
                            <span className="text-xl font-extrabold text-stone-900">
                              R${" "}
                              {Number(prop.requestedBudget || 0).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>

                          {prop.status === "PENDING" ? (
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => handleUpdateStatus(prop.id!, "ACCEPTED")}
                                className="btn-lime text-xs py-2 px-4 font-bold flex items-center justify-center gap-1.5 shadow-xs flex-1 sm:flex-initial"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Aceitar Proposta
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(prop.id!, "REJECTED")}
                                className="btn-outline text-xs py-2 px-3.5 text-stone-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                              >
                                <XCircle className="w-4 h-4" /> Recusar
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`pill-badge text-xs py-1.5 px-3 font-bold ${
                                prop.status === "ACCEPTED"
                                  ? "pill-emerald"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {prop.status === "ACCEPTED" ? "✓ Proposta Aceita" : "✕ Proposta Recusada"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <NewCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCampaignCreated={loadData}
      />

      <Footer />
    </div>
  );
}

export default function BrandDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
          <Loader2 className="w-8 h-8 animate-spin text-stone-900" />
        </div>
      }
    >
      <BrandDashboardContent />
    </Suspense>
  );
}
