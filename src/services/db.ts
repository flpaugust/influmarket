/**
 * Serviço de Banco de Dados Seguro (Server-Side)
 *
 * Módulo de gravação no Cloud Firestore utilizando o Firebase Admin SDK.
 * Todas as operações de escrita passam por validação Zod ANTES de chegar aqui.
 *
 * IMPORTANTE:
 * - Este módulo é exclusivamente server-side (API Routes do Next.js).
 * - Nenhuma chamada direta de gravação (write) vem do client-side.
 * - O Firebase Admin SDK opera com credenciais de serviço, bypassando as
 *   Firestore Security Rules, pois a validação já foi feita no backend.
 *
 * Referências de Segurança:
 * - OWASP A01:2021 (Broken Access Control): Gravação apenas via backend validado.
 * - OWASP A03:2021 (Injection): Dados já validados por Zod antes da chamada.
 * - ISO/IEC 27001 — Rastreabilidade: Campo `_audit` com metadados de auditoria.
 * - ISO/IEC 27002 — Controle de Acesso: Credenciais Admin isoladas no servidor.
 */

import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { CampaignExtraction } from "@/lib/validation";

// ── Types ──────────────────────────────────────────────────────────────────────

/** Dados necessários para gravar a campanha (já validados por Zod). */
export interface CampaignWriteData extends CampaignExtraction {
  brandId: string;
  brandName: string;
}

/** Resultado retornado após gravação bem-sucedida no Firestore. */
export interface CampaignResult {
  id: string;
  niche: string;
  budget: number;
  title: string;
  description: string;
  status: "OPEN";
  source: "conversational_hub";
  createdAt: string;
}

/** Metadados de auditoria gravados junto ao documento (ISO 27001). */
interface AuditTrail {
  createdBy: string;
  createdVia: "Hub_Conversacional";
  timestamp: string;
  sdkVersion: "firebase-admin";
}

// ── Operações de Banco ─────────────────────────────────────────────────────────

/**
 * Cria uma campanha na coleção `campaigns` do Cloud Firestore.
 *
 * O documento inclui:
 * - Dados de negócio (nicho, orçamento, entregáveis, prazo).
 * - Metadados de origem (`source: "conversational_hub"`).
 * - Trail de auditoria (`_audit`) para rastreabilidade ISO 27001.
 * - Timestamp do servidor para consistência de relógio.
 *
 * @param data - Dados já validados por Zod (CampaignExtractionSchema + brandId).
 * @returns O documento gravado com o ID gerado pelo Firestore.
 * @throws Error se a gravação no Firestore falhar.
 */
export async function createCampaign(
  data: CampaignWriteData
): Promise<CampaignResult> {
  const db = getAdminDb();
  const now = new Date().toISOString();

  // Parse de entregáveis: string CSV → array
  const deliverablesArray: string[] = data.deliverables
    ? data.deliverables
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean)
    : ["1 Reel no Instagram", "3 Stories com CTA"];

  // Documento a ser persistido
  const campaignDoc = {
    // ── Dados de Negócio ──
    brandId: data.brandId,
    brandName: data.brandName,
    title: data.title || `Campanha de ${data.niche}`,
    description:
      data.description ||
      `Campanha de marketing de influência no nicho de ${data.niche}, criada via assistente inteligente InfluMarket Hub.`,
    deliverables: deliverablesArray,
    niche: data.niche,
    budget: data.budget,
    status: "OPEN" as const,
    proposalsCount: 0,
    deadline: data.deadline || "Em 30 dias",

    // ── Metadados de Origem ──
    source: "conversational_hub" as const,
    createdAt: now,
    serverCreatedAt: FieldValue.serverTimestamp(),

    // ── Auditoria (ISO 27001 / ISO 27002) ──
    _audit: {
      createdBy: data.brandId,
      createdVia: "Hub_Conversacional",
      timestamp: now,
      sdkVersion: "firebase-admin",
    } satisfies AuditTrail,
  };

  const docRef = await db.collection("campaigns").add(campaignDoc);

  return {
    id: docRef.id,
    niche: campaignDoc.niche,
    budget: campaignDoc.budget,
    title: campaignDoc.title,
    description: campaignDoc.description,
    status: campaignDoc.status,
    source: campaignDoc.source,
    createdAt: campaignDoc.createdAt,
  };
}
