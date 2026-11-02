import { describe, it, expect } from "vitest";
import {
  NICHES_DATA,
  CITIES_DATA,
  NICHE_SLUG_MAP,
  SLUG_TO_NICHE_MAP,
  getAllNicheSlugs,
  getAllCitySlugs,
  getNicheBySlug,
  getCityBySlug,
  getCreatorsByNiche,
  getCreatorsByNicheAndCity,
  getAllNicheCityPairs,
  calculateRoiMetrics,
} from "./seoData";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { ALLOWED_NICHES } from "@/lib/validation";

describe("Milestone 3: SEO Data & Benchmark Engine", () => {
  it("mapeia os 15 nichos permitidos para slugs canônicos bidirecionais", () => {
    expect(ALLOWED_NICHES.length).toBe(15);
    expect(NICHES_DATA.length).toBe(15);

    ALLOWED_NICHES.forEach((canonicalNiche) => {
      const slug = NICHE_SLUG_MAP[canonicalNiche];
      expect(slug).toBeDefined();
      expect(typeof slug).toBe("string");
      expect(slug.length).toBeGreaterThan(1);
      expect(SLUG_TO_NICHE_MAP[slug]).toBe(canonicalNiche);

      const nicheData = getNicheBySlug(slug);
      expect(nicheData).toBeDefined();
      expect(nicheData?.name).toBe(canonicalNiche);
      expect(nicheData?.benchmarks.avgEngagement).toBeGreaterThan(0);
      expect(nicheData?.benchmarks.avgCpm).toBeGreaterThan(0);
      expect(nicheData?.benchmarks.avgCtr).toBeGreaterThan(0);
      expect(nicheData?.benchmarks.conversionRate).toBeGreaterThan(0);
      expect(nicheData?.benchmarks.avgTicket).toBeGreaterThan(0);
    });
  });

  it("contém as 10 principais cidades brasileiras com metadados geográficos", () => {
    expect(CITIES_DATA.length).toBe(10);
    const citySlugs = getAllCitySlugs();
    expect(citySlugs).toContain("sao-paulo");
    expect(citySlugs).toContain("rio-de-janeiro");
    expect(citySlugs).toContain("belo-horizonte");
    expect(citySlugs).toContain("curitiba");
    expect(citySlugs).toContain("florianopolis");

    const sp = getCityBySlug("sao-paulo");
    expect(sp?.name).toBe("São Paulo");
    expect(sp?.state).toBe("SP");
    expect(sp?.region).toBe("Sudeste");
  });

  it("retorna criadores com métricas reais para qualquer nicho consultado", () => {
    const techCreators = getCreatorsByNiche("tecnologia");
    expect(techCreators.length).toBeGreaterThanOrEqual(2);
    techCreators.forEach((creator) => {
      expect(creator.followers).toBeGreaterThan(1000);
      expect(creator.engagementRate).toBeGreaterThan(0);
      expect(creator.reach).toBeGreaterThan(0);
      expect(creator.pricing.story).toBeGreaterThan(0);
    });

    const modaCreators = getCreatorsByNiche("moda");
    expect(modaCreators.length).toBeGreaterThanOrEqual(1);
  });

  it("retorna criadores locais georreferenciados para combinações de nicho e cidade", () => {
    const localTechSP = getCreatorsByNicheAndCity("tecnologia", "sao-paulo");
    expect(localTechSP.length).toBeGreaterThan(0);
    expect(localTechSP.some((c) => c.cityName === "São Paulo")).toBe(true);

    const pairs = getAllNicheCityPairs();
    expect(pairs.length).toBeGreaterThan(20);
    expect(pairs[0]).toHaveProperty("nicho");
    expect(pairs[0]).toHaveProperty("cidade");
  });

  describe("Calculadora de ROI", () => {
    it("calcula projeções consistentes baseadas no CPM, CTR e taxa de conversão do nicho", () => {
      const result = calculateRoiMetrics({
        budget: 5000,
        nicheSlug: "tecnologia",
      });

      expect(result.budget).toBe(5000);
      expect(result.niche).toBe("Tecnologia");
      expect(result.projectedImpressions).toBeGreaterThan(10000);
      expect(result.estimatedClicks).toBeGreaterThan(100);
      expect(result.projectedConversions).toBeGreaterThan(1);
      expect(result.projectedRevenue).toBeGreaterThan(result.budget);
      expect(result.roiPercentage).toBeGreaterThan(0);
      expect(result.cpm).toBeCloseTo(26.0, 0);
      expect(result.cpc).toBeGreaterThan(0);
    });

    it("respeita limites mínimos e máximos de orçamento (R$ 50 a R$ 500.000)", () => {
      const clampedMin = calculateRoiMetrics({
        budget: 10,
        nicheSlug: "moda",
      });
      expect(clampedMin.budget).toBe(50);

      const clampedMax = calculateRoiMetrics({
        budget: 9999999,
        nicheSlug: "moda",
      });
      expect(clampedMax.budget).toBe(500000);
    });

    it("permite sobrescrever meta personalizada de alcance de impressões", () => {
      const customReach = 250000;
      const result = calculateRoiMetrics({
        budget: 4000,
        nicheSlug: "fitness",
        targetReach: customReach,
      });

      expect(result.projectedImpressions).toBe(customReach);
      expect(result.cpm).toBeCloseTo((4000 / customReach) * 1000, 2);
    });
  });

  describe("Infraestrutura de Indexação: Sitemap e Robots", () => {
    it("gera sitemap cobrindo rotas estáticas, todos os 15 nichos e cidades", () => {
      const map = sitemap();
      expect(Array.isArray(map)).toBe(true);
      expect(map.length).toBeGreaterThan(60);

      const urls = map.map((item) => item.url);
      expect(urls).toContain("https://influmarket.com.br/");
      expect(urls).toContain("https://influmarket.com.br/hub");
      expect(urls).toContain("https://influmarket.com.br/cadastro");
      expect(urls).toContain("https://influmarket.com.br/login");

      getAllNicheSlugs().forEach((slug) => {
        expect(urls).toContain(`https://influmarket.com.br/influenciadores-de-${slug}`);
      });
    });

    it("gera robots.txt configurado com diretivas de segurança e sitemap XML", () => {
      const config = robots();
      expect(config.sitemap).toBe("https://influmarket.com.br/sitemap.xml");
      const rules = config.rules;
      if (Array.isArray(rules)) {
        expect(rules[0].allow).toBe("/");
        expect(rules[0].disallow).toEqual(["/api/", "/dashboard/", "/profile"]);
      } else {
        expect(rules.allow).toBe("/");
        expect(rules.disallow).toEqual(["/api/", "/dashboard/", "/profile"]);
      }
    });
  });
});
