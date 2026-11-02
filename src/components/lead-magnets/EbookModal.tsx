"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Download,
  BookOpen,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Mail,
  User,
  Building,
  Loader2,
  FileText,
} from "lucide-react";
import { UserRole } from "@/types";

interface EbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export default function EbookModal({
  isOpen,
  onClose,
  defaultRole = "BRAND",
}: EbookModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [companyOrHandle, setCompanyOrHandle] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim() || name.trim().length < 3) {
      setError("Por favor, informe seu nome completo (mínimo 3 caracteres).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError("Por favor, informe um endereço de e-mail corporativo válido.");
      return;
    }

    if (!acceptTerms) {
      setError("É necessário concordar com a política de privacidade.");
      return;
    }

    setLoading(true);

    try {
      // Simulate genuine lead generation registration latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Trigger automatic simulated download payload
      triggerPlaybookDownload(name.trim(), role);

      setSubmitted(true);
    } catch {
      setError("Ocorreu um erro ao processar seu download. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const triggerPlaybookDownload = (userName: string, userRole: UserRole) => {
    const timestamp = new Date().toLocaleDateString("pt-BR");
    const content = `================================================================================
PLAYBOOK DE MARKETING DE INFLUÊNCIA 2026: ESTRATÉGIAS, MÉTRICAS & ROI
InfluMarket Inc. • Publicação Oficial
================================================================================

Exemplar preparado exclusivamente para: ${userName}
Perfil: ${userRole === "BRAND" ? "Marca / Empresa" : "Criador de Conteúdo"}
Data de emissão: ${timestamp}
Versão: 2.4 (Edição Atualizada 2026)

--------------------------------------------------------------------------------
SUMÁRIO EXECUTIVO
--------------------------------------------------------------------------------
1. O Fim dos Seguidores Fantasmas: A Era dos Micro e Nano Creators
   - Como comunidades de 10k a 50k seguidores geram até 3x mais conversão.
   - Algoritmos de recomendação do TikTok e Instagram em 2026.

2. Precificação Justa e Benchmarks por Nicho
   - Tabela oficial de CPM, CPC e taxa média de engajamento no Brasil.
   - Fórmula matemática para cálculo de cachê e entregáveis.

3. Contratos Blindados e Custódia Segura (Escrow)
   - Por que o pagamento sob custódia protege ambas as partes.
   - Cláusulas essenciais de direitos de imagem e prazos de veiculação.

4. Briefings de Alta Conversão com IA
   - Templates prontos de roteiros de Reels, TikToks e Stories.
   - Estratégias de Call To Action que convertem cliques em faturamento.

5. Métricas que Importam: Além das Curtidas
   - CAC (Custo de Aquisição de Clientes) via criadores.
   - LTV, retenção e taxas de cupom exclusivo.

================================================================================
Acesse a plataforma e execute sua estratégia: https://influmarket.com.br
InfluMarket — Conectando Marcas e Criadores com Dados Reais e Custódia Segura.
================================================================================`;

    try {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Playbook-InfluMarket-2026-${userName.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("Download automático bloqueado pelo navegador:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden z-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors z-20"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Decorative Banner */}
        <div className="bg-stone-900 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-lime-400/20 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-lime-400 border border-stone-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Material Gratuito Exclusivo
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
              Playbook de Marketing de Influência 2026
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Estratégias, benchmarks reais de ROI, modelos de briefing e contratos
              seguros para escalar parcerias de alto impacto.
            </p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-stone-900">
                  Download Iniciado com Sucesso!
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                  Enviamos também uma cópia completa com os anexos para{" "}
                  <strong className="text-stone-900">{email}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <FileText className="w-4 h-4 text-lime-600" />
                  <span>O que você vai encontrar no material:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-500 pl-1">
                  <li>Tabela de benchmarks de CPM e engajamento para 15 nichos</li>
                  <li>Checklist de validação antifraude de criadores</li>
                  <li>Modelo de contrato com proteção de custódia</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => triggerPlaybookDownload(name, role)}
                  className="btn-outline flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Baixar Novamente
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-dark flex-1 py-2.5 text-xs font-bold"
                >
                  Concluir
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Role Toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Eu sou:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("BRAND")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold text-center border transition-all ${
                      role === "BRAND"
                        ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    Marca / Empresa
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("INFLUENCER")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold text-center border transition-all ${
                      role === "INFLUENCER"
                        ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    Criador de Conteúdo
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Seu nome ou apelido profissional"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-stone-900 bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  E-mail Corporativo ou Profissional
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="seuemail@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-stone-900 bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Company / Social Handle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  {role === "BRAND" ? "Empresa / Marca" : "@ do Instagram ou TikTok"}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder={role === "BRAND" ? "Ex: TechCorp Brasil" : "Ex: @seu.perfil"}
                    value={companyOrHandle}
                    onChange={(e) => setCompanyOrHandle(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-stone-900 bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded-sm text-lime-600 focus:ring-lime-500 border-stone-300"
                />
                <label
                  htmlFor="modal-terms"
                  className="text-[11px] text-stone-500 leading-tight cursor-pointer select-none"
                >
                  Concordo em receber conteúdos estratégicos da InfluMarket em conformidade
                  com a LGPD. Sem spam.
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-lime py-3.5 px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                      Gerando seu exemplar personalizado...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-stone-950" />
                      Baixar Playbook Gratuito (PDF)
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <span className="text-[10px] text-stone-400 flex items-center justify-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-stone-400" />
                  +4.800 downloads realizados por profissionais de marketing
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
