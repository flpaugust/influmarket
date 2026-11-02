"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  MousePointerClick,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calculator,
  RotateCcw,
} from "lucide-react";
import {
  NICHES_DATA,
  calculateRoiMetrics,
} from "@/services/seoData";

interface RoiCalculatorProps {
  initialNicheSlug?: string;
  initialBudget?: number;
  className?: string;
  showCta?: boolean;
}

export default function RoiCalculator({
  initialNicheSlug = "tecnologia",
  initialBudget = 3000,
  className = "",
  showCta = true,
}: RoiCalculatorProps) {
  const [selectedNicheSlug, setSelectedNicheSlug] = useState<string>(initialNicheSlug);
  const [budget, setBudget] = useState<number>(initialBudget);
  const [useCustomReach, setUseCustomReach] = useState<boolean>(false);
  const [customReach, setCustomReach] = useState<number>(100000);

  const budgetSliderId = useId();
  const customReachSliderId = useId();

  // Presets for quick selection
  const budgetPresets = [1000, 2500, 5000, 10000, 25000];

  // Calculation memo
  const results = useMemo(() => {
    return calculateRoiMetrics({
      budget,
      nicheSlug: selectedNicheSlug,
      targetReach: useCustomReach ? customReach : undefined,
    });
  }, [budget, selectedNicheSlug, useCustomReach, customReach]);

  const activeNiche = useMemo(() => {
    return (
      NICHES_DATA.find((n) => n.slug === selectedNicheSlug) || NICHES_DATA[0]
    );
  }, [selectedNicheSlug]);

  const handleReset = () => {
    setSelectedNicheSlug(initialNicheSlug);
    setBudget(initialBudget);
    setUseCustomReach(false);
    setCustomReach(100000);
  };

  return (
    <div
      className={`card-editorial bg-white p-6 sm:p-8 md:p-10 border border-stone-200/90 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100/70 text-lime-900 border border-lime-200 text-xs font-bold tracking-tight">
            <Calculator className="w-3.5 h-3.5 text-lime-700" />
            Simulador de Impacto e Retorno (ROI)
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Calcule o Retorno Real da Sua Campanha
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
            Ajuste seu investimento e descubra alcance estimado, cliques qualificados,
            conversões projetadas e retorno financeiro com base em dados de mercado.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 self-start md:self-center px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          title="Restaurar valores padrão"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restaurar
        </button>
      </div>

      {/* Main Grid: Controls vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Column: Interactive Controls (Span 6) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Niche Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                1. Selecione o Nicho da Campanha
              </label>
              <span className="text-[11px] text-stone-400 font-medium">
                CTR Médio: {activeNiche.benchmarks.avgCtr}%
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 border border-stone-200/80 rounded-xl bg-stone-50/60">
              {NICHES_DATA.map((niche) => {
                const isSelected = niche.slug === selectedNicheSlug;
                return (
                  <button
                    key={niche.slug}
                    type="button"
                    onClick={() => setSelectedNicheSlug(niche.slug)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all truncate ${
                      isSelected
                        ? "bg-stone-900 text-white shadow-xs"
                        : "bg-white text-stone-700 hover:bg-stone-200/60 border border-stone-200/60"
                    }`}
                  >
                    {niche.name}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-500 mt-2">
              {activeNiche.tagline}
            </p>
          </div>

          {/* Budget Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor={budgetSliderId} className="text-xs font-bold uppercase tracking-wider text-stone-700">
                2. Orçamento Disponível
              </label>
              <div className="flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-500 font-semibold">R$</span>
                <input
                  type="number"
                  min={50}
                  max={500000}
                  step={100}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value) || 0)}
                  className="w-24 text-right text-sm font-extrabold text-stone-900 bg-transparent focus:outline-hidden"
                />
              </div>
            </div>

            {/* Slider */}
            <input
              id={budgetSliderId}
              type="range"
              min={100}
              max={50000}
              step={100}
              value={budget > 50000 ? 50000 : budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              aria-label="Orçamento da campanha"
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-lime-500"
            />

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-stone-400 font-medium">Atalhos:</span>
              {budgetPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBudget(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    budget === preset
                      ? "bg-lime-400 text-stone-950 font-bold"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  R$ {preset.toLocaleString("pt-BR")}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reach Toggle */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="custom-reach-toggle"
                  checked={useCustomReach}
                  onChange={(e) => setUseCustomReach(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-lime-600 focus:ring-lime-500 border-stone-300"
                />
                <label
                  htmlFor="custom-reach-toggle"
                  className="text-xs font-bold text-stone-800 cursor-pointer select-none"
                >
                  Definir meta personalizada de alcance
                </label>
              </div>
              <span className="text-[10px] text-stone-400 font-medium">Opcional</span>
            </div>

            {useCustomReach && (
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Meta de Impressões:</span>
                  <span className="font-bold text-stone-900">
                    {customReach.toLocaleString("pt-BR")} visualizações
                  </span>
                </div>
                <input
                  id={customReachSliderId}
                  type="range"
                  min={10000}
                  max={1000000}
                  step={10000}
                  value={customReach}
                  onChange={(e) => setCustomReach(Number(e.target.value))}
                  aria-label="Meta de alcance de impressões"
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Metrics & Projection (Span 6) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          {/* Main Hero Card: ROI & Revenue */}
          <div className="card-editorial p-6 bg-stone-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="pill-badge bg-stone-800 text-lime-400 border border-stone-700 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> Retorno Financeiro Estimado
              </span>
              <span className="text-xs font-bold text-lime-300 bg-lime-950/60 px-2 py-0.5 rounded-full border border-lime-800">
                ROI +{results.roiPercentage}%
              </span>
            </div>

            <div className="space-y-1 mb-6">
              <span className="text-xs text-stone-400 uppercase tracking-wider block font-semibold">
                Faturamento Bruto Projetado
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-baseline gap-2">
                <span>
                  R${" "}
                  {results.projectedRevenue.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-xs text-stone-400 font-normal">
                  (lucro bruto estimado)
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar inside hero */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-800">
              <div>
                <span className="text-[11px] text-stone-400 block">CPM Efetivo</span>
                <span className="text-base font-bold text-stone-100">
                  R$ {results.cpm.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block">CPC Estimado</span>
                <span className="text-base font-bold text-stone-100">
                  R$ {results.cpc.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Impressions */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 text-center flex flex-col justify-between">
              <Users className="w-4 h-4 text-stone-600 mx-auto mb-1.5" />
              <span className="text-[11px] text-stone-500 font-medium block">
                Impressões
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                {results.projectedImpressions >= 1000000
                  ? `${(results.projectedImpressions / 1000000).toFixed(1)}M`
                  : results.projectedImpressions >= 1000
                  ? `${Math.round(results.projectedImpressions / 1000)}k`
                  : results.projectedImpressions}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">alcance visual</span>
            </div>

            {/* Clicks */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 text-center flex flex-col justify-between">
              <MousePointerClick className="w-4 h-4 text-stone-600 mx-auto mb-1.5" />
              <span className="text-[11px] text-stone-500 font-medium block">
                Cliques Estimados
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                {results.estimatedClicks.toLocaleString("pt-BR")}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                CTR {results.benchmarkCtr}%
              </span>
            </div>

            {/* Conversions */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 text-center flex flex-col justify-between">
              <DollarSign className="w-4 h-4 text-stone-600 mx-auto mb-1.5" />
              <span className="text-[11px] text-stone-500 font-medium block">
                Vendas / Leads
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                ~{results.projectedConversions}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                taxa {results.benchmarkConversionRate}%
              </span>
            </div>
          </div>

          {/* Trust footnote */}
          <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50/60 p-3 rounded-xl border border-stone-100">
            <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
            <p className="text-[11px] leading-tight">
              Os valores orçados ficam em <strong>custódia protegida</strong> até a validação
              das entregas pelo criador contratado.
            </p>
          </div>

          {/* CTA Button */}
          {showCta && (
            <div className="pt-2">
              <Link
                href={`/hub?budget=${budget}&niche=${selectedNicheSlug}`}
                className="w-full btn-lime py-3.5 px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs group"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                Criar Campanha com Esse Orçamento (R$ {budget.toLocaleString("pt-BR")})
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="flex items-center justify-center gap-4 mt-2 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sem taxas antecipadas
                </span>
                <span>•</span>
                <span>Setup via IA em 60 segundos</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
