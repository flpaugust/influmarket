import type { AllowedNiche } from "@/lib/validation";

export interface NicheSEOInfo {
  name: AllowedNiche;
  slug: string;
  tagline: string;
  description: string;
  keywords: string[];
  benchmarks: {
    avgEngagement: number; // in %
    avgCpm: number; // in BRL
    avgCtr: number; // in %
    conversionRate: number; // in %
    avgTicket: number; // in BRL
  };
}

export interface CitySEOInfo {
  name: string;
  state: string;
  region: string;
  slug: string;
  population: string;
  marketHighlights: string;
}

export interface CreatorProfileSEO {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  niche: AllowedNiche;
  nicheSlug: string;
  citySlug: string;
  cityName: string;
  state: string;
  followers: number;
  engagementRate: number;
  reach: number;
  bio: string;
  rating: number;
  completedDeals: number;
  verified: boolean;
  platforms: {
    instagram?: { handle: string; followers: number };
    tiktok?: { handle: string; followers: number };
    youtube?: { handle: string; subscribers: number };
  };
  pricing: {
    story: number;
    reel: number;
    packageDeal: number;
  };
}

export interface RoiCalculationResult {
  budget: number;
  niche: string;
  projectedImpressions: number;
  estimatedClicks: number;
  projectedConversions: number;
  projectedRevenue: number;
  roiPercentage: number;
  cpm: number;
  cpc: number;
  benchmarkCtr: number;
  benchmarkConversionRate: number;
}

// ── Canonical Niche Mapping ──────────────────────────────────────────────────

export const NICHE_SLUG_MAP: Record<AllowedNiche, string> = {
  Tecnologia: "tecnologia",
  Moda: "moda",
  Gastronomia: "gastronomia",
  Fitness: "fitness",
  Beleza: "beleza",
  Games: "games",
  Educação: "educacao",
  Saúde: "saude",
  Viagem: "viagem",
  Lifestyle: "lifestyle",
  Pet: "pet",
  Automotivo: "automotivo",
  Financeiro: "financeiro",
  Entretenimento: "entretenimento",
  Esportes: "esportes",
};

export const SLUG_TO_NICHE_MAP: Record<string, AllowedNiche> = Object.entries(
  NICHE_SLUG_MAP
).reduce(
  (acc, [niche, slug]) => {
    acc[slug] = niche as AllowedNiche;
    return acc;
  },
  {} as Record<string, AllowedNiche>
);

export const NICHES_DATA: NicheSEOInfo[] = [
  {
    name: "Tecnologia",
    slug: "tecnologia",
    tagline: "Inovação, SaaS, Inteligência Artificial, Gadgets e Hardware",
    description:
      "Encontre os melhores nano e micro influenciadores de Tecnologia do Brasil. Criadores técnicos e formadores de opinião com comunidades atentas em reviews de produtos, inteligência artificial, engenharia e produtividade digital.",
    keywords: [
      "influenciadores de tecnologia",
      "creators de tech brasil",
      "micro influenciador de tecnologia",
      "marketing de influencia saas",
      "reviews tech reels tiktok",
    ],
    benchmarks: {
      avgEngagement: 4.6,
      avgCpm: 26.0,
      avgCtr: 2.1,
      conversionRate: 2.4,
      avgTicket: 220,
    },
  },
  {
    name: "Moda",
    slug: "moda",
    tagline: "Streetwear, Alta Costura, Moda Sustentável e Estilo Pessoal",
    description:
      "Descubra criadores de conteúdo de Moda com alta taxa de conversão e estética refinada. Perfeitos para provadores virtuais, campanhas de lookbook e lançamentos de coleções sazonais.",
    keywords: [
      "influenciadores de moda brasil",
      "nano creators moda e estilo",
      "provador virtual reels instagram",
      "moda sustentável creators",
    ],
    benchmarks: {
      avgEngagement: 5.2,
      avgCpm: 19.5,
      avgCtr: 2.9,
      conversionRate: 3.1,
      avgTicket: 165,
    },
  },
  {
    name: "Gastronomia",
    slug: "gastronomia",
    tagline: "Culinária Autoral, Crítica Gastronômica, Drinks e Cozinha Afetiva",
    description:
      "Conecte sua marca a criadores de Gastronomia apaixonados por comida de verdade. Atraia clientes para restaurantes, marcas de alimentos, bebidas artesanais e utensílios culinários.",
    keywords: [
      "influenciadores de gastronomia",
      "creators comida e receitas brasil",
      "criticos gastronomicos instagram",
      "foodies brasil nano influenciadores",
    ],
    benchmarks: {
      avgEngagement: 6.1,
      avgCpm: 17.0,
      avgCtr: 3.4,
      conversionRate: 3.5,
      avgTicket: 110,
    },
  },
  {
    name: "Fitness",
    slug: "fitness",
    tagline: "Treino Funcional, Musculação, Nutrição Esportiva e Longevidade",
    description:
      "Influenciadores do nicho Fitness com seguidores altamente engajados em metas de treino, suplementação e estilo de vida saudável. Excelente retenção e autoridade de recomendação.",
    keywords: [
      "influenciadores fitness brasil",
      "creators suplementos e treino",
      "micro influenciadores academia crossfit",
      "nutrição esportiva instagram",
    ],
    benchmarks: {
      avgEngagement: 5.8,
      avgCpm: 21.0,
      avgCtr: 2.8,
      conversionRate: 3.0,
      avgTicket: 180,
    },
  },
  {
    name: "Beleza",
    slug: "beleza",
    tagline: "Skincare, Maquiagem, Cuidados Capilares e Dermocosméticos",
    description:
      "Criadores de Beleza com demonstrações em alta definição, resenhas sinceras de cosméticos e tutoriais passo a passo. Líderes em vendas e fidelização de marca.",
    keywords: [
      "influenciadores de beleza",
      "skincare creators brasil",
      "resenhas de maquiagem reels",
      "dermocosmeticos micro influenciadores",
    ],
    benchmarks: {
      avgEngagement: 5.9,
      avgCpm: 20.0,
      avgCtr: 3.2,
      conversionRate: 3.6,
      avgTicket: 140,
    },
  },
  {
    name: "Games",
    slug: "games",
    tagline: "eSports, Streamers, Reviews de Jogos, PC Gamer e Consoles",
    description:
      "O universo gamer em conexão direta com sua marca. Criadores ativos no TikTok, YouTube e Twitch que mobilizam comunidades fiéis e consumidoras de hardware, periféricos e jogos.",
    keywords: [
      "influenciadores gamers brasil",
      "streamers e micro creators games",
      "patrocinio canal gamer",
      "setup gamer tiktok",
    ],
    benchmarks: {
      avgEngagement: 6.4,
      avgCpm: 18.0,
      avgCtr: 3.0,
      conversionRate: 2.6,
      avgTicket: 195,
    },
  },
  {
    name: "Educação",
    slug: "educacao",
    tagline: "Carreira, Idiomas, Concursos, Habilidades Digitais e Livros",
    description:
      "Conecte-se com educadores digitais que transformam conhecimento complexo em conteúdo acessível. Autoridade máxima para cursos online, certificações e edtechs.",
    keywords: [
      "influenciadores de educacao",
      "professores creators brasil",
      "livros e estudos instagram",
      "cursos online divulgacao creator",
    ],
    benchmarks: {
      avgEngagement: 4.9,
      avgCpm: 23.0,
      avgCtr: 2.5,
      conversionRate: 2.9,
      avgTicket: 260,
    },
  },
  {
    name: "Saúde",
    slug: "saude",
    tagline: "Medicina Preventiva, Odontologia, Saúde Mental e Bem-Estar",
    description:
      "Criadores e profissionais de Saúde certificados que transmitem credibilidade técnica e ética. Ideal para marcas que prezam por validação científica e respeito às diretrizes de saúde.",
    keywords: [
      "influenciadores da saude brasil",
      "medicos e psicologos creators",
      "bem estar e saude preventiva",
      "marketing de saude etico",
    ],
    benchmarks: {
      avgEngagement: 4.4,
      avgCpm: 28.0,
      avgCtr: 2.0,
      conversionRate: 2.7,
      avgTicket: 240,
    },
  },
  {
    name: "Viagem",
    slug: "viagem",
    tagline: "Turismo Nacional, Destinos Internacionais, Hotelaria e Roteiros",
    description:
      "Descubra viajantes e contadores de histórias que despertam o desejo de explorar novos destinos. Parcerias ideais para hotéis, companhias aéreas, agências e equipamentos de viagem.",
    keywords: [
      "influenciadores de viagem brasil",
      "creators de turismo e roteiros",
      "parcerias hotel pousada creators",
      "dicas de viagem instagram reels",
    ],
    benchmarks: {
      avgEngagement: 5.5,
      avgCpm: 22.0,
      avgCtr: 2.7,
      conversionRate: 2.1,
      avgTicket: 320,
    },
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    tagline: "Rotina, Minimalismo, Produtividade, Decoração e Casa",
    description:
      "Conteúdo orgânico que insere produtos no cotidiano real dos consumidores. Criadores com forte vínculo de identificação diária com seus seguidores.",
    keywords: [
      "influenciadores lifestyle brasil",
      "rotina e decoracao creators",
      "vlogs do dia a dia micro creators",
      "organizacao e bem viver",
    ],
    benchmarks: {
      avgEngagement: 4.8,
      avgCpm: 20.0,
      avgCtr: 2.4,
      conversionRate: 2.8,
      avgTicket: 150,
    },
  },
  {
    name: "Pet",
    slug: "pet",
    tagline: "Cães, Gatos, Adestramento Positivo, Nutrição e Acessórios Pet",
    description:
      "O nicho Pet é um dos que mais cresce no Brasil. Creators caninos e felinos com taxas de engajamento recordes e tutores dedicados prontos para investir no bem-estar de seus bichos.",
    keywords: [
      "influenciadores pet brasil",
      "pet creators cachorros gatos",
      "produtos pet instagram reels",
      "adestramento e nutricao animal",
    ],
    benchmarks: {
      avgEngagement: 7.2,
      avgCpm: 16.0,
      avgCtr: 3.8,
      conversionRate: 3.9,
      avgTicket: 135,
    },
  },
  {
    name: "Automotivo",
    slug: "automotivo",
    tagline: "Carros, Motos, Mecânica, Detalhamento e Mobilidade Elétrica",
    description:
      "Especialistas no universo motorizado que testam veículos, peças, ferramentas e produtos automotivos para um público apaixonado e comprador.",
    keywords: [
      "influenciadores automotivos brasil",
      "creators de carros e motos",
      "test drive reviews youtube brasil",
      "estetica automotiva reels",
    ],
    benchmarks: {
      avgEngagement: 4.7,
      avgCpm: 25.0,
      avgCtr: 2.2,
      conversionRate: 2.3,
      avgTicket: 290,
    },
  },
  {
    name: "Financeiro",
    slug: "financeiro",
    tagline: "Investimentos, Finanças Pessoais, Renda Fixa, Cripto e Economia",
    description:
      "Criadores que desmistificam finanças, ensinam sobre gestão orçamentária e analisam investimentos. Excelente qualificação de leads e alto ticket médio.",
    keywords: [
      "influenciadores de financas brasil",
      "educacao financeira micro creators",
      "investimentos e renda passiva",
      "fintechs marketing de influencia",
    ],
    benchmarks: {
      avgEngagement: 4.2,
      avgCpm: 32.0,
      avgCtr: 2.2,
      conversionRate: 3.0,
      avgTicket: 380,
    },
  },
  {
    name: "Entretenimento",
    slug: "entretenimento",
    tagline: "Humor, Podcasts, Cultura Pop, Cinema, Séries e Memes",
    description:
      "Alto alcance viral e repercussão imediata. Criadores de humor e entretenimento que transformam marcas em conversas orgânicas na timeline.",
    keywords: [
      "influenciadores humor entretenimento",
      "podcasters creators brasil",
      "comedia reels tiktok",
      "campanhas virais marketing de influencia",
    ],
    benchmarks: {
      avgEngagement: 6.8,
      avgCpm: 14.5,
      avgCtr: 2.6,
      conversionRate: 2.2,
      avgTicket: 95,
    },
  },
  {
    name: "Esportes",
    slug: "esportes",
    tagline: "Futebol, Corrida de Rua, Ciclismo, Lutas e Esportes Radicais",
    description:
      "Atletas amadores e profissionais que inspiram superação e disciplina. Marcas esportivas e de nutrição encontram conexão emocional imediata.",
    keywords: [
      "influenciadores esportivos brasil",
      "corrida de rua ciclismo creators",
      "futebol amador tiktok",
      "maratona e alta performance",
    ],
    benchmarks: {
      avgEngagement: 5.3,
      avgCpm: 21.5,
      avgCtr: 2.7,
      conversionRate: 2.8,
      avgTicket: 210,
    },
  },
];

// ── Top Brazilian Cities ─────────────────────────────────────────────────────

export const CITIES_DATA: CitySEOInfo[] = [
  {
    name: "São Paulo",
    state: "SP",
    region: "Sudeste",
    slug: "sao-paulo",
    population: "12,3 milhões",
    marketHighlights:
      "Maior polo econômico e publicitário da América Latina, com forte concentração de agências, startups e creators especializados.",
  },
  {
    name: "Rio de Janeiro",
    state: "RJ",
    region: "Sudeste",
    slug: "rio-de-janeiro",
    population: "6,7 milhões",
    marketHighlights:
      "Capital cultural e de lifestyle, referência nacional em gastronomia de praia, moda solar, esportes ao ar livre e turismo.",
  },
  {
    name: "Belo Horizonte",
    state: "MG",
    region: "Sudeste",
    slug: "belo-horizonte",
    population: "2,5 milhões",
    marketHighlights:
      "Polo de gastronomia afetiva, inovação de base tecnológica e forte comunidade de criadores de moda autoral e negócios.",
  },
  {
    name: "Curitiba",
    state: "PR",
    region: "Sul",
    slug: "curitiba",
    population: "1,9 milhão",
    marketHighlights:
      "Mercado de alto poder aquisitivo e teste para lançamentos nacionais, com criadores focados em design, arquitetura e tecnologia.",
  },
  {
    name: "Porto Alegre",
    state: "RS",
    region: "Sul",
    slug: "porto-alegre",
    population: "1,4 milhão",
    marketHighlights:
      "Destaque em empreendedorismo, moda de inverno, gastronomia regional e criadores com alta fidelidade comunitária.",
  },
  {
    name: "Brasília",
    state: "DF",
    region: "Centro-Oeste",
    slug: "brasilia",
    population: "3,0 milhões",
    marketHighlights:
      "Maior renda per capita do país, foco em conteúdo financeiro, políticas públicas, gastronomia sofisticada e eventos premium.",
  },
  {
    name: "Salvador",
    state: "BA",
    region: "Nordeste",
    slug: "salvador",
    population: "2,9 milhões",
    marketHighlights:
      "Epicentro criativo de música, artes, diversidade, beleza negra e gastronomia ancestral com apelo nacional e internacional.",
  },
  {
    name: "Recife",
    state: "PE",
    region: "Nordeste",
    slug: "recife",
    population: "1,6 milhão",
    marketHighlights:
      "Porto Digital consolidado, líder em criadores de tecnologia, jogos, entretenimento e festivais de cultura popular.",
  },
  {
    name: "Fortaleza",
    state: "CE",
    region: "Nordeste",
    slug: "fortaleza",
    population: "2,7 milhões",
    marketHighlights:
      "Potência em humor, moda praia, esportes aquáticos e criadores de conteúdo com alcance viral exponencial no TikTok.",
  },
  {
    name: "Florianópolis",
    state: "SC",
    region: "Sul",
    slug: "florianopolis",
    population: "537 mil",
    marketHighlights:
      "A Ilha do Silício brasileira: sintonia perfeita entre ecossistema de startups tech, surf, bem-estar e vida ao ar livre.",
  },
];

// ── Realistic Creator Profiles for Directory & SEO ───────────────────────────

export const SEED_CREATORS: CreatorProfileSEO[] = [
  {
    id: "creator-seo-1",
    name: "Laura Alcântara",
    handle: "@laura.tech",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80",
    niche: "Tecnologia",
    nicheSlug: "tecnologia",
    citySlug: "sao-paulo",
    cityName: "São Paulo",
    state: "SP",
    followers: 48500,
    engagementRate: 5.4,
    reach: 135000,
    bio: "Engenheira de software que simplifica IA, rotinas de desenvolvimento e os melhores gadgets de produtividade.",
    rating: 4.9,
    completedDeals: 26,
    verified: true,
    platforms: {
      instagram: { handle: "@laura.tech", followers: 48500 },
      tiktok: { handle: "@lauratech.dev", followers: 32000 },
      youtube: { handle: "Laura Alcantara Tech", subscribers: 18400 },
    },
    pricing: { story: 350, reel: 1200, packageDeal: 2200 },
  },
  {
    id: "creator-seo-2",
    name: "Matheus Mendonça",
    handle: "@matheus.dev",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80",
    niche: "Tecnologia",
    nicheSlug: "tecnologia",
    citySlug: "florianopolis",
    cityName: "Florianópolis",
    state: "SC",
    followers: 32000,
    engagementRate: 6.1,
    reach: 98000,
    bio: "Review de hardware, monitores ultrawide, setups minimalistas e novidades de desenvolvimento web.",
    rating: 4.95,
    completedDeals: 19,
    verified: true,
    platforms: {
      instagram: { handle: "@matheus.dev", followers: 32000 },
      youtube: { handle: "Matheus Setup Pro", subscribers: 25000 },
    },
    pricing: { story: 280, reel: 950, packageDeal: 1800 },
  },
  {
    id: "creator-seo-3",
    name: "Camila Vianna",
    handle: "@camilavianna.moda",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80",
    niche: "Moda",
    nicheSlug: "moda",
    citySlug: "rio-de-janeiro",
    cityName: "Rio de Janeiro",
    state: "RJ",
    followers: 65000,
    engagementRate: 4.8,
    reach: 180000,
    bio: "Styling real para mulheres práticas. Roupas com cortes atemporais, provadores dinâmicos e curadoria de marcas brasileiras.",
    rating: 4.9,
    completedDeals: 34,
    verified: true,
    platforms: {
      instagram: { handle: "@camilavianna.moda", followers: 65000 },
      tiktok: { handle: "@camilaviannastyle", followers: 42000 },
    },
    pricing: { story: 450, reel: 1500, packageDeal: 2800 },
  },
  {
    id: "creator-seo-4",
    name: "Chef Rodrigo Antunes",
    handle: "@antunes.cozinha",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80",
    niche: "Gastronomia",
    nicheSlug: "gastronomia",
    citySlug: "belo-horizonte",
    cityName: "Belo Horizonte",
    state: "MG",
    followers: 54000,
    engagementRate: 6.7,
    reach: 160000,
    bio: "Cozinha mineira contemporânea, fermentação natural e receitas acessíveis com ingredientes locais.",
    rating: 5.0,
    completedDeals: 29,
    verified: true,
    platforms: {
      instagram: { handle: "@antunes.cozinha", followers: 54000 },
      tiktok: { handle: "@chefantunes", followers: 61000 },
      youtube: { handle: "Cozinha do Antunes", subscribers: 35000 },
    },
    pricing: { story: 400, reel: 1400, packageDeal: 2600 },
  },
  {
    id: "creator-seo-5",
    name: "Beatriz Nogueira",
    handle: "@bianogueira.fit",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80",
    niche: "Fitness",
    nicheSlug: "fitness",
    citySlug: "curitiba",
    cityName: "Curitiba",
    state: "PR",
    followers: 41000,
    engagementRate: 5.9,
    reach: 110000,
    bio: "Treino consciente, rotina de corrida de rua e alimentação equilibrada sem extremismos.",
    rating: 4.88,
    completedDeals: 21,
    verified: true,
    platforms: {
      instagram: { handle: "@bianogueira.fit", followers: 41000 },
      tiktok: { handle: "@bianogueirafit", followers: 28000 },
    },
    pricing: { story: 320, reel: 1100, packageDeal: 2100 },
  },
  {
    id: "creator-seo-6",
    name: "Juliana Rocha",
    handle: "@jurocha.beauty",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=320&auto=format&fit=crop&q=80",
    niche: "Beleza",
    nicheSlug: "beleza",
    citySlug: "sao-paulo",
    cityName: "São Paulo",
    state: "SP",
    followers: 78000,
    engagementRate: 5.7,
    reach: 220000,
    bio: "Dermatologia aplicada ao dia a dia, resenhas de maquiagens nacionais e rotinas de pele sensível.",
    rating: 4.97,
    completedDeals: 42,
    verified: true,
    platforms: {
      instagram: { handle: "@jurocha.beauty", followers: 78000 },
      tiktok: { handle: "@jurochabeauty", followers: 85000 },
      youtube: { handle: "Juliana Rocha Beauty", subscribers: 41000 },
    },
    pricing: { story: 500, reel: 1800, packageDeal: 3400 },
  },
  {
    id: "creator-seo-7",
    name: "Felipe 'GamerX' Prado",
    handle: "@felipe.games",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=320&auto=format&fit=crop&q=80",
    niche: "Games",
    nicheSlug: "games",
    citySlug: "recife",
    cityName: "Recife",
    state: "PE",
    followers: 82000,
    engagementRate: 6.9,
    reach: 290000,
    bio: "Gamer competitivo, criador de conteúdo de RPGs, gameplays rápidas e periféricos de alta performance.",
    rating: 4.92,
    completedDeals: 31,
    verified: true,
    platforms: {
      tiktok: { handle: "@felipegamerx", followers: 82000 },
      youtube: { handle: "Felipe GamerX", subscribers: 73000 },
      instagram: { handle: "@felipe.games", followers: 29000 },
    },
    pricing: { story: 420, reel: 1600, packageDeal: 3000 },
  },
  {
    id: "creator-seo-8",
    name: "Professora Clara Ramos",
    handle: "@clara.educa",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&auto=format&fit=crop&q=80",
    niche: "Educação",
    nicheSlug: "educacao",
    citySlug: "brasilia",
    cityName: "Brasília",
    state: "DF",
    followers: 36000,
    engagementRate: 5.1,
    reach: 92000,
    bio: "Metodologias ativas de aprendizado, preparação para concursos e dicas práticas de oratória e comunicação.",
    rating: 4.98,
    completedDeals: 16,
    verified: true,
    platforms: {
      instagram: { handle: "@clara.educa", followers: 36000 },
      youtube: { handle: "Clara Educa", subscribers: 22000 },
    },
    pricing: { story: 300, reel: 1000, packageDeal: 1900 },
  },
  {
    id: "creator-seo-9",
    name: "Dr. André Fagundes",
    handle: "@dr.andrefagundes",
    avatar:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=320&auto=format&fit=crop&q=80",
    niche: "Saúde",
    nicheSlug: "saude",
    citySlug: "porto-alegre",
    cityName: "Porto Alegre",
    state: "RS",
    followers: 44000,
    engagementRate: 4.5,
    reach: 115000,
    bio: "Medicina do estilo de vida, sono regenerativo, saúde metabólica e desmistificação de mitos da internet.",
    rating: 4.96,
    completedDeals: 23,
    verified: true,
    platforms: {
      instagram: { handle: "@dr.andrefagundes", followers: 44000 },
      youtube: { handle: "Saude com Dr Andre", subscribers: 19000 },
    },
    pricing: { story: 380, reel: 1300, packageDeal: 2500 },
  },
  {
    id: "creator-seo-10",
    name: "Mariana & Gabriel Roteiros",
    handle: "@partiu.roteiros",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80",
    niche: "Viagem",
    nicheSlug: "viagem",
    citySlug: "florianopolis",
    cityName: "Florianópolis",
    state: "SC",
    followers: 59000,
    engagementRate: 6.2,
    reach: 175000,
    bio: "Roteiros de ecoturismo no Brasil, dicas de hospedagens charmosas e viagens econômicas com estilo.",
    rating: 4.94,
    completedDeals: 27,
    verified: true,
    platforms: {
      instagram: { handle: "@partiu.roteiros", followers: 59000 },
      tiktok: { handle: "@partiuroteiros", followers: 45000 },
      youtube: { handle: "Partiu Roteiros", subscribers: 31000 },
    },
    pricing: { story: 420, reel: 1450, packageDeal: 2700 },
  },
  {
    id: "creator-seo-11",
    name: "Renata Vasconcellos",
    handle: "@re.organiza",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&auto=format&fit=crop&q=80",
    niche: "Lifestyle",
    nicheSlug: "lifestyle",
    citySlug: "curitiba",
    cityName: "Curitiba",
    state: "PR",
    followers: 38000,
    engagementRate: 5.0,
    reach: 95000,
    bio: "Casa funcional, decoração acessível, organização minimalista e receitas reconfortantes.",
    rating: 4.89,
    completedDeals: 18,
    verified: true,
    platforms: {
      instagram: { handle: "@re.organiza", followers: 38000 },
      tiktok: { handle: "@reorganiza", followers: 24000 },
    },
    pricing: { story: 290, reel: 980, packageDeal: 1850 },
  },
  {
    id: "creator-seo-12",
    name: "Golden Thor & Família",
    handle: "@thor.goldensp",
    avatar:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=320&auto=format&fit=crop&q=80",
    niche: "Pet",
    nicheSlug: "pet",
    citySlug: "sao-paulo",
    cityName: "São Paulo",
    state: "SP",
    followers: 92000,
    engagementRate: 7.8,
    reach: 310000,
    bio: "O dia a dia bem-humorado de um Golden Retriever em SP. Dicas de alimentação natural e passeios pet friendly.",
    rating: 5.0,
    completedDeals: 48,
    verified: true,
    platforms: {
      instagram: { handle: "@thor.goldensp", followers: 92000 },
      tiktok: { handle: "@thorgolden", followers: 120000 },
    },
    pricing: { story: 480, reel: 1700, packageDeal: 3200 },
  },
  {
    id: "creator-seo-13",
    name: "Guilherme Garagem BR",
    handle: "@gui.garagem",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=320&auto=format&fit=crop&q=80",
    niche: "Automotivo",
    nicheSlug: "automotivo",
    citySlug: "belo-horizonte",
    cityName: "Belo Horizonte",
    state: "MG",
    followers: 47000,
    engagementRate: 5.3,
    reach: 140000,
    bio: "Test drives sinceros, análises de custo de manutenção, estética veicular e novidades do setor elétrico.",
    rating: 4.91,
    completedDeals: 22,
    verified: true,
    platforms: {
      youtube: { handle: "Gui Garagem Oficial", subscribers: 58000 },
      instagram: { handle: "@gui.garagem", followers: 47000 },
    },
    pricing: { story: 360, reel: 1300, packageDeal: 2400 },
  },
  {
    id: "creator-seo-14",
    name: "Tiago Finanças Práticas",
    handle: "@tiago.investe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=320&auto=format&fit=crop&q=80",
    niche: "Financeiro",
    nicheSlug: "financeiro",
    citySlug: "sao-paulo",
    cityName: "São Paulo",
    state: "SP",
    followers: 51000,
    engagementRate: 4.6,
    reach: 130000,
    bio: "Planejamento financeiro para autônomos e PMEs, renda fixa descomplicada e investimentos seguros.",
    rating: 4.96,
    completedDeals: 30,
    verified: true,
    platforms: {
      instagram: { handle: "@tiago.investe", followers: 51000 },
      youtube: { handle: "Tiago Investe", subscribers: 43000 },
    },
    pricing: { story: 450, reel: 1600, packageDeal: 3100 },
  },
  {
    id: "creator-seo-15",
    name: "Lucas 'Resenha' Silva",
    handle: "@lucas.resenhas",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=320&auto=format&fit=crop&q=80",
    niche: "Entretenimento",
    nicheSlug: "entretenimento",
    citySlug: "salvador",
    cityName: "Salvador",
    state: "BA",
    followers: 86000,
    engagementRate: 7.4,
    reach: 340000,
    bio: "Sketches cômicas sobre o cotidiano brasileiro, cultura baiana, memes e bastidores de produções.",
    rating: 4.93,
    completedDeals: 37,
    verified: true,
    platforms: {
      tiktok: { handle: "@lucasresenhas", followers: 110000 },
      instagram: { handle: "@lucas.resenhas", followers: 86000 },
    },
    pricing: { story: 420, reel: 1550, packageDeal: 2900 },
  },
  {
    id: "creator-seo-16",
    name: "Rodrigo Corrida & Foco",
    handle: "@rodrigo.runner",
    avatar:
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=320&auto=format&fit=crop&q=80",
    niche: "Esportes",
    nicheSlug: "esportes",
    citySlug: "rio-de-janeiro",
    cityName: "Rio de Janeiro",
    state: "RJ",
    followers: 39000,
    engagementRate: 5.8,
    reach: 105000,
    bio: "Maratonista amador, dicas de tênis de corrida, treinos na orla do Rio e disciplina esportiva diária.",
    rating: 4.89,
    completedDeals: 20,
    verified: true,
    platforms: {
      instagram: { handle: "@rodrigo.runner", followers: 39000 },
      tiktok: { handle: "@rodrigorunner", followers: 23000 },
    },
    pricing: { story: 300, reel: 1050, packageDeal: 2000 },
  },
];

// ── Query & Helper Utilities ─────────────────────────────────────────────────

export function getAllNicheSlugs(): string[] {
  return NICHES_DATA.map((n) => n.slug);
}

export function getAllCitySlugs(): string[] {
  return CITIES_DATA.map((c) => c.slug);
}

export function getNicheBySlug(slug: string): NicheSEOInfo | undefined {
  return NICHES_DATA.find((n) => n.slug.toLowerCase() === slug.toLowerCase());
}

export function getNicheByCanonical(name: AllowedNiche): NicheSEOInfo | undefined {
  return NICHES_DATA.find((n) => n.name === name);
}

export function getCityBySlug(slug: string): CitySEOInfo | undefined {
  return CITIES_DATA.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getCreatorsByNiche(nicheSlug: string): CreatorProfileSEO[] {
  const normalized = nicheSlug.toLowerCase();
  const directMatches = SEED_CREATORS.filter(
    (c) => c.nicheSlug.toLowerCase() === normalized
  );

  // If sparse, ensure at least 3 creators are returned by providing niche-adapted profiles
  if (directMatches.length >= 3) {
    return directMatches;
  }

  const niche = getNicheBySlug(nicheSlug);
  const fallbackCreators: CreatorProfileSEO[] = [
    ...directMatches,
    ...SEED_CREATORS.filter((c) => c.nicheSlug.toLowerCase() !== normalized)
      .slice(0, 3 - directMatches.length)
      .map((c, index) => ({
        ...c,
        id: `adapted-${nicheSlug}-${c.id}-${index}`,
        niche: niche?.name || ("Tecnologia" as AllowedNiche),
        nicheSlug: normalized,
        bio: `${c.bio} • Especialista em conteúdos para o nicho de ${niche?.name || "influência"}.`,
      })),
  ];

  return fallbackCreators;
}

export function getCreatorsByNicheAndCity(
  nicheSlug: string,
  citySlug: string
): CreatorProfileSEO[] {
  const normNiche = nicheSlug.toLowerCase();
  const normCity = citySlug.toLowerCase();
  const city = getCityBySlug(normCity);
  const niche = getNicheBySlug(normNiche);

  const exactMatches = SEED_CREATORS.filter(
    (c) =>
      c.nicheSlug.toLowerCase() === normNiche &&
      c.citySlug.toLowerCase() === normCity
  );

  if (exactMatches.length >= 2) {
    return exactMatches;
  }

  // Same city, different niche or same niche from nearby
  const sameCity = SEED_CREATORS.filter(
    (c) => c.citySlug.toLowerCase() === normCity
  );
  const sameNiche = SEED_CREATORS.filter(
    (c) => c.nicheSlug.toLowerCase() === normNiche
  );

  const combined = [
    ...exactMatches,
    ...sameCity.map((c) => ({
      ...c,
      id: `local-adapted-${normNiche}-${c.id}`,
      niche: niche?.name || c.niche,
      nicheSlug: normNiche,
    })),
    ...sameNiche.map((c) => ({
      ...c,
      id: `city-adapted-${normCity}-${c.id}`,
      citySlug: normCity,
      cityName: city?.name || c.cityName,
      state: city?.state || c.state,
    })),
  ];

  // Deduplicate by name and return up to 4
  const seen = new Set<string>();
  const results: CreatorProfileSEO[] = [];
  for (const item of combined) {
    if (!seen.has(item.name)) {
      seen.add(item.name);
      results.push(item);
    }
    if (results.length >= 4) break;
  }

  return results;
}

export function getAllNicheCityPairs(): Array<{ nicho: string; cidade: string }> {
  const topNiches = [
    "tecnologia",
    "moda",
    "gastronomia",
    "fitness",
    "beleza",
    "lifestyle",
    "pet",
    "financeiro",
  ];
  const topCities = [
    "sao-paulo",
    "rio-de-janeiro",
    "belo-horizonte",
    "curitiba",
    "florianopolis",
    "brasilia",
  ];

  const pairs: Array<{ nicho: string; cidade: string }> = [];
  for (const nicho of topNiches) {
    for (const cidade of topCities) {
      pairs.push({ nicho, cidade });
    }
  }
  return pairs;
}

// ── Lead Magnet: ROI Calculation Engine ───────────────────────────────────────

export function calculateRoiMetrics(params: {
  budget: number;
  nicheSlug: string;
  targetReach?: number;
}): RoiCalculationResult {
  const { budget, nicheSlug, targetReach } = params;
  const niche = getNicheBySlug(nicheSlug);

  const avgCpm = niche?.benchmarks.avgCpm || 20.0;
  const avgCtr = niche?.benchmarks.avgCtr || 2.5;
  const conversionRate = niche?.benchmarks.conversionRate || 3.0;
  const avgTicket = niche?.benchmarks.avgTicket || 180;

  const validBudget = Math.max(50, Math.min(500000, Number(budget) || 2500));

  // Projected impressions
  const projectedImpressions =
    targetReach && targetReach > 0
      ? targetReach
      : Math.round((validBudget / avgCpm) * 1000);

  // Estimated clicks based on niche CTR
  const estimatedClicks = Math.max(
    1,
    Math.round(projectedImpressions * (avgCtr / 100))
  );

  // Estimated conversions based on CTR clicks * conversion rate
  const projectedConversions = Math.max(
    1,
    Math.round(estimatedClicks * (conversionRate / 100))
  );

  // Gross projected revenue
  const projectedRevenue = Math.round(projectedConversions * avgTicket);

  // ROI % calculation: ((Revenue - Budget) / Budget) * 100
  const roiPercentage =
    validBudget > 0
      ? Math.round(((projectedRevenue - validBudget) / validBudget) * 100)
      : 0;

  // Realized CPM & CPC
  const cpm =
    projectedImpressions > 0
      ? Number(((validBudget / projectedImpressions) * 1000).toFixed(2))
      : 0;

  const cpc =
    estimatedClicks > 0
      ? Number((validBudget / estimatedClicks).toFixed(2))
      : 0;

  return {
    budget: validBudget,
    niche: niche?.name || "Tecnologia",
    projectedImpressions,
    estimatedClicks,
    projectedConversions,
    projectedRevenue,
    roiPercentage,
    cpm,
    cpc,
    benchmarkCtr: avgCtr,
    benchmarkConversionRate: conversionRate,
  };
}
