"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { formatFriendlyError } from "@/services/authService";
import { Loader2, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, profile, role, loading: authLoading, updateProfile, showToast } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Influencer fields
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [followers, setFollowers] = useState("");
  const [engagementRate, setEngagementRate] = useState("");
  const [reach, setReach] = useState("");
  const [niche, setNiche] = useState("");
  const [bio, setBio] = useState("");

  // Brand fields
  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (profile) {
      if (profile.role === "INFLUENCER") {
        setName(profile.name || "");
        setAvatar(profile.avatar || "");
        setInstagram(profile.instagram || "");
        setTiktok(profile.tiktok || "");
        setFollowers(profile.followers ? profile.followers.toString() : "");
        setEngagementRate(profile.engagementRate ? profile.engagementRate.toString() : "");
        setReach(profile.reach ? profile.reach.toString() : "");
        setNiche(profile.niche || "");
        setBio(profile.bio || "");
      } else {
        setCompanyName(profile.companyName || "");
        setLogo(profile.logo || "");
        setIndustry(profile.industry || "");
      }
    }
  }, [authLoading, user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const dataToUpdate =
      role === "INFLUENCER"
        ? {
            name,
            avatar: avatar.trim(),
            instagram,
            tiktok,
            followers: followers ? parseInt(followers) : 0,
            engagementRate: engagementRate ? parseFloat(engagementRate) : 0,
            reach: reach ? parseInt(reach) : 0,
            niche,
            bio,
          }
        : { companyName, logo: logo.trim(), industry };

    try {
      await updateProfile(dataToUpdate);
      setSuccess(true);
      showToast("✅ Perfil atualizado com sucesso!");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      setError(
        formatFriendlyError(err, "Não foi possível salvar as alterações no perfil. Tente novamente.")
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-stone-900" />
          <p className="text-sm font-medium text-stone-600">Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <span className="pill-badge pill-lime text-[11px] mb-2">Dados da Conta</span>
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Meu Perfil</h1>
            <p className="text-xs text-stone-500 mt-1">
              {role === "INFLUENCER"
                ? "Configure seu mídia kit de influenciador"
                : "Configure os dados cadastrais da sua empresa"}
            </p>
          </div>

          <div className="card-editorial p-6 sm:p-8 bg-white border border-stone-200/90 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Perfil salvo com sucesso!</span>
                </div>
              )}

              {role === "INFLUENCER" ? (
                <>
                  {/* Avatar field with preview */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Foto de Perfil (URL da Imagem)
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="https://exemplo.com/sua-foto.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Nome de Exibição *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                      placeholder="Seu nome"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        TikTok
                      </label>
                      <input
                        type="text"
                        value={tiktok}
                        onChange={(e) => setTiktok(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="https://tiktok.com/@..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Seguidores
                      </label>
                      <input
                        type="number"
                        value={followers}
                        onChange={(e) => setFollowers(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="ex: 15000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Engajamento (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={engagementRate}
                        onChange={(e) => setEngagementRate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="ex: 4.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Alcance Médio
                      </label>
                      <input
                        type="number"
                        value={reach}
                        onChange={(e) => setReach(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="ex: 45000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Nicho Principal *
                    </label>
                    <input
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                      placeholder="Ex: Tech, Moda, Fitness"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Bio / Proposta Editorial *
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
                      placeholder="Fale sobre sua audiência, formatos e proposta de conteúdo..."
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Logo da Empresa (URL da Imagem)
                    </label>
                    <div className="flex items-center gap-3">
                      {logo ? (
                        <img
                          src={logo}
                          alt="Logo Preview"
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-stone-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center border border-dashed border-stone-300 shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <input
                        type="url"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="https://exemplo.com/logo.png"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Nome da Empresa / Marca *
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                      placeholder="Ex: NextGen Audio"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Segmento / Indústria *
                    </label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                      placeholder="Ex: Hardware, E-commerce, Beleza"
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full btn-dark py-3 text-xs font-bold flex items-center justify-center gap-2 mt-4"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                {saving ? "Salvando alterações..." : "Salvar Alterações"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
