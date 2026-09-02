# 1. Contexto do Projeto (Startup One - MVP)
Plataforma de matchmaking bidirecional que conecta Nano/Micro Influenciadores a Pequenas e Médias Empresas (Marcas). O foco do MVP (80% do escopo) é permitir autenticação segregada por papel, gestão de perfis/mídia kit, publicação de campanhas pelas marcas e submissão/gestão de propostas em tempo real.

# 2. Arquitetura e Stack Tecnológico
- **Framework:** Next.js 14+ (App Router) com TypeScript.
- **Estilização:** Tailwind CSS + Lucide React (ícones).
- **Design System:** Estética contemporânea/editorial (paleta `stone-50`, cards brancos, bordas sutis `stone-200/80`, tipografia expressiva e layouts Bento Grid).
- **Backend-as-a-Service (Cloud Database & Auth):** Firebase (v10+ Modular SDK).
  - **Firebase Authentication:** Gestão de usuários e sessões com Email/Senha.
  - **Cloud Firestore:** Banco de dados NoSQL em nuvem (GCP) com leitura/escrita em tempo real.

# 3. Configuração do Firebase (`src/lib/firebase.ts`)
```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
```

# 4. Modelagem de Dados (Cloud Firestore)

### Coleção `users` (ID do documento = `User.uid` do Firebase Auth)
```typescript
interface UserProfile {
  uid: string;
  email: string;
  role: 'INFLUENCER' | 'BRAND';
  createdAt: Date;
  // Campos para INFLUENCER:
  name?: string;
  instagram?: string;
  tiktok?: string;
  followers?: number;
  niche?: string;
  bio?: string;
  // Campos para BRAND:
  companyName?: string;
  industry?: string;
}
```

### Coleção `campaigns`
```typescript
interface Campaign {
  id?: string;
  brandId: string;
  brandName: string;
  title: string;
  description: string;
  budget: number;
  niche: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: Date;
}
```

### Coleção `proposals`
```typescript
interface Proposal {
  id?: string;
  campaignId: string;
  campaignTitle: string;
  brandId: string;
  influencerId: string;
  influencerName: string;
  influencerFollowers: number;
  influencerNiche: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
}
```

# 5. Camada de Serviços (CRUD / Client & Server)
Implementar os seguintes módulos em `src/services/`:

1. **`authService.ts`:**
   - `registerUser(email, password, role, initialData)`: Cria conta no Firebase Auth e seta o documento em `users/{uid}`.
   - `loginUser(email, password)`: Realiza login e busca o papel (`role`) em `users/{uid}` para redirecionar.
   - `logoutUser()`: Encerra a sessão ativa.

2. **`profileService.ts`:**
   - `getUserProfile(uid)`: Retorna os dados do perfil logado.
   - `updateUserProfile(uid, data)`: Atualiza dados do criador (redes, seguidores, bio) ou da marca.

3. **`campaignService.ts`:**
   - `createCampaign(campaignData)`: Cria nova campanha atrelada ao `brandId`.
   - `getOpenCampaigns(filters?)`: Busca todas as campanhas com `status == "OPEN"`.
   - `getBrandCampaigns(brandId)`: Busca campanhas criadas pela marca logada.

4. **`proposalService.ts`:**
   - `sendProposal(proposalData)`: Cria proposta associando influenciador e campanha.
   - `getCampaignProposals(campaignId)`: Lista propostas recebidas por uma campanha específica.
   - `getInfluencerProposals(influencerId)`: Lista histórico de candidaturas enviadas pelo criador.
   - `updateProposalStatus(proposalId, status)`: Atualiza o status (`ACCEPTED` / `REJECTED`).

# 6. Telas e Diretrizes Visuais (UI/UX)
Adote fundo `bg-stone-50`, tipografia com alto contraste, cantos arredondados (`rounded-2xl`), badges de status sutis e micro-interações (`transition-all duration-200 hover:-translate-y-0.5`).

- **Landing Page (`/`):**
  - Hero section com chamada de alto impacto e CTA duplo ("Sou Creator" / "Sou Marca").
  - Bento Grid demonstrando: Mini Mídia Kit interativo, Mural de Campanhas e Pagamentos Seguros.
  
- **Autenticação (`/auth/login` e `/auth/register`):**
  - Alternador de perfil visual (Marca vs. Influenciador).
  - Formulário com feedback de erro em tempo real.
  - Redirecionamento automático: Marca $\rightarrow$ `/dashboard/brand`, Influenciador $\rightarrow$ `/dashboard/influencer`.

- **Dashboard da Marca (`/dashboard/brand`):**
  - Métricas no topo (Campanhas Ativas, Propostas Recebidas, Orçamento Total).
  - Modal para "Criar Nova Campanha".
  - Lista de campanhas ativas com painel expansível para gerenciar propostas e botões de ação ("Aceitar" / "Recusar").

- **Dashboard do Influenciador (`/dashboard/influencer`):**
  - **Mídia Kit Card:** Perfil visual com nicho, contadores de seguidores, engajamento e links.
  - **Mural de Oportunidades:** Feed de campanhas abertas com filtros de nicho e botão "Enviar Proposta".
  - **Modal de Candidatura:** Envio de mensagem personalizada para a marca.
  - **Minhas Candidaturas:** Histórico de propostas com status dinâmicos (`Pendente`, `Aceita`, `Recusada`).

# 7. Plano de Execução Step-by-Step
1. Scaffold do projeto Next.js com Tailwind CSS e Lucide Icons.
2. Instalação do SDK modular: `npm install firebase`.
3. Criação do arquivo de ambiente `.env.local` com as variáveis do Firebase.
4. Implementação do `src/lib/firebase.ts` e dos serviços modulares (`authService`, `campaignService`, `proposalService`).
5. Construção das telas com design refinado e integração direta com o Firestore.