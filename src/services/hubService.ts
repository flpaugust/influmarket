import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, sanitizeForFirestore } from "@/lib/firebase";

/**
 * Dados do brand necessários para vincular a campanha ao usuário correto.
 */
export interface HubBrandInfo {
  brandId: string;
  brandName: string;
  brandLogo?: string;
  brandIndustry?: string;
}

/**
 * Estrutura do documento gravado na coleção `campaigns`
 * quando uma campanha é criada via Hub Conversacional.
 */
export interface HubCampaignDocument {
  brandId: string;
  brandName: string;
  brandLogo: string;
  brandIndustry: string;
  title: string;
  description: string;
  deliverables: string[];
  niche: string;
  budget: number;
  status: "OPEN";
  proposalsCount: number;
  deadline: string;
  source: "Hub_Conversacional";
  createdAt: string;
}

/**
 * Resultado retornado após a criação da campanha,
 * incluindo o ID gerado pelo Firestore.
 */
export interface HubCampaignResult extends HubCampaignDocument {
  id: string;
}

/**
 * Campos opcionais que podem ser extraídos pela IA no chat.
 */
export interface HubCampaignOptionalFields {
  title?: string;
  description?: string;
  /** Entregáveis separados por vírgula (string bruta da IA) */
  deliverables?: string;
  deadline?: string;
}

/**
 * Cria uma campanha na coleção `campaigns` do Firestore
 * a partir dos dados extraídos pela IA no Hub Conversacional.
 *
 * @param niche - Nicho da campanha (ex: "Tecnologia", "Moda")
 * @param budget - Orçamento em reais (ex: 800)
 * @param brandInfo - Dados do brand logado (uid, nome, logo, indústria)
 * @param optional - Campos opcionais extraídos pela IA (título, descrição, entregáveis, deadline)
 * @returns O documento criado com o ID do Firestore
 * @throws Error se o Firestore rejeitar a gravação
 */
export async function createCampaignFromChat(
  niche: string,
  budget: number,
  brandInfo: HubBrandInfo,
  optional?: HubCampaignOptionalFields
): Promise<HubCampaignResult> {
  const campaignsRef = collection(db, "campaigns");

  // Parse deliverables: string separada por vírgula → array
  const deliverablesArray =
    optional?.deliverables
      ? optional.deliverables
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean)
      : ["1 Reel no Instagram", "3 Stories com CTA"];

  const campaignData: HubCampaignDocument = {
    brandId: brandInfo.brandId,
    brandName: brandInfo.brandName || "Marca Parceira",
    brandLogo:
      brandInfo.brandLogo ||
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80",
    brandIndustry: brandInfo.brandIndustry || "E-commerce",
    title: optional?.title || `Campanha de ${niche}`,
    description:
      optional?.description ||
      `Campanha de marketing de influência no nicho de ${niche}, criada via assistente inteligente InfluMarket Hub.`,
    deliverables: deliverablesArray,
    niche,
    budget,
    status: "OPEN",
    proposalsCount: 0,
    deadline: optional?.deadline || "Em 30 dias",
    source: "Hub_Conversacional",
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(
    campaignsRef,
    sanitizeForFirestore({
      ...campaignData,
      serverCreatedAt: serverTimestamp(),
    })
  );

  return {
    id: docRef.id,
    ...campaignData,
  };
}
