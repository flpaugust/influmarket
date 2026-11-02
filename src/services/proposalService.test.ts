import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendProposal,
  updateProposalStatus,
  getCampaignProposals,
  getBrandProposals,
  getInfluencerProposals,
} from "./proposalService";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  where,
  limit,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "@/lib/firebase";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn((...args: unknown[]) => ({ _queryArgs: args })),
  where: vi.fn((field: string, op: string, val: unknown) => ({ field, op, val })),
  limit: vi.fn((count: number) => ({ count })),
  increment: vi.fn((n: number) => ({ _increment: n })),
  serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP_MOCK"),
}));

vi.mock("@/lib/firebase", () => ({
  db: { _type: "mockDb" },
  auth: { currentUser: null as { uid: string; email?: string } | null },
  sanitizeForFirestore: vi.fn((data: unknown) => data),
}));

function setMockCurrentUser(user: { uid: string; email?: string } | null) {
  Object.defineProperty(auth, "currentUser", {
    value: user,
    configurable: true,
    writable: true,
  });
}

describe("proposalService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setMockCurrentUser({ uid: "brand_owner_test", email: "brand@test.com" });
  });

  describe("sendProposal", () => {
    const mockProposalPayload = {
      campaignId: "camp_789",
      campaignTitle: "Lançamento Fone Sem Fio",
      brandId: "brand_owner_test",
      influencerId: "inf_456",
      influencerName: "Laura Alcântara",
      influencerFollowers: 50000,
      influencerEngagementRate: 6.2,
      influencerNiche: "Tecnologia",
      requestedBudget: 2500,
      message: "Tenho o público ideal para esse fone!",
    };

    it("creates proposal with deterministic composite key ${campaignId}_${influencerId} and _audit metadata", async () => {
      vi.mocked(doc).mockImplementation((_db, coll, id) => `doc_${coll}_${id}` as never);
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => false,
      } as never);
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as never);
      vi.mocked(updateDoc).mockResolvedValueOnce(undefined as never);

      const result = await sendProposal(mockProposalPayload);

      // Verify composite ID
      expect(result.id).toBe("camp_789_inf_456");
      expect(doc).toHaveBeenCalledWith(expect.anything(), "proposals", "camp_789_inf_456");

      // Verify setDoc was called with sanitized data and serverTimestamp
      expect(setDoc).toHaveBeenCalledWith(
        "doc_proposals_camp_789_inf_456",
        expect.objectContaining({
          campaignId: "camp_789",
          influencerId: "inf_456",
          status: "PENDING",
          serverCreatedAt: "SERVER_TIMESTAMP_MOCK",
        })
      );
      expect(serverTimestamp).toHaveBeenCalled();

      // Verify _audit metadata
      expect(result._audit).toBeDefined();
      expect(result._audit?.createdBy).toBe("inf_456");
      expect(result._audit?.createdVia).toBe("Web_Client");
      expect(result._audit?.sdkVersion).toBe("firebase-modular");
      expect(typeof result._audit?.timestamp).toBe("string");
      expect(new Date(result._audit!.timestamp).getTime()).not.toBeNaN();

      // Verify proposal counter increment on campaign document
      expect(increment).toHaveBeenCalledWith(1);
      expect(updateDoc).toHaveBeenCalledWith(
        "doc_campaigns_camp_789",
        expect.objectContaining({
          proposalsCount: { _increment: 1 },
        })
      );
    });

    it("prevents duplicate pitches for the same campaign by the same creator", async () => {
      vi.mocked(doc).mockReturnValue("doc_existing_proposal" as never);
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
      } as never);

      await expect(sendProposal(mockProposalPayload)).rejects.toThrow(
        "Você já enviou uma proposta para esta campanha."
      );

      expect(setDoc).not.toHaveBeenCalled();
      expect(updateDoc).not.toHaveBeenCalled();
    });
  });

  describe("updateProposalStatus (Bug 1 Fix Verification)", () => {
    it("updates status with 'updatedAt' key (NOT 'statusUpdatedAt') to comply with firestore.rules", async () => {
      vi.mocked(doc).mockReturnValue("doc_proposal_update" as never);
      vi.mocked(updateDoc).mockResolvedValueOnce(undefined as never);

      await updateProposalStatus("camp_789_inf_456", "ACCEPTED");

      expect(doc).toHaveBeenCalledWith(expect.anything(), "proposals", "camp_789_inf_456");

      // Verify updateDoc payload: must contain 'status' and 'updatedAt', NOT 'statusUpdatedAt'
      expect(updateDoc).toHaveBeenCalledWith("doc_proposal_update", {
        status: "ACCEPTED",
        updatedAt: expect.any(String),
      });

      // Verify that statusUpdatedAt is strictly absent
      const callArgs = vi.mocked(updateDoc).mock.calls[0][1] as unknown as Record<string, unknown>;
      expect(callArgs.statusUpdatedAt).toBeUndefined();
      expect(callArgs.updatedAt).toBeDefined();
      expect(new Date(callArgs.updatedAt as string).getTime()).not.toBeNaN();
    });

    it("updates status to REJECTED correctly", async () => {
      vi.mocked(doc).mockReturnValue("doc_proposal_rej" as never);
      vi.mocked(updateDoc).mockResolvedValueOnce(undefined as never);

      await updateProposalStatus("prop_123", "REJECTED");

      expect(updateDoc).toHaveBeenCalledWith("doc_proposal_rej", {
        status: "REJECTED",
        updatedAt: expect.any(String),
      });
    });
  });

  describe("getCampaignProposals (Bug 4 Fix Verification)", () => {
    it("enforces where('brandId', '==', auth.uid) to avoid PERMISSION_DENIED under Firestore rules", async () => {
      setMockCurrentUser({ uid: "brand_owner_secure" });

      const mockProposalDocs = [
        {
          id: "camp_1_inf_1",
          data: () => ({
            campaignId: "camp_1",
            brandId: "brand_owner_secure",
            influencerId: "inf_1",
            status: "PENDING",
            message: "Olá!",
          }),
        },
      ];

      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: mockProposalDocs,
      } as never);

      const proposals = await getCampaignProposals("camp_1");

      // Verify query constraints: BOTH campaignId and brandId must be queried
      expect(where).toHaveBeenCalledWith("campaignId", "==", "camp_1");
      expect(where).toHaveBeenCalledWith("brandId", "==", "brand_owner_secure");
      expect(limit).toHaveBeenCalledWith(50);

      expect(proposals).toHaveLength(1);
      expect(proposals[0].id).toBe("camp_1_inf_1");
      expect(proposals[0].status).toBe("PENDING");
    });

    it("throws an error when user is not authenticated", async () => {
      setMockCurrentUser(null);

      await expect(getCampaignProposals("camp_1")).rejects.toThrow(
        "Usuário não autenticado para buscar propostas."
      );

      expect(getDocs).not.toHaveBeenCalled();
    });
  });

  describe("getBrandProposals and getInfluencerProposals", () => {
    it("queries proposals received by brand across all campaigns", async () => {
      const mockDocs = [
        {
          id: "p1",
          data: () => ({ brandId: "brand_99", status: "PENDING" }),
        },
      ];

      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: mockDocs,
      } as never);

      const result = await getBrandProposals("brand_99");

      expect(where).toHaveBeenCalledWith("brandId", "==", "brand_99");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("p1");
    });

    it("queries proposals submitted by creator", async () => {
      const mockDocs = [
        {
          id: "p2",
          data: () => ({ influencerId: "inf_55", status: "ACCEPTED" }),
        },
      ];

      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: mockDocs,
      } as never);

      const result = await getInfluencerProposals("inf_55");

      expect(where).toHaveBeenCalledWith("influencerId", "==", "inf_55");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("p2");
    });
  });
});
