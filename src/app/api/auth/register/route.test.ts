import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 400 se campos obrigatórios estiverem ausentes", async () => {
    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("obrigatórios");
  });

  it("retorna 400 se o role for inválido", async () => {
    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
        role: "INVALID_ROLE",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Tipo de conta inválido.");
  });

  it("retorna 409 se o email já estiver cadastrado", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "existing@example.com",
      password: "hashed",
      role: "INFLUENCER",
      createdAt: new Date(),
    } as any);

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "existing@example.com",
        password: "password123",
        role: "INFLUENCER",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("Este email já está cadastrado.");
  });

  it("cria usuário com sucesso quando dados são válidos", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed_password" as never);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "new-user-id",
      email: "new@example.com",
      role: "INFLUENCER",
      password: "hashed_password",
      createdAt: new Date(),
    } as any);

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "new@example.com",
        password: "password123",
        role: "INFLUENCER",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.user).toEqual({
      id: "new-user-id",
      email: "new@example.com",
      role: "INFLUENCER",
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "new@example.com",
        password: "hashed_password",
        role: "INFLUENCER",
      },
    });
  });

  it("retorna 500 em caso de erro no banco de dados", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error("DB Error"));

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
        role: "BRAND",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Erro interno do servidor.");
  });
});
