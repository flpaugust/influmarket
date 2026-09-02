"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { formatAuthError, formatFriendlyError } from "@/services/authService";
import {
  UserCheck,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Shield,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>("INFLUENCER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handleOrCompany, setHandleOrCompany] = useState("");
  const [nicheOrIndustry, setNicheOrIndustry] = useState("Tech");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const initialData =
        role === "INFLUENCER"
          ? {
              name,
              handle: handleOrCompany.startsWith("@")
                ? handleOrCompany
                : `@${(handleOrCompany || name).toLowerCase().replace(/\s+/g, "")}`,
              niche: nicheOrIndustry,
              followers: 0,
              bio: `Criador de conteúdo focado em ${nicheOrIndustry}.`,
            }
          : {
              companyName: handleOrCompany || name,
              industry: nicheOrIndustry,
            };

      await register(email, password, role, initialData);

      if (role === "BRAND") {
        router.push("/dashboard/marca");
      } else {
        router.push("/dashboard/creator");
      }
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      const friendlyMessage = formatFriendlyError(
        err,
        "Falha ao criar conta. Verifique os dados preenchidos e tente novamente."
      );
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAF9]">
      {/* Left Manifesto / Benefits (Editorial Split) */}
      <div className="md:w-1/2 bg-stone-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-stone-900 flex items-center justify-center font-bold text-sm">
                IM
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                InfluMarket
              </span>
            </Link>

            <span className="pill-badge bg-stone-800 text-lime-400 border border-stone-700 text-xs">
              Cadastro Gratuito
            </span>
          </div>

          <div className="mt-12 max-w-md">
            <span className="pill-badge mb-4 bg-stone-800 text-stone-300 border border-stone-700 text-xs">
              {role === "INFLUENCER" ? "Para Criadores" : "Para Empresas"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {role === "INFLUENCER"
                ? "Monetize sua audiência com marcas que respeitam sua identidade."
                : "Conecte sua marca aos melhores nano e micro criadores do Brasil."}
            </h2>
            <p className="mt-4 text-stone-400 text-sm leading-relaxed">
              Crie seu cadastro em menos de 2 minutos e comece a fechar parcerias reais com pagamento em custódia segura.
            </p>
          </div>
        </div>

        {/* Benefits list */}
        <div className="my-8 space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-stone-300">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <span>Mídia Kit ao vivo integrado com métricas reais</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-stone-300">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <span>Contratos claros e liberação de valores sem burocracia</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-stone-300">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <span>Zero taxas para criar conta e visualizar oportunidades</span>
          </div>
        </div>

        <div className="text-xs text-stone-500">
          © {new Date().getFullYear()} InfluMarket Inc. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          <div>
            <span className="pill-badge pill-lime text-[11px] mb-2 inline-flex">
              Onboarding Instantâneo
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Criar nova conta
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Escolha seu papel para customizar sua experiência na plataforma.
            </p>
          </div>

          {/* Role selector pill */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-stone-200/70 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole("INFLUENCER")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                role === "INFLUENCER"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <UserCheck className="w-4 h-4" /> Sou Criador
            </button>
            <button
              type="button"
              onClick={() => setRole("BRAND")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                role === "BRAND"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Building2 className="w-4 h-4" /> Sou Marca / Empresa
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {role === "INFLUENCER" ? "Nome Completo *" : "Nome do Responsável *"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "INFLUENCER" ? "Laura Alcântara" : "Mariana Silva"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {role === "INFLUENCER" ? "@ do Instagram ou TikTok *" : "Nome da Empresa / Marca *"}
              </label>
              <input
                type="text"
                required
                value={handleOrCompany}
                onChange={(e) => setHandleOrCompany(e.target.value)}
                placeholder={role === "INFLUENCER" ? "@laura.tech" : "NextGen Audio Ltda"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  {role === "INFLUENCER" ? "Nicho de Conteúdo" : "Segmento de Atuação"}
                </label>
                <select
                  value={nicheOrIndustry}
                  onChange={(e) => setNicheOrIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all shadow-xs"
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
                  E-mail de Acesso *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Senha (mínimo 6 caracteres) *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-lime py-3 text-xs font-bold text-stone-950 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {loading ? "Criando sua conta..." : "Finalizar Cadastro Gratuito"}
            </button>
          </form>

          <div className="pt-6 border-t border-stone-200/80 text-center">
            <p className="text-xs text-stone-500">
              Já possui uma conta ativa?{" "}
              <Link
                href="/login"
                className="font-bold text-stone-900 hover:underline inline-flex items-center gap-1"
              >
                Faça login <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
