import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createCampaign,
  updateCampaignStatus,
  getOpenCampaigns,
  getBrandCampaigns,
  getCampaignById,
  deleteCampaign,
} from "./campaignService";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  where,
  limit,
} from "firebase/firestore";
import type { CampaignStatus } from "@/types";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  deleteDoc: vi.fn(),
  updateDoc: vi.fn(),
  query: vi.fn((...args: unknown[]) => ({ _queryArgs: args })),
  where: vi.fn((field: string, op: string, val: unknown) => ({ field, op, val })),
  limit: vi.fn((count: number) => ({ count })),
}));

vi.mock("@/lib/firebase", () => ({
  db: { _type: "mockDb" },
  sanitizeForFirestore: vi.fn((data: unknown) => data),
}));

describe("campaignService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCampaign", () => {
    it("creates a campaign with ISO 27001 _audit metadata", async () => {
      vi.mocked(addDoc).mockResolvedValueOnce({ id: "camp_new_123" } as never);

      const payload = {
        brandId: "brand_abc",
        brandName: "TechCorp",
        title: "Campanha Black Friday",
        description: "Review de notebooks",
        budget: 5000,
        niche: "Tecnologia",
        deliverables: ["1 Video no YouTube", "2 Reels"],
        deadline: "15 dias",
      };

      const result = await createCampaign(payload);

      expect(addDoc).toHaveBeenCalledTimes(1);
      expect(result.id).toBe("camp_new_123");
      expect(result.brandId).toBe("brand_abc");
      expect(result.budget).toBe(5000);
      expect(result.status).toBe("OPEN");
      expect(result.proposalsCount).toBe(0);

      // Verify _audit metadata completeness
      expect(result._audit).toBeDefined();
      expect(result._audit?.createdBy).toBe("brand_abc");
      expect(result._audit?.createdVia).toBe("Web_Client");
      expect(result._audit?.sdkVersion).toBe("firebase-modular");
      expect(typeof result._audit?.timestamp).toBe("string");
      expect(new Date(result._audit!.timestamp).getTime()).not.toBeNaN();
    });

    it("applies default values for deliverables, logo, and industry when omitted", async () => {
      vi.mocked(addDoc).mockResolvedValueOnce({ id: "camp_defaults" } as never);

      const minimalPayload = {
        brandId: "brand_xyz",
        brandName: "Moda Fashion",
        title: "Campanha Verão",
        description: "Divulgação de coleção",
        budget: 2000,
        niche: "Moda",
      };

      const result = await createCampaign(minimalPayload);

      expect(result.brandIndustry).toBe("E-commerce");
      expect(result.brandLogo).toContain("images.unsplash.com");
      expect(result.deliverables).toEqual(["1 Reel no Instagram", "3 Stories com CTA"]);
      expect(result.deadline).toBe("Em 30 dias");
    });
  });

  describe("updateCampaignStatus", () => {
    it("allows valid status transition to OPEN", async () => {
      vi.mocked(doc).mockReturnValue("docRef_camp1" as never);
      vi.mocked(updateDoc).mockResolvedValueOnce(undefined as never);

      await updateCampaignStatus("camp_1", "OPEN");

      expect(doc).toHaveBeenCalledWith(expect.anything(), "campaigns", "camp_1");
      expect(updateDoc).toHaveBeenCalledWith("docRef_camp1", {
        status: "OPEN",
        updatedAt: expect.any(String),
      });
    });

    it("allows valid status transition to IN_PROGRESS", async () => {
      vi.mocked(doc).mockReturnValue("docRef_camp2" as never);
      vi.mocked(updateDoc).mockResolvedValueOnce(undefined as never);

      await updateCampaignStatus("camp_2", "IN_PROGRESS");

      expect(updateDoc).toHaveBeenCalledWith("docRef_camp2", {
        status: "IN_PROGRESS",
        updatedAt: expect.any(String),
      });
    });

    it("allows valid status transition to CLOSED", async () => {
      vi.mocked(doc).mockReturnValue("docRef_camp3" as never);
      vi.mocked(updateDoc).mockResolvedValueOnce(undefined as never);

      await updateCampaignStatus("camp_3", "CLOSED");

      expect(updateDoc).toHaveBeenCalledWith("docRef_camp3", {
        status: "CLOSED",
        updatedAt: expect.any(String),
      });
    });

    it("throws an error when transitioning to an invalid status", async () => {
      await expect(
        updateCampaignStatus("camp_invalid", "ARCHIVED" as unknown as CampaignStatus)
      ).rejects.toThrow("Status de campanha inválido: ARCHIVED");

      expect(updateDoc).not.toHaveBeenCalled();
    });
  });

  describe("getOpenCampaigns", () => {
    it("queries Firestore for campaigns with status == OPEN with limit", async () => {
      const mockDocs = [
        {
          id: "camp_1",
          data: () => ({
            brandId: "b1",
            brandName: "Brand 1",
            title: "Campanha 1",
            budget: 1000,
            niche: "Tecnologia",
            status: "OPEN",
            proposalsCount: 2,
          }),
        },
        {
          id: "camp_2",
          data: () => ({
            brandId: "b2",
            brandName: "Brand 2",
            title: "Campanha 2",
            budget: 3000,
            niche: "Moda",
            status: "OPEN",
            proposalsCount: 0,
          }),
        },
      ];

      vi.mocked(collection).mockReturnValue("campaignsRef" as never);
      vi.mocked(getDocs).mockResolvedValueOnce(mockDocs as never);

      const campaigns = await getOpenCampaigns();

      expect(where).toHaveBeenCalledWith("status", "==", "OPEN");
      expect(limit).toHaveBeenCalledWith(50);
      expect(campaigns).toHaveLength(2);
      expect(campaigns[0].id).toBe("camp_1");
      expect(campaigns[1].id).toBe("camp_2");
    });

    it("filters by niche when nicheFilter is specified", async () => {
      const mockDocs = [
        {
          id: "camp_1",
          data: () => ({
            brandId: "b1",
            brandName: "Brand 1",
            title: "Campanha Tech",
            budget: 1000,
            niche: "Tecnologia",
            status: "OPEN",
          }),
        },
        {
          id: "camp_2",
          data: () => ({
            brandId: "b2",
            brandName: "Brand 2",
            title: "Campanha Moda",
            budget: 3000,
            niche: "Moda",
            status: "OPEN",
          }),
        },
      ];

      vi.mocked(getDocs).mockResolvedValueOnce(mockDocs as never);

      const filtered = await getOpenCampaigns("tecnologia");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].niche).toBe("Tecnologia");
    });
  });

  describe("getBrandCampaigns", () => {
    it("queries campaigns by brandId", async () => {
      const mockDocs = [
        {
          id: "camp_b1",
          data: () => ({
            brandId: "target_brand",
            brandName: "MyBrand",
            title: "Minha Campanha",
            budget: 2500,
            niche: "Beleza",
            status: "OPEN",
          }),
        },
      ];

      vi.mocked(getDocs).mockResolvedValueOnce(mockDocs as never);

      const result = await getBrandCampaigns("target_brand");

      expect(where).toHaveBeenCalledWith("brandId", "==", "target_brand");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("camp_b1");
    });
  });

  describe("getCampaignById & deleteCampaign", () => {
    it("returns null if campaign does not exist", async () => {
      vi.mocked(doc).mockReturnValue("docRef_missing" as never);
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => false,
      } as never);

      const campaign = await getCampaignById("non_existent_id");
      expect(campaign).toBeNull();
    });

    it("returns campaign if document exists", async () => {
      vi.mocked(doc).mockReturnValue("docRef_found" as never);
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "camp_found_id",
        data: () => ({
          brandId: "b99",
          title: "Found Camp",
          niche: "Fitness",
          budget: 4000,
        }),
      } as never);

      const campaign = await getCampaignById("camp_found_id");
      expect(campaign).not.toBeNull();
      expect(campaign?.title).toBe("Found Camp");
      expect(campaign?.id).toBe("camp_found_id");
    });

    it("deletes campaign by ID", async () => {
      vi.mocked(doc).mockReturnValue("docRef_del" as never);
      vi.mocked(deleteDoc).mockResolvedValueOnce(undefined as never);

      await deleteCampaign("camp_del_123");

      expect(doc).toHaveBeenCalledWith(expect.anything(), "campaigns", "camp_del_123");
      expect(deleteDoc).toHaveBeenCalledWith("docRef_del");
    });
  });
});
