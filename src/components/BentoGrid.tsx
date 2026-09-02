"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, Users, ShieldCheck, Zap, ArrowRight, CheckCircle2, MessageSquare, DollarSign } from "lucide-react";
import Link from "next/link";

export default function BentoGrid() {
  const [activeTab, setActiveTab] = useState<"reach" | "engagement">("reach");
  const [proposalSent, setProposalSent] = useState(false);

  return (
    <section id="showcase" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-lime-600" />
            Showcase da Plataforma
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Tudo o que você precisa para fechar parcerias de alto impacto
          </h2>
          <p className="text-stone-500 mt-3 text-base">
            Uma interface unificada que substitui planilhas confusas, DMs perdidas e negociações sem garantias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Mini Mídia Kit Dinâmico (Span 7) */}
          <div className="md:col-span-7 card-editorial p-6 sm:p-8 flex flex-col justify-between bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-lime-400/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="pill-badge pill-stone">Card 01 • Mídia Kit Live</span>
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setActiveTab("reach")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      activeTab === "reach"
                        ? "bg-white text-stone-900 shadow-xs font-semibold"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    Alcance
                  </button>
                  <button
                    onClick={() => setActiveTab("engagement")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      activeTab === "engagement"
                        ? "bg-white text-stone-900 shadow-xs font-semibold"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    Engajamento
                  </button>
                </div>
              </div>

              {/* Mini profile preview */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-stone-50 border border-stone-200/70">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                  alt="Laura Alcântara"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-xs"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-stone-900">Laura Alcântara</h4>
                    <span className="pill-badge pill-lime text-[10px]">Creator Verificada</span>
                  </div>
                  <p className="text-xs text-stone-500">@laura.tech • Tech & Productividade</p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-stone-900">⭐ 4.9/5.0</span>
                  <p className="text-[11px] text-stone-400">14 parcerias</p>
                </div>
              </div>

              {/* Dynamic stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                  <span className="text-xs text-stone-500 block mb-1">Seguidores</span>
                  <span className="text-xl font-extrabold text-stone-900 tracking-tight">42.5K</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">+12% este mês</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                  <span className="text-xs text-stone-500 block mb-1">
                    {activeTab === "reach" ? "Alcance Médio" : "Taxa de Engaj."}
                  </span>
                  <span className="text-xl font-extrabold text-stone-900 tracking-tight">
                    {activeTab === "reach" ? "120.000" : "5.8%"}
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">3x média nicho</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                  <span className="text-xs text-stone-500 block mb-1">Audiência BR</span>
                  <span className="text-xl font-extrabold text-stone-900 tracking-tight">94.2%</span>
                  <span className="text-[10px] text-stone-500 block mt-0.5 font-medium">18-34 anos</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-lime-500" />
                Métricas atualizadas automaticamente via API de redes sociais.
              </p>
            </div>
          </div>

          {/* Card 2: Exemplo de Campanha com Orçamento (Span 5) */}
          <div className="md:col-span-5 card-editorial p-6 sm:p-8 flex flex-col justify-between bg-stone-900 text-white relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lime-400/20 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="pill-badge bg-stone-800 text-stone-300 border border-stone-700">
                  Card 02 • Campanha Aberta
                </span>
                <span className="text-xs font-mono text-lime-400 font-bold">R$ 2.400,00</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center text-xs font-bold text-lime-400">
                    NG
                  </div>
                  <span className="text-sm font-semibold text-stone-200">NextGen Audio</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Lançamento Fone Noise-Cancelling Pro X
                </h3>
                <p className="text-xs text-stone-400 line-clamp-2">
                  Buscamos creators de tech para demonstrar a tecnologia de cancelamento ativo de ruído em situações reais.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-800 space-y-2 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  <span>1x Reel demonstrativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  <span>3x Stories com link rastreado</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setProposalSent(true)}
                disabled={proposalSent}
                className="w-full btn-lime text-xs py-2.5"
              >
                {proposalSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Proposta Enviada (Teste)
                  </>
                ) : (
                  <>
                    Simular Envio de Proposta <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 3: Fluxo de Proposta e Segurança (Span 12) */}
          <div className="md:col-span-12 card-editorial p-6 sm:p-8 bg-stone-50 border border-stone-200/90">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="pill-badge pill-stone">Card 03 • Garantia & Match</span>
                  <span className="pill-badge pill-emerald">Zero Burocracia</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900">
                  Negociações protegidas do pitch até a aprovação final
                </h3>
                <p className="text-sm text-stone-600">
                  Marcas depositam o valor em custódia segura. O influenciador recebe a liberação garantida após a entrega validada dos conteúdos contratados.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex-1 sm:w-44 text-center">
                  <ShieldCheck className="w-5 h-5 text-stone-900 mx-auto mb-1" />
                  <span className="text-xs font-bold text-stone-900 block">Pagamento Seguro</span>
                  <span className="text-[11px] text-stone-500">Valores em custódia</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex-1 sm:w-44 text-center">
                  <Zap className="w-5 h-5 text-lime-600 mx-auto mb-1" />
                  <span className="text-xs font-bold text-stone-900 block">Match em 24h</span>
                  <span className="text-[11px] text-stone-500">Sem intermediários</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
