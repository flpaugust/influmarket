import { GoogleGenAI } from "@google/genai";
import { createCampaignFromChat } from "@/services/hubService";
import { NextRequest } from "next/server";

// ── Types ──────────────────────────────────────────────────────────────────────

/** Corpo esperado no POST vindo do frontend */
interface ChatRequestBody {
  messages: ChatMessagePayload[];
}

/** Cada mensagem do histórico enviada pelo frontend */
interface ChatMessagePayload {
  role: "user" | "model";
  text: string;
}

/** Resposta padrão da API para o frontend */
interface ChatApiResponse {
  reply: string;
  campaignCreated?: boolean;
  campaignId?: string;
}

/** Resposta de erro padrão */
interface ChatApiError {
  error: string;
}

/** Argumentos extraídos pela IA para criar campanha */
interface CreateCampaignArgs {
  niche: string;
  budget: number;
}

// ── Gemini Tool Declaration (Interactions API format) ───────────────────────────

const createCampaignTool = {
  type: "function" as const,
  name: "createCampaign",
  description:
    "Cria uma nova campanha de marketing de influência no banco de dados. " +
    "Chame esta função SOMENTE quando o usuário fornecer CLARAMENTE o nicho e o orçamento da campanha.",
  parameters: {
    type: "object",
    properties: {
      niche: {
        type: "string",
        description:
          "O nicho ou segmento da campanha (ex: Tecnologia, Moda, Gastronomia, Fitness, Beleza).",
      },
      budget: {
        type: "number",
        description:
          "O orçamento da campanha em reais (BRL). Deve ser um número positivo.",
      },
    },
    required: ["niche", "budget"],
  },
};

const SYSTEM_INSTRUCTION = `Você é o Assistente Inteligente da InfluMarket, uma plataforma que conecta Pequenas e Médias Empresas (PMEs) a nano e micro influenciadores.

Seu papel:
- Ajudar o usuário a criar campanhas de marketing de influência de forma conversacional.
- Ser simpático, objetivo e profissional.
- Responder SEMPRE em português do Brasil.

Regras importantes:
1. Quando o usuário expressar a intenção de criar uma campanha E fornecer AMBOS os dados (nicho e orçamento), use a função createCampaign para registrar a campanha.
2. Se o usuário fornecer apenas um dos dados (só o nicho ou só o orçamento), pergunte educadamente pelo dado que falta.
3. Se o usuário perguntar sobre outros assuntos (como funciona a plataforma, como encontrar influenciadores, etc.), responda de forma prestativa.
4. Nunca invente dados que o usuário não forneceu.
5. Ao confirmar a criação de uma campanha, seja entusiástico e profissional.`;

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Converte o histórico do frontend para o formato stateless da Interactions API */
function buildInteractionInput(
  messages: ChatMessagePayload[]
): any[] {
  const input: any[] = [];

  for (const msg of messages) {
    if (msg.role === "user") {
      input.push({
        type: "user_input",
        content: [{ type: "text", text: msg.text }],
      });
    } else {
      input.push({
        type: "model_output",
        content: [{ type: "text", text: msg.text }],
      });
    }
  }

  return input;
}

// ── Route Handler ──────────────────────────────────────────────────────────────

export async function POST(
  request: NextRequest
): Promise<Response> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const errorBody: ChatApiError = {
        error: "Chave da API Gemini não configurada no servidor.",
      };
      return Response.json(errorBody, { status: 500 });
    }

    const body = (await request.json()) as ChatRequestBody;

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      const errorBody: ChatApiError = {
        error: "O campo 'messages' é obrigatório e deve conter ao menos uma mensagem.",
      };
      return Response.json(errorBody, { status: 400 });
    }

    // Instancia o novo SDK
    const ai = new GoogleGenAI({ apiKey });

    // Monta o input no formato da Interactions API (stateless)
    const input = buildInteractionInput(body.messages);

    // Primeira chamada à Interactions API
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      system_instruction: SYSTEM_INSTRUCTION,
      store: false,
      input: input as any,
      tools: [createCampaignTool],
    });

    // Verifica se houve function_call nos steps
    const functionCallStep = interaction.steps?.find(
      (step: Record<string, unknown>) => step.type === "function_call" && step.name === "createCampaign"
    );

    if (functionCallStep) {
      const args = (functionCallStep as Record<string, unknown>).arguments as CreateCampaignArgs;
      const niche = String(args.niche);
      const budget = Number(args.budget);

      // Validação dos parâmetros extraídos
      if (!niche || isNaN(budget) || budget <= 0) {
        const errorBody: ChatApiError = {
          error: "A IA extraiu parâmetros inválidos. Tente reformular sua mensagem.",
        };
        return Response.json(errorBody, { status: 422 });
      }

      // Grava a campanha no Firestore
      const campaign = await createCampaignFromChat(niche, budget);

      // Monta o histórico completo com os steps do model + function_result
      const fullHistory: any[] = [...input];
      if (interaction.steps) {
        for (const step of interaction.steps) {
          fullHistory.push(step as any);
        }
      }
      fullHistory.push({
        type: "function_result",
        name: "createCampaign",
        call_id: (functionCallStep as Record<string, unknown>).id as string,
        result: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              campaignId: campaign.id,
              niche: campaign.niche,
              budget: campaign.budget,
              status: campaign.status,
            }),
          },
        ],
      });

      // Segunda chamada para o Gemini gerar a resposta amigável
      const interaction2 = await ai.interactions.create({
        model: "gemini-3.8-flash",
        system_instruction: SYSTEM_INSTRUCTION,
        store: false,
        input: fullHistory as any,
        tools: [createCampaignTool],
      });

      const confirmationText =
        (interaction2 as any).output_text ||
        `✅ Campanha criada com sucesso! Nicho: ${niche}, Orçamento: R$${budget.toLocaleString("pt-BR")}.`;

      const successBody: ChatApiResponse = {
        reply: confirmationText,
        campaignCreated: true,
        campaignId: campaign.id,
      };

      return Response.json(successBody, { status: 200 });
    }

    // Resposta normal (sem function call)
    const textReply =
      (interaction as any).output_text ||
      "Desculpe, não consegui gerar uma resposta. Pode tentar novamente?";

    const normalBody: ChatApiResponse = {
      reply: textReply,
    };

    return Response.json(normalBody, { status: 200 });
  } catch (error: unknown) {
    console.error("[API /api/chat] Erro:", error);

    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";

    const errorBody: ChatApiError = { error: message };
    return Response.json(errorBody, { status: 500 });
  }
}
