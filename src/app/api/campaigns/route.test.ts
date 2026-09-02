import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    profileBrand: {
      findUnique: vi.fn(),
    },
    campaign: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("GET /api/campaigns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 401 se não estiver autenticado", async () => {
    vi.mocked(auth).mockResolvedValue(null as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Não autorizado.");
  });

  it("retorna apenas campanhas da marca quando usuário for BRAND", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-brand-1", role: "BRAND" },
    } as any);

    vi.mocked(prisma.profileBrand.findUnique).mockResolvedValue({
      id: "brand-1",
      userId: "user-brand-1",
      companyName: "TechCorp",
      industry: "Tech",
    } as any);

    vi.mocked(prisma.campaign.findMany).mockResolvedValue([
      {
        id: "camp-1",
        title: "Campanha Tech",
        brandId: "brand-1",
        budget: 5000,
        niche: "Tech",
        status: "OPEN",
      },
    ] as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.campaigns).toHaveLength(1);
    expect(prisma.campaign.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { brandId: "brand-1" },
      })
    );
  });

  it("retorna todas as campanhas OPEN quando usuário for INFLUENCER", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-inf-1", role: "INFLUENCER" },
    } as any);

    vi.mocked(prisma.campaign.findMany).mockResolvedValue([
      {
        id: "camp-1",
        title: "Campanha Aberta",
        status: "OPEN",
        budget: 2000,
        niche: "Moda",
      },
    ] as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.campaigns).toHaveLength(1);
    expect(prisma.campaign.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: "OPEN" },
      })
    );
  });
});

describe("POST /api/campaigns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 403 se o usuário não for BRAND", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-inf-1", role: "INFLUENCER" },
    } as any);

    const request = new Request("http://localhost/api/campaigns", {
      method: "POST",
      body: JSON.stringify({
        title: "Minha Campanha",
        description: "Desc",
        budget: "1000",
        niche: "Tech",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Apenas marcas podem criar campanhas.");
  });

  it("retorna 400 se a marca ainda não tiver perfil completo", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-brand-1", role: "BRAND" },
    } as any);
    vi.mocked(prisma.profileBrand.findUnique).mockResolvedValue(null);

    const request = new Request("http://localhost/api/campaigns", {
      method: "POST",
      body: JSON.stringify({
        title: "Minha Campanha",
        description: "Desc",
        budget: "1000",
        niche: "Tech",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Complete seu perfil de marca antes de criar campanhas.");
  });

  it("retorna 400 se faltarem campos obrigatórios", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-brand-1", role: "BRAND" },
    } as any);
    vi.mocked(prisma.profileBrand.findUnique).mockResolvedValue({
      id: "brand-1",
      userId: "user-brand-1",
      companyName: "TechCorp",
      industry: "Tech",
    } as any);

    const request = new Request("http://localhost/api/campaigns", {
      method: "POST",
      body: JSON.stringify({
        title: "Campanha",
        // missing description, budget, niche
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Todos os campos são obrigatórios.");
  });

  it("cria campanha com sucesso quando dados são válidos", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-brand-1", role: "BRAND" },
    } as any);
    vi.mocked(prisma.profileBrand.findUnique).mockResolvedValue({
      id: "brand-1",
      userId: "user-brand-1",
      companyName: "TechCorp",
      industry: "Tech",
    } as any);
    vi.mocked(prisma.campaign.create).mockResolvedValue({
      id: "new-camp-id",
      brandId: "brand-1",
      title: "Lançamento de Produto",
      description: "Vídeos no Reels",
      budget: 3500.5,
      niche: "Tecnologia",
      status: "OPEN",
      createdAt: new Date(),
    } as any);

    const request = new Request("http://localhost/api/campaigns", {
      method: "POST",
      body: JSON.stringify({
        title: "Lançamento de Produto",
        description: "Vídeos no Reels",
        budget: "3500.50",
        niche: "Tecnologia",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.campaign.id).toBe("new-camp-id");
    expect(prisma.campaign.create).toHaveBeenCalledWith({
      data: {
        brandId: "brand-1",
        title: "Lançamento de Produto",
        description: "Vídeos no Reels",
        budget: 3500.5,
        niche: "Tecnologia",
      },
    });
  });
});
