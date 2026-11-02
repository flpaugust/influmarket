import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getNicheBySlug,
  getCityBySlug,
  getCreatorsByNicheAndCity,
  getAllNicheCityPairs,
  CITIES_DATA,
  NICHES_DATA,
} from "@/services/seoData";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Star,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Building2,
  TrendingUp,
} from "lucide-react";

interface PageProps {
  params: Promise<{ nicho: string; cidade: string }>;
}

export const revalidate = 86400; // 24 hours

export function generateStaticParams() {
  return getAllNicheCityPairs();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { nicho, cidade } = await params;
  const niche = getNicheBySlug(nicho);
  const city = getCityBySlug(cidade);

  if (!niche || !city) {
    return {
      title: "Página não encontrada | InfluMarket",
      description: "Combinação de nicho e cidade não localizada.",
    };
  }

  const title = `Influenciadores de ${niche.name} em ${city.name} (${city.state}) | InfluMarket`;
  const description = `Conecte sua empresa aos melhores influenciadores de ${niche.name} em ${city.name} - ${city.state}. Criadores locais verificados, métricas auditadas e pagamentos sob custódia garantida.`;
  const canonicalUrl = `https://influmarket.com.br/${niche.slug}-em-${city.slug}`;

  return {
    title,
    description,
    keywords: [
      `influenciadores de ${niche.name.toLowerCase()} em ${city.name.toLowerCase()}`,
      `creators ${city.name.toLowerCase()} ${city.state.toLowerCase()}`,
      `marketing de influencia ${city.name.toLowerCase()}`,
      `micro influenciadores ${niche.name.toLowerCase()} ${city.name.toLowerCase()}`,
      ...niche.keywords,
    ],
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
          alt: `Influenciadores de ${niche.name} em ${city.name} - InfluMarket`,
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

export default async function NichoEmCidadePage({ params }: PageProps) {
  const { nicho, cidade } = await params;
  const niche = getNicheBySlug(nicho);
  const city = getCityBySlug(cidade);

  if (!niche || !city) {
    notFound();
  }

  const creators = getCreatorsByNicheAndCity(nicho, cidade);

  // Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Influenciadores de ${niche.name} em ${city.name} - ${city.state}`,
    description: `Rede de criadores de conteúdo do nicho de ${niche.name} sediados ou atuantes em ${city.name}.`,
    url: `https://influmarket.com.br/${niche.slug}-em-${city.slug}`,
    spatialCoverage: {
      "@type": "Place",
      name: `${city.name}, ${city.state}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: city.name,
        addressRegion: city.state,
        addressCountry: "BR",
      },
    },
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
          name: niche.name,
          item: `https://influmarket.com.br/influenciadores-de-${niche.slug}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${city.name} (${city.state})`,
          item: `https://influmarket.com.br/${niche.slug}-em-${city.slug}`,
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
            <Link
              href={`/influenciadores-de-${niche.slug}`}
              className="hover:text-stone-900 transition-colors"
            >
              {niche.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold">
              {city.name} ({city.state})
            </span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 text-white text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-lime-400" />
                  {city.name}, {city.state} • {city.region}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100/80 text-lime-900 border border-lime-200 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-lime-700" />
                  Nicho de {niche.name}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
                Influenciadores de {niche.name} em{" "}
                <span className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-600 bg-clip-text text-transparent">
                  {city.name} ({city.state})
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
                Conecte seu negócio local ou marca regional a nano e micro criadores
                de conteúdo que conhecem a cultura de <strong>{city.name}</strong> e possuem forte
                conexão com a audiência da região.
              </p>

              {/* City Market Highlight Card */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-lime-600" />
                    Panorama Regional: {city.name} ({city.population} hab.)
                  </span>
                  <span className="text-[11px] text-stone-400 font-normal">
                    Métricas auditadas InfluMarket
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {city.marketHighlights}
                </p>
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/hub?niche=${niche.slug}&cidade=${city.slug}`}
                  className="btn-lime py-3 px-6 text-xs font-bold flex items-center justify-center gap-2"
                >
                  Publicar Campanha em {city.name} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/cadastro?role=INFLUENCER"
                  className="btn-outline py-3 px-6 text-xs font-bold flex items-center justify-center gap-2"
                >
                  Sou Creator em {city.name}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Local Creators Showcase */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  Criadores em Destaque em {city.name}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Perfis verificados com dados de engajamento e métricas de alcance regional.
                </p>
              </div>
              <span className="pill-badge pill-stone text-xs font-semibold hidden sm:inline-flex">
                {creators.length} criadores disponíveis
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  className="card-editorial p-6 flex flex-col justify-between bg-white border border-stone-200/90 shadow-2xs hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Header */}
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
                                title="Creator Verificado"
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

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                      {creator.bio}
                    </p>

                    {/* Metrics Bar */}
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
                          Alcance
                        </span>
                        <span className="text-xs font-bold text-stone-900">
                          {Math.round(creator.reach / 1000)}k
                        </span>
                      </div>
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
                      href={`/cadastro?role=BRAND&ref=creator-${creator.id}&city=${city.slug}`}
                      className="btn-lime text-xs py-2 px-3.5 font-bold flex items-center gap-1"
                    >
                      Propor Parceria <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits of Local Influencers in this city */}
        <section className="py-12 bg-white border-y border-stone-200/80 my-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
              <span className="pill-badge pill-stone text-xs font-bold">
                Estratégia Geodirecionada
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Vantagens de Contratar Creators de {city.name}
              </h2>
              <p className="text-sm text-stone-500">
                Mais proximidade física, identificação regional e alto poder de mobilização nos bairros da cidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <MapPin className="w-5 h-5 text-lime-600 mb-2" />
                <h3 className="font-bold text-stone-900 text-sm">
                  Presença Física e Visitas ao Ponto de Venda
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Criadores sediados em {city.name} podem visitar sua loja física, restaurante ou evento, produzindo stories e reels com experiência real.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <TrendingUp className="w-5 h-5 text-stone-900 mb-2" />
                <h3 className="font-bold text-stone-900 text-sm">
                  Reconhecimento de Marca Local
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Audiência altamente concentrada na Grande {city.name}, maximizando o retorno de cada real investido sem dispersão para outras regiões.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                <h3 className="font-bold text-stone-900 text-sm">
                  Pagamento Garantido via Custódia
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Contratações 100% protegidas: o cachê só é liberado após a comprovação da entrega dos vídeos e postagens combinadas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-linking: Other Cities for this niche */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
              Outras Capitais com Criadores de {niche.name}:
            </h3>
            <div className="flex flex-wrap gap-2">
              {CITIES_DATA.filter((c) => c.slug !== city.slug).map((otherCity) => (
                <Link
                  key={otherCity.slug}
                  href={`/${niche.slug}-em-${otherCity.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-xs font-semibold text-stone-700 transition-colors"
                >
                  📍 {otherCity.name} ({otherCity.state})
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Cross-linking: Other Niches in this city */}
        <section className="py-8 bg-stone-50 border-t border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
              Outros Nichos em {city.name}:
            </h3>
            <div className="flex flex-wrap gap-2">
              {NICHES_DATA.filter((n) => n.slug !== niche.slug).map((otherNiche) => (
                <Link
                  key={otherNiche.slug}
                  href={`/${otherNiche.slug}-em-${city.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-stone-900 text-xs font-semibold text-stone-700 transition-colors"
                >
                  {otherNiche.name} em {city.name}
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
