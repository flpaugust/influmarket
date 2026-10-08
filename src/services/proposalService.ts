import {
  collection,
  getDoc,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  limit,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db, sanitizeForFirestore } from "@/lib/firebase";
import { Proposal, ProposalStatus, SendProposalDTO } from "@/types";

export type SendProposalData = SendProposalDTO;

/**
 * Cria proposta associando influenciador e campanha no Cloud Firestore.
 */
export async function sendProposal(data: SendProposalData): Promise<Proposal> {
  const newProposalData = {
    campaignId: data.campaignId,
    campaignTitle: data.campaignTitle,
    brandId: data.brandId,
    influencerId: data.influencerId,
    influencerName: data.influencerName,
    influencerAvatar:
      data.influencerAvatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
    influencerFollowers: data.influencerFollowers,
    influencerEngagementRate: data.influencerEngagementRate || 5.0,
    influencerNiche: data.influencerNiche,
    requestedBudget: data.requestedBudget ? Number(data.requestedBudget) : undefined,
    message: data.message,
    status: "PENDING" as ProposalStatus,
    createdAt: new Date().toISOString(),
    serverCreatedAt: serverTimestamp(),
  };

  const proposalId = `${data.campaignId}_${data.influencerId}`;
  const docRef = doc(db, "proposals", proposalId);
  
  const existingDoc = await getDoc(docRef);
  if (existingDoc.exists()) {
    throw new Error("Você já enviou uma proposta para esta campanha.");
  }

  await setDoc(docRef, sanitizeForFirestore(newProposalData));

  // Atualiza contador na campanha
  try {
    const campaignRef = doc(db, "campaigns", data.campaignId);
    await updateDoc(campaignRef, {
      proposalsCount: increment(1),
    });
  } catch (err) {
    console.warn("Não foi possível atualizar contador da campanha:", err);
  }

  return {
    id: proposalId,
    ...newProposalData,
  };
}

/**
 * Lista propostas recebidas por uma campanha específica com limite.
 */
export async function getCampaignProposals(
  campaignId: string,
  maxResults: number = 50
): Promise<Proposal[]> {
  try {
    const proposalsRef = collection(db, "proposals");
    const q = query(
      proposalsRef,
      where("campaignId", "==", campaignId),
      limit(maxResults)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Proposal[];
  } catch (error) {
    console.error("Erro ao buscar propostas da campanha:", error);
    throw error;
  }
}

/**
 * Lista propostas recebidas por todas as campanhas de uma marca com limite.
 */
export async function getBrandProposals(
  brandId: string,
  maxResults: number = 50
): Promise<Proposal[]> {
  try {
    const proposalsRef = collection(db, "proposals");
    const q = query(
      proposalsRef,
      where("brandId", "==", brandId),
      limit(maxResults)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Proposal[];
  } catch (error) {
    console.error("Erro ao buscar propostas da marca:", error);
    throw error;
  }
}

/**
 * Lista histórico de candidaturas enviadas pelo criador com limite.
 */
export async function getInfluencerProposals(
  influencerId: string,
  maxResults: number = 50
): Promise<Proposal[]> {
  try {
    const proposalsRef = collection(db, "proposals");
    const q = query(
      proposalsRef,
      where("influencerId", "==", influencerId),
      limit(maxResults)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Proposal[];
  } catch (error) {
    console.error("Erro ao buscar propostas do criador:", error);
    throw error;
  }
}

/**
 * Atualiza o status da proposta (ACCEPTED ou REJECTED).
 */
export async function updateProposalStatus(
  proposalId: string,
  status: ProposalStatus
): Promise<void> {
  const proposalRef = doc(db, "proposals", proposalId);
  await updateDoc(proposalRef, {
    status,
    statusUpdatedAt: new Date().toISOString(),
  });
}

export const getProposalsByBrand = getBrandProposals;
export const getProposalsByInfluencer = getInfluencerProposals;
