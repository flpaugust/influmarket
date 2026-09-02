"use client";

import { useState } from "react";
import { X, Send, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendProposal } from "@/services/proposalService";
import { formatFriendlyError } from "@/services/authService";
import { Campaign } from "@/types";

interface SendProposalModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onProposalSent?: () => void;
}

export default function SendProposalModal({
  campaign,
  isOpen,
  onClose,
  onProposalSent,
}: SendProposalModalProps) {
  const { user, profile, showToast } = useAuth();
  const [message, setMessage] = useState("");
  const [requestedBudget, setRequestedBudget] = useState(
    campaign ? campaign.budget.toString() : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !campaign) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Por favor preencha a mensagem de apresentação.");
      return;
    }

    if (!user) {
      setError("Você precisa estar autenticado como criador para enviar uma proposta.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await sendProposal({
        campaignId: campaign.id || "unknown-camp",
        campaignTitle: campaign.title,
        brandId: campaign.brandId,
        influencerId: user.uid,
        influencerName: profile?.name || user.email?.split("@")[0] || "Criador",
        influencerAvatar: profile?.avatar,
        influencerFollowers: profile?.followers ?? 0,
        influencerEngagementRate: profile?.engagementRate ?? 0,
        influencerNiche: profile?.niche || "Geral",
        requestedBudget: parseFloat(requestedBudget) || campaign.budget,
        message,
      });

      showToast("🚀 Proposta enviada com sucesso para a marca!");
      setMessage("");
      onClose();
      if (onProposalSent) onProposalSent();
    } catch (err: any) {
      console.error("Erro ao enviar proposta:", err);
      setError(
        formatFriendlyError(err, "Não foi possível enviar sua proposta no momento. Tente novamente.")
      );
    } finally {
      setLoading(false);
    }
  };

  const creatorName = profile?.name || user?.email?.split("@")[0] || "Criador";
  const creatorHandle = profile?.handle || `@${creatorName.toLowerCase().replace(/\s+/g, "")}`;
  const creatorFollowers = profile?.followers ?? 0;
  const creatorEngagement = profile?.engagementRate ?? 0;
  const creatorAvatar = profile?.avatar || "";
  const initialLetter = (creatorName || "C").charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="card-editorial bg-white w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="pill-badge pill-lime text-[11px]">Pitch de Parceria</span>
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-1">Enviar Proposta</h3>
        <p className="text-xs text-stone-500 mb-4">
          Campanha: <strong className="text-stone-800">{campaign.title}</strong> ({campaign.brandName})
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Creator Mini Info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 mb-5">
          {creatorAvatar ? (
            <img
              src={creatorAvatar}
              alt={creatorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white font-bold text-sm flex items-center justify-center ring-2 ring-white">
              {initialLetter}
            </div>
          )}
          <div className="flex-1 text-xs">
            <span className="font-bold text-stone-900 block">{creatorName}</span>
            <span className="text-stone-500">
              {creatorHandle} • {creatorFollowers.toLocaleString("pt-BR")} seguidores
            </span>
          </div>
          <div className="text-right text-xs">
            <span className="font-bold text-stone-900 block">{creatorEngagement}%</span>
            <span className="text-stone-400 text-[10px]">Engajamento</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Valor da Proposta (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">
                R$
              </span>
              <input
                type="number"
                value={requestedBudget || campaign.budget}
                onChange={(e) => setRequestedBudget(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Orçamento sugerido pela marca: R${" "}
              {campaign.budget.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Mensagem de Apresentação / Pitch *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Explique como seu conteúdo e audiência conectam com o produto, formato das postagens e diferenciais criativos..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-outline text-xs px-4 py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-lime text-xs px-5 py-2 flex items-center gap-1.5"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {loading ? "Enviando..." : "Enviar Proposta Direta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
