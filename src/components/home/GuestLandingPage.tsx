"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BentoGrid from "@/components/BentoGrid";
import { getOpenCampaigns } from "@/services/campaignService";
import { Campaign } from "@/types";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Users,
  Zap,
  Building2,
  DollarSign,
  Loader2,
} from "lucide-react";

export default function GuestLandingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublicCampaigns() {
      try {
        const data = await getOpenCampaigns();
        setCampaigns(data.slice(0, 3));
      } catch (err) {
        console.error("Erro ao carregar campanhas públicas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPublicCampaigns();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200/80 shadow-xs text-xs font-semibold text-stone-700">
                <Sparkles className="w-3.5 h-3.5 text-lime-600" />
                +1.200 creators ativos na plataforma
              </div>

              {/* Editorial Title */}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.1]">
                Conecte marcas a criadores com{" "}
                <span className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-600 bg-clip-text text-transparent">
                  dados reais e garantia de entrega.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
                Uma plataforma completa para pequenas e médias empresas contratarem
                nano e micro influenciadores com métricas verificadas, briefings estruturados
                e pagamentos sob custódia segura.
              </p>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/cadastro"
                  className="w-full sm:w-auto btn-lime py-3 px-6 text-xs font-bold text-stone-950 flex items-center justify-center gap-2"
                >
                  Criar Conta Gratuita <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto btn-outline text-xs py-3 px-6 flex items-center justify-center gap-2"
                >
                  Entrar na Conta
                </Link>
              </div>

              {/* Micro proof bar */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sem mensalidades fixas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-stone-900" />
                  <span>Métricas em tempo real</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-lime-600" />
                  <span>Match direto marca-creator</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Showcase Section */}
        <BentoGrid />

        {/* Open Opportunities Section */}
        <section className="py-16 bg-white border-y border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100/60 border border-lime-200 text-xs font-semibold text-lime-900 mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  Oportunidades em Aberto
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  Campanhas ativas aguardando propostas
                </h2>
                <p className="text-stone-500 text-sm mt-1">
                  Valores em custódia segura e briefings claros cadastrados na plataforma.
                </p>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-900 hover:text-stone-600 transition-colors"
              >
                Fazer login para enviar proposta <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-stone-900" />
                <p className="text-xs text-stone-500">Buscando campanhas disponíveis...</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="p-10 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center max-w-lg mx-auto">
                <Building2 className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-stone-800 mb-1">
                  Mural pronto para novas campanhas
                </h4>
                <p className="text-xs text-stone-500 mb-4">
                  Cadastre sua empresa e publique a primeira oportunidade para começar a receber propostas de criadores.
                </p>
                <Link href="/cadastro" className="btn-dark text-xs py-2 px-4 inline-flex items-center gap-1.5">
                  Cadastrar Empresa <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="card-editorial p-6 flex flex-col justify-between bg-white border border-stone-200/90 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2.5">
                          {camp.brandLogo ? (
                            <img
                              src={camp.brandLogo}
                              alt={camp.brandName}
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-stone-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                              {camp.brandName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs font-bold text-stone-800">
                            {camp.brandName}
                          </span>
                        </div>
                        <span className="pill-badge pill-lime text-[11px] font-bold">
                          R${" "}
                          {Number(camp.budget).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900 mb-2 leading-snug">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed mb-4">
                        {camp.description}
                      </p>

                      {camp.deliverables && camp.deliverables.length > 0 && (
                        <div className="space-y-1.5 mb-4">
                          {camp.deliverables.slice(0, 2).map((del, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs text-stone-600"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                              <span className="line-clamp-1">{del}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-400">
                        {camp.deadline || "Em aberto"}
                      </span>
                      <Link
                        href="/login"
                        className="btn-dark text-xs py-2 px-3.5"
                      >
                        Enviar Proposta
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-editorial p-8 sm:p-14 bg-stone-900 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/15 rounded-full blur-3xl pointer-events-none" />

              <span className="pill-badge bg-stone-800 text-lime-400 border border-stone-700 text-xs mb-4">
                Comece em 2 minutos
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-xl mx-auto leading-tight">
                Pronto para profissionalizar suas parcerias de conteúdo?
              </h2>
              <p className="mt-4 text-stone-400 text-sm sm:text-base max-w-lg mx-auto">
                Cadastre-se gratuitamente, crie seu mídia kit ou publique uma campanha para ter acesso aos melhores nano e micro creators do Brasil.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/cadastro"
                  className="w-full sm:w-auto btn-lime py-3 px-6 text-xs font-bold text-stone-950"
                >
                  Criar Conta Gratuita <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto btn-outline bg-transparent text-white border-stone-700 hover:bg-stone-800 hover:text-white text-xs py-3 px-6"
                >
                  Já tenho conta
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
