/**
 * Schemas de Validação Zod — Camada de Segurança de Dados
 *
 * Todos os dados que entram na aplicação (requisições HTTP e retornos da IA)
 * passam por validação estrita com Zod antes de alcançar o banco de dados.
 *
 * Referências de Segurança:
 * - OWASP A03:2021 (Injection): Validação de tipo e range impede que payloads
 *   maliciosos (ex: budget negativo via Prompt Injection) sejam persistidos.
 * - LGPD (Art. 6°, III — Necessidade): Os schemas definem estritamente quais
 *   campos são aceitos, rejeitando dados excedentes.
 */

import { z } from "zod";

// ── Nichos Permitidos (Allowlist) ─────────────────────────────────────────────
// Apenas valores desta lista são aceitos. Impede categorias arbitrárias
// criadas por Prompt Injection ou fuzzing.

export const ALLOWED_NICHES = [
  "Tecnologia",
  "Moda",
  "Gastronomia",
  "Fitness",
  "Beleza",
  "Games",
  "Educação",
  "Saúde",
  "Viagem",
  "Lifestyle",
  "Pet",
  "Automotivo",
  "Financeiro",
  "Entretenimento",
  "Esportes",
] as const;

export type AllowedNiche = (typeof ALLOWED_NICHES)[number];

// ── Schema: Dados de Campanha Extraídos pela IA ───────────────────────────────

export const CampaignExtractionSchema = z.object({
  niche: z
    .string()
    .min(2, "Nicho deve ter pelo menos 2 caracteres.")
    .max(100, "Nicho deve ter no máximo 100 caracteres.")
    .refine(
      (val) =>
        ALLOWED_NICHES.some(
          (n) => n.toLowerCase() === val.toLowerCase()
        ),
      {
        message: `Nicho inválido. Valores aceitos: ${ALLOWED_NICHES.join(", ")}.`,
      }
    ),
  budget: z
    .number()
    .positive("Orçamento deve ser um valor positivo.")
    .min(50, "Orçamento mínimo é R$ 50,00.")
    .max(1_000_000, "Orçamento máximo é R$ 1.000.000,00."),
  title: z.string().max(200, "Título muito longo.").optional(),
  description: z.string().max(2000, "Descrição muito longa.").optional(),
  deliverables: z.string().max(1000, "Entregáveis muito longos.").optional(),
  deadline: z.string().max(200, "Prazo muito longo.").optional(),
});

export type CampaignExtraction = z.infer<typeof CampaignExtractionSchema>;

// ── Schema: Mensagem Individual do Chat ───────────────────────────────────────

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "model"]),
  text: z
    .string()
    .min(1, "Mensagem não pode ser vazia.")
    .max(5000, "Mensagem excede o limite de 5000 caracteres."),
});

export type ChatMessagePayload = z.infer<typeof ChatMessageSchema>;

// ── Schema: Corpo da Requisição POST /api/chat ────────────────────────────────
// LGPD — Minimização: Apenas os campos estritamente necessários para
// criação da campanha e identificação do brand são aceitos.

export const ChatRequestSchema = z.object({
  messages: z
    .array(ChatMessageSchema)
    .min(1, "É necessário pelo menos 1 mensagem.")
    .max(50, "Histórico excede o limite de 50 mensagens."),
  brandId: z
    .string()
    .min(1, "brandId é obrigatório.")
    .max(128, "brandId inválido."),
  brandName: z
    .string()
    .max(200, "Nome da marca muito longo.")
    .optional()
    .default("Marca Parceira"),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
