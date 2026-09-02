import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
}));

// Mock services to avoid network calls during render
vi.mock("@/services/campaignService", () => ({
  getOpenCampaigns: vi.fn().mockResolvedValue([]),
  getCampaignsByBrand: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/services/proposalService", () => ({
  getProposalsByInfluencer: vi.fn().mockResolvedValue([]),
  getProposalsByBrand: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/services/profileService", () => ({
  listInfluencers: vi.fn().mockResolvedValue([]),
  getFeaturedInfluencers: vi.fn().mockResolvedValue([]),
}));

describe("HomePage (`/`) - Dynamic Contextual Rendering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exibe HomeLoadingSkeleton enquanto loading === true", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      profile: null,
      role: null,
      loading: true,
      isLoggedIn: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      toastMessage: null,
      showToast: vi.fn(),
      refreshProfile: vi.fn(),
    });

    const { container } = render(<HomePage />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("exibe GuestLandingPage quando o usuário não está autenticado", () => {
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

    render(<HomePage />);
    expect(screen.getByText(/Conecte marcas a criadores com/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Criar Conta Gratuita/i).length).toBeGreaterThan(0);
  });

  it("exibe InfluencerDashboardView quando autenticado como INFLUENCER", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: "inf-123", email: "creator@test.com" } as any,
      profile: {
        uid: "inf-123",
        email: "creator@test.com",
        name: "Lucas Tech",
        role: "INFLUENCER",
        niche: "Tech",
        followers: 25000,
        engagementRate: 6.1,
        reach: 75000,
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

    render(<HomePage />);
    expect(await screen.findByText(/Olá, Lucas Tech!/i)).toBeInTheDocument();
    expect(screen.getByText(/Editar Mídia Kit/i)).toBeInTheDocument();
    expect(screen.getByText(/Propostas Enviadas/i)).toBeInTheDocument();
  });

  it("exibe BrandDashboardView quando autenticado como BRAND", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: "brand-123", email: "brand@test.com" } as any,
      profile: {
        uid: "brand-123",
        email: "brand@test.com",
        companyName: "SoundVibe Audio",
        role: "BRAND",
        industry: "Hardware",
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

    render(<HomePage />);
    expect(await screen.findByText(/Olá, SoundVibe Audio!/i)).toBeInTheDocument();
    expect(screen.getByText(/Marketplace de Descoberta de Criadores/i)).toBeInTheDocument();
    expect(screen.getByText(/Publicar Nova Campanha/i)).toBeInTheDocument();
  });
});
