import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center font-bold text-white text-sm transition-transform group-hover:scale-105">
                IM
              </div>
              <span className="text-lg font-bold tracking-tight text-stone-900">
                InfluMarket
              </span>
              <span className="pill-badge pill-lime text-[10px]">v2.0 Beta</span>
            </Link>
            <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
              Infraestrutura editorial de matchmaking direto entre nano/micro criadores de conteúdo e marcas contemporâneas. Sem intermediários, com agilidade e métricas transparentes.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistemas operacionais e transações ativas</span>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
              Plataforma
            </h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link href="/dashboard/creator" className="hover:text-stone-950 transition-colors flex items-center gap-1">
                  Mural de Oportunidades
                </Link>
              </li>
              <li>
                <Link href="/dashboard/marca" className="hover:text-stone-950 transition-colors flex items-center gap-1">
                  Publicar Campanha
                </Link>
              </li>
              <li>
                <Link href="/#showcase" className="hover:text-stone-950 transition-colors">
                  Bento Showcase
                </Link>
              </li>
              <li>
                <Link href="/#creators" className="hover:text-stone-950 transition-colors">
                  Mural de Creators
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
              Ecossistema
            </h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <span className="text-stone-400 cursor-not-allowed">Mídia Kit Dinâmico</span>
              </li>
              <li>
                <span className="text-stone-400 cursor-not-allowed">Contratos Seguros</span>
              </li>
              <li>
                <span className="text-stone-400 cursor-not-allowed">Termos & Privacidade</span>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-stone-950 transition-colors inline-flex items-center gap-1"
                >
                  Documentação API <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} InfluMarket Inc. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Design Editorial & Creator Economy</span>
            <span>•</span>
            <span className="text-stone-600 font-medium">Built for Speed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
