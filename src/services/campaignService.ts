import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db, sanitizeForFirestore } from "@/lib/firebase";
import { Campaign, CreateCampaignDTO } from "@/types";

export type CreateCampaignData = CreateCampaignDTO;

/**
 * Cria uma nova campanha atrelada ao brandId no Cloud Firestore.
 */
export async function createCampaign(data: CreateCampaignData): Promise<Campaign> {
  const newCampaignData = {
    brandId: data.brandId,
    brandName: data.brandName,
    brandLogo:
      data.brandLogo ||
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80",
    brandIndustry: data.brandIndustry || "E-commerce",
    title: data.title,
    description: data.description,
    deliverables:
      data.deliverables && data.deliverables.length > 0
        ? data.deliverables
        : ["1 Reel no Instagram", "3 Stories com CTA"],
    budget: Number(data.budget),
    niche: data.niche,
    status: "OPEN" as const,
    proposalsCount: 0,
    deadline: data.deadline || "Em 30 dias",
    createdAt: new Date().toISOString(),
  };

  const sanitizedData = sanitizeForFirestore(newCampaignData);
  
  const campaignsRef = collection(db, "campaigns");
  const docRef = await addDoc(campaignsRef, sanitizedData);

  return {
    id: docRef.id,
    ...newCampaignData,
  } as Campaign;
}

/**
 * Busca todas as campanhas com status == "OPEN" no Firestore com limite explícito.
 */
export async function getOpenCampaigns(nicheFilter?: string, maxResults: number = 50): Promise<Campaign[]> {
  try {
    const campaignsRef = collection(db, "campaigns");
    const q = query(
      campaignsRef,
      where("status", "==", "OPEN"),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    const campaigns: Campaign[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      campaigns.push({
        id: docSnap.id,
        brandId: data.brandId,
        brandName: data.brandName,
        brandLogo: data.brandLogo,
        brandIndustry: data.brandIndustry,
        title: data.title,
        description: data.description,
        deliverables: data.deliverables || [],
        budget: data.budget,
        niche: data.niche,
        status: data.status,
        proposalsCount: data.proposalsCount || 0,
        createdAt: data.createdAt || new Date().toISOString(),
        deadline: data.deadline,
      });
    });

    if (nicheFilter && nicheFilter !== "TODOS") {
      return campaigns.filter(
        (c) => c.niche.toLowerCase() === nicheFilter.toLowerCase()
      );
    }

    return campaigns;
  } catch (error) {
    console.error("Erro ao buscar campanhas abertas:", error);
    throw error;
  }
}

/**
 * Busca campanhas criadas pela marca logada.
 */
export async function getBrandCampaigns(brandId: string, maxResults: number = 50): Promise<Campaign[]> {
  try {
    const campaignsRef = collection(db, "campaigns");
    const q = query(
      campaignsRef,
      where("brandId", "==", brandId),
      limit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    const campaigns: Campaign[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      campaigns.push({
        id: docSnap.id,
        brandId: data.brandId,
        brandName: data.brandName,
        brandLogo: data.brandLogo,
        brandIndustry: data.brandIndustry,
        title: data.title,
        description: data.description,
        deliverables: data.deliverables || [],
        budget: data.budget,
        niche: data.niche,
        status: data.status,
        proposalsCount: data.proposalsCount || 0,
        createdAt: data.createdAt || new Date().toISOString(),
        deadline: data.deadline,
      });
    });

    return campaigns;
  } catch (error) {
    console.error("Erro ao buscar campanhas da marca:", error);
    throw error;
  }
}

export const getCampaignsByBrand = getBrandCampaigns;

/**
 * Retorna uma campanha específica pelo ID.
 */
export async function getCampaignById(id: string): Promise<Campaign | null> {
  try {
    const docRef = doc(db, "campaigns", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
    } as Campaign;
  } catch (error) {
    console.error("Erro ao buscar campanha:", error);
    throw error;
  }
}

/**
 * Deleta uma campanha pelo ID.
 */
export async function deleteCampaign(campaignId: string): Promise<void> {
  try {
    const docRef = doc(db, "campaigns", campaignId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Erro ao deletar campanha:", error);
    throw error;
  }
}
