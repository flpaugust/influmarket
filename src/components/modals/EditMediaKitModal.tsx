"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, User, Sparkles, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatFriendlyError } from "@/services/authService";

interface EditMediaKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export default function EditMediaKitModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: EditMediaKitModalProps) {
  const { profile, updateProfile } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [handle, setHandle] = useState(profile?.handle || "");
  const [avatar, setAvatar] = useState(profile?.avatar || "");
  const [niche, setNiche] = useState(profile?.niche || "Tech");
  const [followers, setFollowers] = useState(
    profile?.followers ? profile.followers.toString() : ""
  );
  const [engagementRate, setEngagementRate] = useState(
    profile?.engagementRate ? profile.engagementRate.toString() : ""
  );
  const [reach, setReach] = useState(
    profile?.reach ? profile.reach.toString() : ""
  );
  const [bio, setBio] = useState(profile?.bio || "");
  const [instagram, setInstagram] = useState(profile?.instagram || "");
  const [tiktok, setTiktok] = useState(profile?.tiktok || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setHandle(profile.handle || "");
      setAvatar(profile.avatar || "");
      setNiche(profile.niche || "Tech");
      setFollowers(profile.followers ? profile.followers.toString() : "");
      setEngagementRate(
        profile.engagementRate ? profile.engagementRate.toString() : ""
      );
      setReach(profile.reach ? profile.reach.toString() : "");
      setBio(profile.bio || "");
      setInstagram(profile.instagram || "");
      setTiktok(profile.tiktok || "");
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateProfile({
        name,
        handle,
        avatar: avatar.trim(),
        niche,
        followers: followers ? parseInt(followers) : 0,
        engagementRate: engagementRate ? parseFloat(engagementRate) : 0,
        reach: reach ? parseInt(reach) : 0,
        bio,
        instagram,
        tiktok,
      });

      onClose();
      if (onProfileUpdated) onProfileUpdated();
    } catch (err: any) {
      console.error("Erro ao atualizar mídia kit:", err);
      setError(
        formatFriendlyError(err, "Não foi possível salvar as alterações no perfil. Tente novamente.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="card-editorial bg-white w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="pill-badge pill-stone text-[11px]">Perfil & Estatísticas</span>
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-1">Editar Mídia Kit</h3>
        <p className="text-xs text-stone-500 mb-6">
          Preencha seus números e dados de contato para atrair marcas e fechar parcerias.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar input & preview */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Foto de Perfil / Avatar (URL da Imagem)
            </label>
            <div className="flex items-center gap-3">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar Preview"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-stone-200 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center border border-dashed border-stone-300 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://exemplo.com/sua-foto.jpg"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Cole o link direto da sua foto de perfil ou deixe em branco para usar as iniciais.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Nome de Exibição
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                @ Handle Principal
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@seuuser"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Seguidores
              </label>
              <input
                type="number"
                value={followers}
                placeholder="ex: 15000"
                onChange={(e) => setFollowers(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Engajamento (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={engagementRate}
                placeholder="ex: 4.5"
                onChange={(e) => setEngagementRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Alcance Médio
              </label>
              <input
                type="number"
                value={reach}
                placeholder="ex: 45000"
                onChange={(e) => setReach(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Nicho Principal
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="ex: Tech, Moda, Fitness"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Mini Bio / Proposta Editorial
            </label>
            <textarea
              rows={3}
              value={bio}
              placeholder="Descreva seu conteúdo e público-alvo..."
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Instagram URL
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                TikTok URL
              </label>
              <input
                type="text"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="https://tiktok.com/@..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
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
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
