import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { getAdminApp, getAdminDb } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { createCampaign } from "@/services/db";
import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";

vi.mock("@/lib/firebase-admin", () => ({
  getAdminApp: vi.fn(),
  getAdminDb: vi.fn(),
}));

vi.mock("firebase-admin/auth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/services/db", () => ({
  createCampaign: vi.fn(),
}));

const mockInteractionsCreate = vi.fn();

vi.mock("@google/genai", () => {
  class MockGoogleGenAI {
    interactions = {
      create: mockInteractionsCreate,
    };
  }
  return {
    GoogleGenAI: MockGoogleGenAI,
  };
});

function createRequest(
  body: unknown,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/chat - Route Handler Security & AI Integration", () => {
  const originalEnv = process.env;
  let mockVerifyIdToken: ReturnType<typeof vi.fn>;
  let mockDocGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, GEMINI_API_KEY: "test-api-key" };

    mockVerifyIdToken = vi.fn().mockResolvedValue({
      uid: "brand_owner_123",
      email: "brand@example.com",
    });

    vi.mocked(getAdminApp).mockReturnValue({} as never);
    vi.mocked(getAuth).mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    } as unknown as Auth);

    mockDocGet = vi.fn().mockResolvedValue({
      exists: true,
      data: () => ({ role: "BRAND" }),
    });

    const mockDoc = vi.fn(() => ({ get: mockDocGet }));
    const mockCollection = vi.fn(() => ({ doc: mockDoc }));
    vi.mocked(getAdminDb).mockReturnValue({
      collection: mockCollection,
    } as unknown as Firestore);

    mockInteractionsCreate.mockResolvedValue({
      output_text: "Olá! Como posso ajudar sua campanha hoje?",
      steps: [
        {
          type: "model_output",
          content: [{ type: "text", text: "Olá! Como posso ajudar sua campanha hoje?" }],
        },
      ],
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Authentication Guardrails (401)", () => {
    it("returns 401 when Authorization header is missing", async () => {
      const req = createRequest(
        {
          messages: [{ role: "user", text: "Quero criar uma campanha" }],
          brandId: "brand_owner_123",
        },
        { "x-forwarded-for": "10.0.0.1" }
      );

      const res = await POST(req);
      expect(res.status).toBe(401);

      const json = await res.json();
      expect(json.error).toContain("Token de autenticação não fornecido.");
    });

    it("returns 401 when Authorization header does not use Bearer scheme", async () => {
      const req = createRequest(
        {
          messages: [{ role: "user", text: "Quero criar uma campanha" }],
          brandId: "brand_owner_123",
        },
        {
          authorization: "Basic 123456",
          "x-forwarded-for": "10.0.0.2",
        }
      );

      const res = await POST(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toContain("Token de autenticação não fornecido.");
    });

    it("returns 401 when token verification fails or is expired", async () => {
      mockVerifyIdToken.mockRejectedValue(new Error("Firebase ID token has expired"));

      const req = createRequest(
        {
          messages: [{ role: "user", text: "Quero criar uma campanha" }],
          brandId: "brand_owner_123",
        },
        {
          authorization: "Bearer expired_token",
          "x-forwarded-for": "10.0.0.3",
        }
      );

      const res = await POST(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toContain("Token de autenticação inválido ou expirado.");
    });
  });

  describe("IP Rate Limiting (429)", () => {
    it("allows up to 10 requests per minute and blocks the 11th request with 429", async () => {
      const testIp = "192.0.2.77";

      for (let i = 1; i <= 10; i++) {
        const req = createRequest(
          {
            messages: [{ role: "user", text: `Requisição ${i}` }],
            brandId: "brand_owner_123",
          },
          {
            authorization: "Bearer valid_token",
            "x-forwarded-for": testIp,
          }
        );
        const res = await POST(req);
        expect(res.status).not.toBe(429);
      }

      // 11th request from the same IP must be rate limited
      const req11 = createRequest(
        {
          messages: [{ role: "user", text: "Requisição 11 que excede limite" }],
          brandId: "brand_owner_123",
        },
        {
          authorization: "Bearer valid_token",
          "x-forwarded-for": testIp,
        }
      );
      const res11 = await POST(req11);
      expect(res11.status).toBe(429);
      const json11 = await res11.json();
      expect(json11.error).toContain("Muitas requisições. Aguarde 1 minuto e tente novamente.");

      // A request from a different IP should still be allowed
      const reqDifferentIp = createRequest(
        {
          messages: [{ role: "user", text: "Requisição de outro IP" }],
          brandId: "brand_owner_123",
        },
        {
          authorization: "Bearer valid_token",
          "x-forwarded-for": "192.0.2.88",
        }
      );
      const resDifferent = await POST(reqDifferentIp);
      expect(resDifferent.status).toBe(200);
    });
  });

  describe("Role Segregation & Access Control (OWASP A01)", () => {
    it("returns 403 Forbidden when authenticated user has role INFLUENCER", async () => {
      mockDocGet.mockResolvedValueOnce({
        exists: true,
        data: () => ({ role: "INFLUENCER" }),
      });

      const req = createRequest(
        {
          messages: [{ role: "user", text: "Tentar criar campanha como influencer" }],
          brandId: "brand_owner_123",
        },
        {
          authorization: "Bearer valid_token",
          "x-forwarded-for": "198.51.100.11",
        }
      );

      const res = await POST(req);
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toContain("Acesso negado: apenas marcas podem criar campanhas");
    });

    it("returns 403 Forbidden when body.brandId does not match token uid", async () => {
      const req = createRequest(
        {
          messages: [{ role: "user", text: "Campanha para outro brandId" }],
          brandId: "other_brand_456",
        },
        {
          authorization: "Bearer valid_token",
          "x-forwarded-for": "198.51.100.12",
        }
      );

      const res = await POST(req);
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toContain("Acesso negado: ID da marca não confere");
    });
  });

  describe("Validation & Gemini Configuration (400, 500)", () => {
    it("returns 500 when GEMINI_API_KEY is missing from environment", async () => {
      delete process.env.GEMINI_API_KEY;

      const req = createRequest(
        {
          messages: [{ role: "user", text: "Olá" }],
          brandId: "brand_owner_123",
        },
        {
          authorization: "Bearer valid_token",
          "x-forwarded-for": "198.51.100.13",
        }
      );

      const res = await POST(req);
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toContain("Chave da API Gemini não configurada");
    });

    it("returns 400 when body is malformed JSON", async () => {
      const req = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer valid_token",
          "x-forwarded-for": "198.51.100.14",
        },
        body: "{ malformed json",
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("JSON malformado");
    });

    it("returns 400 when body fails Zod schema validation", async () => {
      const req = createRequest(
        {
          messages: [], // empty messages array is invalid
          brandId: "brand_owner_123",
        },
        {
          authorization: "Bearer valid_token",
          "x-forwarded-for": "198.51.100.15",
        }
      );

      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("Dados inválidos");
    });
  });

  describe("Quick Replies Recommendation Chips", () => {
    it("returns budget quick replies when niche is provided but budget is missing", async () => {
      mockInteractionsCreate.mockResolvedValueOnce({
        output_text: "Excelente! Para qual valor de orçamento você deseja planejar?",
        steps: [
          {
            type: "model_output",
            content: [
              {
                type: "text",
                text: "Excelente! Para qual valor de orçamento você deseja planejar?",
              },
            ],
          },
        ],
      });

      const req = createRequest(
        {
          messages: [
            { role: "user", text: "Quero criar uma campanha no nicho de Tecnologia" },
          ],
          brandId: "brand_owner_123",
        },
        {
          authorization: "Bearer valid_token",
          "x-forwarded-for": "198.51.100.20",
        }
      );

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.quickReplies).toEqual(["R$ 500", "R$ 1.500", "R$ 5.000"]);
    });

    it("returns niche quick replies when budget is provided but niche is missing", async () => {
      mockInteractionsCreate.mockResolvedValueOnce({
        output_text: "Perfeito! Qual nicho ou categoria faz mais sentido para sua marca?",
        steps: [
          {
            type: "model_output",
            content: [
              {
                type: "text",
                text: "Perfeito! Qual nicho ou categoria faz mais sentido para sua marca?",
              },
            ],
          },
        ],
      });

      const req = createRequest(
        {
          messages: [
            { role: "user", text: "Tenho R$ 3000 disponíveis para investir" },
          ],
          brandId: "brand_owner_123",
        },
        {
          authorization: "Bearer valid_token",
          "x-forwarded-for": "198.51.100.21",
        }
      );

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.quickReplies).toEqual([
        "Tecnologia",
        "Moda",
        "Gastronomia",
        "Fitness",
        "Beleza",
      ]);
    });
  });

  describe("Tool Calling & Campaign Creation Flow", () => {
    it("creates campaign when Gemini triggers createCampaign function call", async () => {
      mockInteractionsCreate
        .mockResolvedValueOnce({
          steps: [
            {
              type: "function_call",
              id: "call_abc123",
              name: "createCampaign",
              arguments: {
                niche: "Tecnologia",
                budget: 4500,
                title: "Lançamento Fone Sem Fio",
                description: "Divulgação com creators de hardware",
                deliverables: "1 Reel e 2 Stories",
                deadline: "30 dias",
              },
            },
          ],
        })
        .mockResolvedValueOnce({
          output_text: "Campanha criada com sucesso! Seus dados foram salvos.",
          steps: [],
        });

      vi.mocked(createCampaign).mockResolvedValueOnce({
        id: "camp_created_789",
        title: "Lançamento Fone Sem Fio",
        description: "Divulgação com creators de hardware",
        budget: 4500,
        niche: "Tecnologia",
        status: "OPEN",
        source: "conversational_hub",
        createdAt: new Date().toISOString(),
      });

      const req = createRequest(
        {
          messages: [
            {
              role: "user",
              text: "Crie uma campanha de Tecnologia com orçamento de 4500 reais para fone sem fio",
            },
          ],
          brandId: "brand_owner_123",
        },
        {
          authorization: "Bearer valid_token",
          "x-forwarded-for": "198.51.100.30",
        }
      );

      const res = await POST(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.campaignCreated).toBe(true);
      expect(json.campaignId).toBe("camp_created_789");
      expect(createCampaign).toHaveBeenCalledWith(
        expect.objectContaining({
          niche: "Tecnologia",
          budget: 4500,
          brandId: "brand_owner_123",
        })
      );
    });

    it("rejects tool calling with 422 if AI produces invalid parameters violating Zod", async () => {
      mockInteractionsCreate.mockResolvedValueOnce({
        steps: [
          {
            type: "function_call",
            id: "call_invalid",
            name: "createCampaign",
            arguments: {
              niche: "NichoInexistente", // Not in 15-niche allowlist
              budget: 10, // Below R$ 50 min budget
            },
          },
        ],
      });

      const req = createRequest(
        {
          messages: [
            { role: "user", text: "Quero criar campanha inválida" },
          ],
          brandId: "brand_owner_123",
        },
        {
          authorization: "Bearer valid_token",
          "x-forwarded-for": "198.51.100.31",
        }
      );

      const res = await POST(req);
      expect(res.status).toBe(422);

      const json = await res.json();
      expect(json.error).toContain("A IA extraiu parâmetros inválidos");
      expect(createCampaign).not.toHaveBeenCalled();
    });
  });
});
