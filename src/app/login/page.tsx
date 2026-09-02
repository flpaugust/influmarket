"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatAuthError, formatFriendlyError } from "@/services/authService";
import {
  UserCheck,
  Building2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha todos os campos para continuar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { profile } = await login(email, password);
      if (profile?.role === "BRAND") {
        router.push("/dashboard/marca");
      } else {
        router.push("/dashboard/creator");
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      const friendlyMessage = formatFriendlyError(
        err,
        "Falha ao entrar na conta. Verifique seu e-mail e senha."
      );
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAF9]">
      {/* Left Manifesto / Quote (Editorial Split) */}
      <div className="md:w-1/2 bg-stone-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

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
            Ambiente Seguro
          </span>
        </div>

        <div className="my-12 max-w-md">
          <span className="pill-badge pill-stone mb-4 bg-stone-800 text-stone-300 border-stone-700">
            Acesso à Plataforma
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Negociações diretas entre criadores e marcas.
          </h2>
          <p className="mt-4 text-stone-400 text-sm leading-relaxed">
            Acesse seu painel com segurança para gerenciar oportunidades,
            enviar propostas e acompanhar campanhas com métricas verificadas.
          </p>

          <div className="mt-8 pt-8 border-t border-stone-800/80 flex items-center gap-3 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" />
            <span>Autenticação segregada com controle de acesso granular.</span>
          </div>
        </div>

        <div className="text-xs text-stone-500">
          © {new Date().getFullYear()} InfluMarket Inc. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          <div>
            <span className="pill-badge pill-lime text-[11px] mb-2 inline-flex">
              Conexão Segura
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Entrar na sua conta
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Informe seu e-mail e senha cadastrados para acessar seu painel.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                E-mail corporativo ou de criador
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all shadow-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Senha
                </label>
              </div>
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
              className="w-full btn-dark py-3 text-xs font-bold flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {loading ? "Verificando credenciais..." : "Acessar Plataforma"}
            </button>
          </form>

          <div className="pt-6 border-t border-stone-200/80 text-center">
            <p className="text-xs text-stone-500">
              Ainda não tem uma conta?{" "}
              <Link
                href="/cadastro"
                className="font-bold text-stone-900 hover:underline inline-flex items-center gap-1"
              >
                Cadastre-se gratuitamente <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
