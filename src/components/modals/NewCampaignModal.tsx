"use client";

import { useState } from "react";
import { X, DollarSign, Plus, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createCampaign } from "@/services/campaignService";
import { formatFriendlyError } from "@/services/authService";

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated?: () => void;
}

export default function NewCampaignModal({
  isOpen,
  onClose,
  onCampaignCreated,
}: NewCampaignModalProps) {
  const { user, profile, showToast } = useAuth();
  const [title, setTitle] = useState("");
  const [niche, setNiche] = useState("Tech");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [deliverablesInput, setDeliverablesInput] = useState("1 Reel de 60s, 3 Stories com link");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !budget || !description) {
      setError("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    if (!user) {
      setError("Você precisa estar autenticado como marca para criar uma campanha.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deliverablesArray = deliverablesInput
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

      await createCampaign({
        brandId: user.uid,
        brandName: profile?.companyName || "Marca Parceira",
        brandLogo: profile?.logo,
        brandIndustry: profile?.industry || "E-commerce",
        title,
        description,
        deliverables: deliverablesArray,
        budget: parseFloat(budget),
        niche,
      });

      showToast("✨ Campanha publicada com sucesso no mural!");
      setTitle("");
      setBudget("");
      setDescription("");
      onClose();
      if (onCampaignCreated) onCampaignCreated();
    } catch (err: any) {
      console.error("Erro ao criar campanha:", err);
      setError(
        formatFriendlyError(err, "Não foi possível publicar a campanha no momento. Tente novamente.")
      );
    } finally {
      setLoading(false);
    }
  };

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
          <span className="pill-badge pill-lime text-[11px]">Nova Oportunidade</span>
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-1">Publicar Campanha</h3>
        <p className="text-xs text-stone-500 mb-6">
          Defina os entregáveis e orçamento para que criadores qualificados enviem propostas.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Título da Campanha *
            </label>
            <input
              type="text"
              placeholder="ex: Lançamento de Linha Vegana de Skincare"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Nicho / Categoria *
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
              >
                <option value="Tech">Tech & Gadgets</option>
                <option value="Moda">Moda & Beleza</option>
                <option value="Fitness">Fitness & Saúde</option>
                <option value="Gastronomia">Gastronomia</option>
                <option value="Games">Games & Lifestyle</option>
                <option value="Educação">Educação & Negócios</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Orçamento (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">
                  R$
                </span>
                <input
                  type="number"
                  placeholder="1500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Entregáveis Esperados (separados por vírgula)
            </label>
            <input
              type="text"
              placeholder="1 Reel de 60s, 3 Stories com link"
              value={deliverablesInput}
              onChange={(e) => setDeliverablesInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Descrição & Briefing do Projeto *
            </label>
            <textarea
              rows={3}
              placeholder="Explique o objetivo da campanha, mensagens chave e requisitos para os criadores..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              className="btn-dark text-xs px-5 py-2 flex items-center gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Salvando..." : "Publicar no Mural"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
