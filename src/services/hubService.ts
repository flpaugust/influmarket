import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, sanitizeForFirestore } from "@/lib/firebase";

/**
 * Estrutura do documento gravado na coleção `campaigns`
 * quando uma campanha é criada via Hub Conversacional.
 */
export interface HubCampaignDocument {
  brandId: string;
  title: string;
  niche: string;
  budget: number;
  status: "OPEN";
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
 * Cria uma campanha na coleção `campaigns` do Firestore
 * a partir dos dados extraídos pela IA no Hub Conversacional.
 *
 * @param niche - Nicho da campanha (ex: "Tecnologia", "Moda")
 * @param budget - Orçamento em reais (ex: 800)
 * @returns O documento criado com o ID do Firestore
 * @throws Error se o Firestore rejeitar a gravação
 */
export async function createCampaignFromChat(
  niche: string,
  budget: number
): Promise<HubCampaignResult> {
  const campaignsRef = collection(db, "campaigns");

  const campaignData: HubCampaignDocument = {
    brandId: "claro_empresas_hub",
    title: "Campanha gerada via Chat",
    niche,
    budget,
    status: "OPEN",
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
