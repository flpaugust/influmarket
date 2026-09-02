import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    campaign: {
      findUnique: vi.fn(),
    },
    profileBrand: {
      findUnique: vi.fn(),
    },
    profileInfluencer: {
      findUnique: vi.fn(),
    },
    proposal: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("GET /api/campaigns/[id]/proposals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCtx = {
    params: Promise.resolve({ id: "camp-123" }),
  } as any;

  it("retorna 401 se não estiver autenticado", async () => {
    vi.mocked(auth).mockResolvedValue(null as any);

    const request = new Request("http://localhost/api/campaigns/camp-123/proposals");
    const response = await GET(request, mockCtx);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Não autorizado.");
  });

  it("retorna 404 se a campanha não for encontrada", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-1", role: "BRAND" },
    } as any);
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue(null);

    const request = new Request("http://localhost/api/campaigns/camp-123/proposals");
    const response = await GET(request, mockCtx);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Campanha não encontrada.");
  });

  it("retorna 403 se a marca tentar acessar propostas de campanha de outra marca", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-brand-1", role: "BRAND" },
    } as any);
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue({
      id: "camp-123",
      brandId: "brand-other",
    } as any);
    vi.mocked(prisma.profileBrand.findUnique).mockResolvedValue({
      id: "brand-mine",
      userId: "user-brand-1",
    } as any);

    const request = new Request("http://localhost/api/campaigns/camp-123/proposals");
    const response = await GET(request, mockCtx);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Acesso negado.");
  });

  it("retorna lista de propostas para a marca dona da campanha", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-brand-1", role: "BRAND" },
    } as any);
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue({
      id: "camp-123",
      brandId: "brand-mine",
    } as any);
    vi.mocked(prisma.profileBrand.findUnique).mockResolvedValue({
      id: "brand-mine",
      userId: "user-brand-1",
    } as any);
    vi.mocked(prisma.proposal.findMany).mockResolvedValue([
      {
        id: "prop-1",
        campaignId: "camp-123",
        influencerId: "inf-1",
        message: "Tenho interesse!",
        influencer: { name: "Influencer 1" },
      },
    ] as any);

    const request = new Request("http://localhost/api/campaigns/camp-123/proposals");
    const response = await GET(request, mockCtx);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.proposals).toHaveLength(1);
    expect(data.proposals[0].message).toBe("Tenho interesse!");
  });
});

describe("POST /api/campaigns/[id]/proposals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCtx = {
    params: Promise.resolve({ id: "camp-123" }),
  } as any;

  it("retorna 403 se o usuário não for INFLUENCER", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-brand-1", role: "BRAND" },
    } as any);

    const request = new Request("http://localhost/api/campaigns/camp-123/proposals", {
      method: "POST",
      body: JSON.stringify({ message: "Olá" }),
    });

    const response = await POST(request, mockCtx);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Apenas influenciadores podem enviar propostas.");
  });

  it("retorna 400 se o influenciador não tiver perfil", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-inf-1", role: "INFLUENCER" },
    } as any);
    vi.mocked(prisma.profileInfluencer.findUnique).mockResolvedValue(null);

    const request = new Request("http://localhost/api/campaigns/camp-123/proposals", {
      method: "POST",
      body: JSON.stringify({ message: "Olá" }),
    });

    const response = await POST(request, mockCtx);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Complete seu perfil antes de enviar propostas.");
  });

  it("retorna 404 se a campanha não existir ou estiver fechada", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-inf-1", role: "INFLUENCER" },
    } as any);
    vi.mocked(prisma.profileInfluencer.findUnique).mockResolvedValue({
      id: "inf-1",
      userId: "user-inf-1",
    } as any);
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue({
      id: "camp-123",
      status: "CLOSED",
    } as any);

    const request = new Request("http://localhost/api/campaigns/camp-123/proposals", {
      method: "POST",
      body: JSON.stringify({ message: "Olá" }),
    });

    const response = await POST(request, mockCtx);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Campanha não disponível.");
  });

  it("retorna 409 se proposta já tiver sido enviada anteriormente", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-inf-1", role: "INFLUENCER" },
    } as any);
    vi.mocked(prisma.profileInfluencer.findUnique).mockResolvedValue({
      id: "inf-1",
      userId: "user-inf-1",
    } as any);
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue({
      id: "camp-123",
      status: "OPEN",
    } as any);
    vi.mocked(prisma.proposal.findFirst).mockResolvedValue({
      id: "prop-existing",
    } as any);

    const request = new Request("http://localhost/api/campaigns/camp-123/proposals", {
      method: "POST",
      body: JSON.stringify({ message: "Olá" }),
    });

    const response = await POST(request, mockCtx);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("Você já enviou uma proposta para esta campanha.");
  });

  it("cria proposta com sucesso", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-inf-1", role: "INFLUENCER" },
    } as any);
    vi.mocked(prisma.profileInfluencer.findUnique).mockResolvedValue({
      id: "inf-1",
      userId: "user-inf-1",
    } as any);
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue({
      id: "camp-123",
      status: "OPEN",
    } as any);
    vi.mocked(prisma.proposal.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.proposal.create).mockResolvedValue({
      id: "prop-created",
      campaignId: "camp-123",
      influencerId: "inf-1",
      message: "Gostaria de participar!",
      status: "PENDING",
      createdAt: new Date(),
    } as any);

    const request = new Request("http://localhost/api/campaigns/camp-123/proposals", {
      method: "POST",
      body: JSON.stringify({ message: "Gostaria de participar!" }),
    });

    const response = await POST(request, mockCtx);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.proposal.id).toBe("prop-created");
    expect(data.proposal.message).toBe("Gostaria de participar!");
  });
});
