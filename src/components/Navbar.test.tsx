import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
}));

describe("<Navbar />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePathname).mockReturnValue("/");
  });

  it("renderiza botões de Entrar e Cadastrar-se quando não logado", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      profile: null,
      role: null,
      loading: false,
      isLoggedIn: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      toastMessage: null,
      showToast: vi.fn(),
      refreshProfile: vi.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText("InfluMarket")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar-se")).toBeInTheDocument();
    expect(screen.getByText("Mural de Oportunidades")).toBeInTheDocument();
  });

  it("renderiza dados e badge de Criador quando autenticado como INFLUENCER", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: "user-inf", email: "laura@influencer.com" } as any,
      profile: {
        uid: "user-inf",
        email: "laura@influencer.com",
        name: "Laura Alcântara",
        handle: "@laura.tech",
        role: "INFLUENCER",
      },
      role: "INFLUENCER",
      loading: false,
      isLoggedIn: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      toastMessage: null,
      showToast: vi.fn(),
      refreshProfile: vi.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText("Laura Alcântara")).toBeInTheDocument();
    expect(screen.getByText("Criador")).toBeInTheDocument();
    expect(screen.queryByText("Cadastrar-se")).not.toBeInTheDocument();
  });

  it("renderiza dados da marca quando autenticado como BRAND", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: "user-brand", email: "brand@test.com" } as any,
      profile: {
        uid: "user-brand",
        email: "brand@test.com",
        companyName: "NextGen Audio",
        role: "BRAND",
      },
      role: "BRAND",
      loading: false,
      isLoggedIn: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      toastMessage: null,
      showToast: vi.fn(),
      refreshProfile: vi.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText("NextGen Audio")).toBeInTheDocument();
    expect(screen.getByText("Marca")).toBeInTheDocument();
    expect(screen.queryByText("Cadastrar-se")).not.toBeInTheDocument();
  });
});
