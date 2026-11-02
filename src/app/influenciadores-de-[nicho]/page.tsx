import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoiCalculator from "@/components/lead-magnets/RoiCalculator";
import {
  getAllNicheSlugs,
  getNicheBySlug,
  getCreatorsByNiche,
  NICHES_DATA,
  CITIES_DATA,
} from "@/services/seoData";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Star,
  ArrowRight,
  ChevronRight,
  Filter,
} from "lucide-react";

interface PageProps {
  params: Promise<{ nicho: string }>;
  searchParams?: Promise<{ plataforma?: string }>;
}

export const revalidate = 86400; // 24 hours

export function generateStaticParams() {
  return getAllNicheSlugs().map((slug) => ({
    nicho: slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { nicho } = await params;
  const niche = getNicheBySlug(nicho);

  if (!niche) {
    return {
      title: "Nicho não encontrado | InfluMarket",
      description: "Nicho de influenciadores não localizado.",
    };
  }

  const title = `Melhores Influenciadores de ${niche.name} do Brasil (2026) | InfluMarket`;
  const description = `Contrate os melhores criadores de conteúdo e micro influenciadores de ${niche.name} no Brasil. Métricas auditadas de engajamento, mídia kit dinâmico e pagamentos sob custódia garantida.`;
  const canonicalUrl = `https://influmarket.com.br/influenciadores-de-${niche.slug}`;

  return {
    title,
    description,
    keywords: niche.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "InfluMarket",
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: "https://influmarket.com.br/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Influenciadores de ${niche.name} - InfluMarket`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function InfluenciadoresNichoPage({
  params,
  searchParams,
}: PageProps) {
  const { nicho } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const activePlatform = (resolvedSearchParams.plataforma || "todos").toLowerCase();

  const niche = getNicheBySlug(nicho);
  if (!niche) {
    notFound();
  }

  const allCreators = getCreatorsByNiche(nicho);

  // Filter creators by platform if requested
  const creators = allCreators.filter((creator) => {
    if (activePlatform === "instagram") return Boolean(creator.platforms.instagram);
    if (activePlatform === "tiktok") return Boolean(creator.platforms.tiktok);
    if (activePlatform === "youtube") return Boolean(creator.platforms.youtube);
    return true;
  });

  // Schema.org JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Melhores Influenciadores de ${niche.name} do Brasil`,
    description: niche.description,
    url: `https://influmarket.com.br/influenciadores-de-${niche.slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Início",
          item: "https://influmarket.com.br",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Influenciadores",
          item: "https://influmarket.com.br/#creators",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: niche.name,
          item: `https://influmarket.com.br/influenciadores-de-${niche.slug}`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: creators.length,
      itemListElement: creators.map((creator, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Person",
          name: creator.name,
          alternateName: creator.handle,
          description: creator.bio,
          image: creator.avatar,
          jobTitle: `Influenciador de ${creator.niche}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: creator.cityName,
            addressRegion: creator.state,
            addressCountry: "BR",
          },
        },
      })),
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-stone-500 font-medium"
          >
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Início
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link href="/#creators" className="hover:text-stone-900 transition-colors">
              Diretório
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold">{niche.name}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-100/70 border border-lime-200 text-xs font-bold text-lime-900">
                <Sparkles className="w-3.5 h-3.5 text-lime-700" />
                Diretório de Criadores Verificados • Nicho de {niche.name}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
                Melhores Influenciadores de{" "}
                <span className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-600 bg-clip-text text-transparent">
                  {niche.name}
                </span>{" "}
                do Brasil
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
                {niche.description}
              </p>

              {/* Benchmarks strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-stone-400 block mb-0.5">
                    Engajamento Médio
                  </span>
                  <span className="text-xl font-extrabold text-stone-900">
                    {niche.benchmarks.avgEngagement}%
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                    acima do benchmark geral
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-stone-400 block mb-0.5">
                    CPM Estimado
                  </span>
                  <span className="text-xl font-extrabold text-stone-900">
                    R$ {niche.benchmarks.avgCpm.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    por 1.000 impressões
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-stone-400 block mb-0.5">
                    CTR Médio
                  </span>
                  <span className="text-xl font-extrabold text-stone-900">
                    {niche.benchmarks.avgCtr}%
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    taxa de clique em stories
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-stone-400 block mb-0.5">
                    Ticket Médio
                  </span>
                  <span className="text-xl font-extrabold text-stone-900">
                    R$ {niche.benchmarks.avgTicket}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    por entrega individual
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Directory & Filters Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-stone-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Filtrar por Rede Social:
                </span>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
                <Link
                  href={`/influenciadores-de-${niche.slug}`}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activePlatform === "todos"
                      ? "bg-white text-stone-900 shadow-2xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Todas ({allCreators.length})
                </Link>
                <Link
                  href={`/influenciadores-de-${niche.slug}?plataforma=instagram`}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activePlatform === "instagram"
                      ? "bg-white text-stone-900 shadow-2xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Instagram
                </Link>
                <Link
                  href={`/influenciadores-de-${niche.slug}?plataforma=tiktok`}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activePlatform === "tiktok"
                      ? "bg-white text-stone-900 shadow-2xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  TikTok
                </Link>
                <Link
                  href={`/influenciadores-de-${niche.slug}?plataforma=youtube`}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activePlatform === "youtube"
                      ? "bg-white text-stone-900 shadow-2xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  YouTube
                </Link>
              </div>
            </div>

            {/* Creator Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  className="card-editorial p-6 flex flex-col justify-between bg-white border border-stone-200/90 shadow-2xs hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Top creator head */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={creator.avatar}
                          alt={creator.name}
                          width={52}
                          height={52}
                          unoptimized
                          className="w-13 h-13 rounded-full object-cover ring-2 ring-stone-100 shadow-2xs"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-stone-900 text-sm leading-tight">
                              {creator.name}
                            </h3>
                            {creator.verified && (
                              <span
                                title="Creator Verificado via API Oficial"
                                className="inline-flex text-lime-600"
                              >
                                <CheckCircle2 className="w-4 h-4 fill-lime-100" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 font-medium">
                            {creator.handle}
                          </p>
                          <span className="text-[11px] text-stone-400">
                            📍 {creator.cityName}, {creator.state}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-stone-800 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{creator.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                      {creator.bio}
                    </p>

                    {/* Performance metrics */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 mb-4">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-medium">
                          Seguidores
                        </span>
                        <span className="text-xs font-bold text-stone-900">
                          {creator.followers.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-medium">
                          Engajamento
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          {creator.engagementRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-medium">
                          Alcance Médio
                        </span>
                        <span className="text-xs font-bold text-stone-900">
                          {Math.round(creator.reach / 1000)}k
                        </span>
                      </div>
                    </div>

                    {/* Platforms pills */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {creator.platforms.instagram && (
                        <span className="pill-badge pill-stone text-[10px]">
                          Instagram: {Math.round(creator.platforms.instagram.followers / 1000)}k
                        </span>
                      )}
                      {creator.platforms.tiktok && (
                        <span className="pill-badge pill-stone text-[10px]">
                          TikTok: {Math.round(creator.platforms.tiktok.followers / 1000)}k
                        </span>
                      )}
                      {creator.platforms.youtube && (
                        <span className="pill-badge pill-stone text-[10px]">
                          YouTube: {Math.round(creator.platforms.youtube.subscribers / 1000)}k
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card bottom: pricing and CTA */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block">A partir de</span>
                      <span className="text-xs font-bold text-stone-900">
                        R$ {creator.pricing.story.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <Link
                      href={`/cadastro?role=BRAND&ref=creator-${creator.id}`}
                      className="btn-lime text-xs py-2 px-3.5 font-bold flex items-center gap-1 group-hover:scale-102 transition-transform"
                    >
                      Propor Campanha <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Magnet Integration: Interactive ROI Calculator */}
        <section className="py-12 bg-stone-100/60 border-y border-stone-200/80 my-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RoiCalculator
              initialNicheSlug={niche.slug}
              initialBudget={2500}
              className="border-none shadow-md"
            />
          </div>
        </section>

        {/* Explanatory SEO Content Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <div className="space-y-4">
                <span className="pill-badge pill-lime text-xs font-bold">
                  Guia Estratégico 2026
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  Por que contratar nano e micro influenciadores de {niche.name}?
                </h2>
                <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
                  <p>
                    O marketing de influência no nicho de <strong>{niche.name}</strong> passou
                    por uma transformação profunda no Brasil. Consumidores contemporâneos não
                    respondem mais a propagandas genéricas de celebridades distantes. Eles buscam
                    recomendações autênticas de criadores especializados que vivem o tema diariamente.
                  </p>
                  <p>
                    Na <strong>InfluMarket</strong>, todos os dados de seguidores, retenção e taxas de
                    clique são auditados diretamente com as APIs das redes. Além disso, nosso sistema
                    de <strong>custódia financeira (escrow)</strong> garante que seu investimento fique
                    100% seguro em conta caução até que o criador publique o conteúdo acordado.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/hub"
                    className="btn-dark text-xs py-3 px-5 flex items-center justify-center gap-2"
                  >
                    Publicar Campanha em {niche.name} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/cadastro?role=INFLUENCER"
                    className="btn-outline text-xs py-3 px-5 flex items-center justify-center gap-2"
                  >
                    Sou Creator de {niche.name}
                  </Link>
                </div>
              </div>

              {/* Trust & Guarantee Box */}
              <div className="card-editorial p-6 sm:p-8 bg-stone-900 text-white space-y-4">
                <div className="flex items-center gap-2 text-lime-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> Custódia Financeira Protegida
                </div>
                <h3 className="text-xl font-bold text-white">
                  Como funciona a contratação segura na InfluMarket:
                </h3>
                <ol className="space-y-3 text-xs sm:text-sm text-stone-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-lime-400 text-stone-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      <strong>Briefing Estruturado:</strong> Você define o objetivo, produtos e prazos com assistência da nossa IA.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-lime-400 text-stone-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      <strong>Depósito em Caução:</strong> O valor do cachê fica retido em conta de custódia segura, sem transferências diretas por PIX sem garantia.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-lime-400 text-stone-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      <strong>Validação & Liberação:</strong> Após a postagem comprovada com métricas de alcance, o pagamento é liberado ao criador.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-linking: Cities for this niche */}
        <section className="py-8 bg-stone-50 border-t border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Criadores de {niche.name} nas Principais Capitais:
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {CITIES_DATA.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${niche.slug}-em-${city.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:border-stone-900 hover:text-stone-950 transition-colors"
                >
                  📍 {city.name} ({city.state})
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Cross-linking: Other niches */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Explore Outros Nichos de Influência:
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {NICHES_DATA.filter((n) => n.slug !== niche.slug).map((otherNiche) => (
                <Link
                  key={otherNiche.slug}
                  href={`/influenciadores-de-${otherNiche.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-xs font-semibold text-stone-700 transition-colors"
                >
                  {otherNiche.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
