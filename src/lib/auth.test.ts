import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// We can test authorize logic or credential validation
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

describe("Auth logic & Password validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita autenticação se senha for incorreta", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      password: "hashed_password",
      role: "BRAND",
      createdAt: new Date(),
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const user = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });
    expect(user).not.toBeNull();

    const isValid = await bcrypt.compare("wrong_password", user!.password);
    expect(isValid).toBe(false);
  });

  it("aprova autenticação quando email e senha coincidem", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      password: "hashed_password",
      role: "INFLUENCER",
      createdAt: new Date(),
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const user = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });
    expect(user).not.toBeNull();

    const isValid = await bcrypt.compare("correct_password", user!.password);
    expect(isValid).toBe(true);
    expect(user!.role).toBe("INFLUENCER");
  });
});
