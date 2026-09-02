import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    profileInfluencer: {
      upsert: vi.fn(),
    },
    profileBrand: {
      upsert: vi.fn(),
    },
  },
}));

describe("GET /api/profile", () => {
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

  it("retorna 404 se o usuário não for encontrado", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-123" },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Usuário não encontrado.");
  });

  it("retorna perfil de influenciador com sucesso", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-inf" },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-inf",
      role: "INFLUENCER",
      influencer: {
        id: "prof-1",
        name: "Influencer Ana",
        niche: "Moda & Beleza",
        followers: 15000,
        instagram: "@ana",
        tiktok: "@anashows",
        bio: "Criadora de conteúdo",
      },
      brand: null,
    } as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.role).toBe("INFLUENCER");
    expect(data.profile.name).toBe("Influencer Ana");
  });

  it("retorna perfil de marca com sucesso", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-brand" },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-brand",
      role: "BRAND",
      influencer: null,
      brand: {
        id: "brand-1",
        companyName: "Loja Tech",
        industry: "Tecnologia",
      },
    } as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.role).toBe("BRAND");
    expect(data.profile.companyName).toBe("Loja Tech");
  });
});

describe("POST /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 401 se não estiver autenticado", async () => {
    vi.mocked(auth).mockResolvedValue(null as any);

    const request = new Request("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify({ name: "Teste" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Não autorizado.");
  });

  it("cria/atualiza perfil de influenciador corretamente", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-inf-1" },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-inf-1",
      role: "INFLUENCER",
    } as any);
    vi.mocked(prisma.profileInfluencer.upsert).mockResolvedValue({
      id: "prof-inf-1",
      userId: "user-inf-1",
      name: "Carlos Gamer",
      instagram: "@carlos",
      tiktok: "@carlosg",
      followers: 50000,
      niche: "Games",
      bio: "Streamer e criador",
    } as any);

    const payload = {
      name: "Carlos Gamer",
      instagram: "@carlos",
      tiktok: "@carlosg",
      followers: "50000",
      niche: "Games",
      bio: "Streamer e criador",
    };

    const request = new Request("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.profile.name).toBe("Carlos Gamer");
    expect(prisma.profileInfluencer.upsert).toHaveBeenCalledWith({
      where: { userId: "user-inf-1" },
      update: {
        name: "Carlos Gamer",
        instagram: "@carlos",
        tiktok: "@carlosg",
        followers: 50000,
        niche: "Games",
        bio: "Streamer e criador",
      },
      create: {
        userId: "user-inf-1",
        name: "Carlos Gamer",
        instagram: "@carlos",
        tiktok: "@carlosg",
        followers: 50000,
        niche: "Games",
        bio: "Streamer e criador",
      },
    });
  });

  it("cria/atualiza perfil de marca corretamente", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-brand-1" },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-brand-1",
      role: "BRAND",
    } as any);
    vi.mocked(prisma.profileBrand.upsert).mockResolvedValue({
      id: "prof-brand-1",
      userId: "user-brand-1",
      companyName: "Moda Fashion",
      industry: "Varejo",
    } as any);

    const payload = {
      companyName: "Moda Fashion",
      industry: "Varejo",
    };

    const request = new Request("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.profile.companyName).toBe("Moda Fashion");
    expect(prisma.profileBrand.upsert).toHaveBeenCalledWith({
      where: { userId: "user-brand-1" },
      update: {
        companyName: "Moda Fashion",
        industry: "Varejo",
      },
      create: {
        userId: "user-brand-1",
        companyName: "Moda Fashion",
        industry: "Varejo",
      },
    });
  });
});
