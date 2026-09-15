Você é um Engenheiro Full-Stack Sênior especialista em Next.js 14+ (App Router), TypeScript, Tailwind CSS e ecossistema Google Cloud (Firebase + Gemini API).

**Contexto do Projeto:**
Estou desenvolvendo o "InfluMarket", uma plataforma de matchmaking entre Pequenas e Médias Empresas (PMEs) e nano/micro influenciadores. O front-end web já está estruturado com Firebase (Firestore + Auth). 
Agora, preciso implementar o "InfluMarket Conversational Hub": uma interface de chat simulada onde o usuário usa linguagem natural para criar uma campanha no banco de dados, sem precisar preencher formulários complexos.

**Objetivo:**
Criar o fluxo completo do Chatbot conversacional dentro do meu projeto Next.js existente, utilizando o SDK oficial do Google Gemini.

**Stack Técnica:**
- Next.js (App Router)
- React 18+ e TypeScript estrito
- Tailwind CSS (com `lucide-react` para ícones)
- Firebase SDK (Firestore)
- API do Gemini SDK (`@google/generative-ai`), utilizando o modelo `gemini-1.5-flash`.

**O que você deve construir:**

1. A Interface do Chat (`app/hub/page.tsx`):
- Uma interface limpa simulando um chat de mensageria (fundo bg-stone-50, balões alinhados à direita para o usuário e à esquerda para o Bot).
- Um input de texto no rodapé e um botão de envio.
- Deve manter um estado de mensagens. Ao enviar, exibir um "typing indicator" enquanto aguarda a resposta da API.

2. A Rota de API (`app/api/chat/route.ts`):
- Receberá o POST do front-end com o histórico de mensagens.
- Instanciará o `GoogleGenerativeAI` com a chave `GEMINI_API_KEY`.
- O System Instruction deve orientar o modelo a agir como o "Assistente Inteligente da InfluMarket".
- IMPORTANTE: O modelo deve usar a funcionalidade de "Function Calling" (Tool / Function Declaration do Gemini) ou garantir um retorno em JSON Estruturado. A IA deve identificar a intenção de criar uma campanha e extrair duas propriedades obrigatórias: `niche` (string) e `budget` (number).

3. O Serviço de Banco de Dados (`src/services/hubService.ts`):
- Uma função `createCampaignFromChat(niche: string, budget: number)` que será acionada no backend quando a IA extrair os parâmetros com sucesso.
- A função deve salvar um documento na coleção `campaigns` no Firestore com a seguinte estrutura:
  ```json
  {
    "brandId": "claro_empresas_hub",
    "title": "Campanha gerada via Chat",
    "niche": "[niche]",
    "budget": [budget],
    "status": "OPEN",
    "source": "Hub_Conversacional",
    "createdAt": "[Timestamp]"
  }