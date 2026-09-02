# InfluMarket ⚡
> Plataforma de Matchmaking Editorial e Direto entre Nano/Micro Influenciadores e Pequenas e Médias Empresas (Marcas).

---

## 📌 1. Visão Geral do Projeto
O **InfluMarket** é uma plataforma bidirecional desenvolvida para solucionar a fricção no marketing de influência para criadores em ascensão (nano e micro creators) e PMEs. A aplicação elimina planilhas e negociações sem garantias através de:

- **Autenticação Segregada por Papel:** Fluxos especializados para Criadores (`INFLUENCER`) e Marcas (`BRAND`).
- **Mídia Kit Dinâmico em Nuvem:** Perfis com métricas reais, nichos, alcance e redes sociais integradas.
- **Mural de Oportunidades:** Feed de campanhas ativas com filtros por categoria e orçamento.
- **Pitch de Parcerias & Propostas:** Envio de candidaturas personalizadas com orçamentos flexíveis.
- **Gestão em Tempo Real:** Painel com aprovação/recusa de propostas e custódia segura de valores.

---

## 🛠️ 2. Stack Tecnológica
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) com Turbopack e React 19.
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) com tipagem estrita de ponta a ponta.
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com design system editorial sob medida.
- **Ícones:** [Lucide React](https://lucide.dev/).
- **Banco de Dados & Autenticação (BaaS):** [Firebase v10+ Modular SDK](https://firebase.google.com/):
  - **Firebase Authentication:** Gestão de usuários, tokens e sessões com Email/Senha.
  - **Cloud Firestore:** Banco de dados NoSQL distribuído no Google Cloud Platform (GCP) com persistência em tempo real.
- **Testes Automatizados:** [Vitest](https://vitest.dev/) + React Testing Library.

---

## 🗄️ 3. Modelagem de Dados (Cloud Firestore)

### 3.1 Coleção `users` (ID do Documento = `User.uid`)
Armazena os dados cadastrais e o perfil operacional do usuário:
```typescript
interface UserProfile {
  uid: string;
  email: string;
  role: 'INFLUENCER' | 'BRAND';
  createdAt: string;
  
  // Específico para Criadores (INFLUENCER):
  name?: string;
  handle?: string;
  avatar?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  followers?: number;
  engagementRate?: number;
  reach?: number;
  niche?: string;
  bio?: string;
  rating?: number;
  completedDeals?: number;

  // Específico para Marcas (BRAND):
  companyName?: string;
  logo?: string;
  industry?: string;
  budgetAvailable?: number;
}
```

### 3.2 Coleção `campaigns`
Armazena as oportunidades criadas pelas marcas:
```typescript
interface Campaign {
  id?: string;
  brandId: string;
  brandName: string;
  brandLogo?: string;
  brandIndustry?: string;
  title: string;
  description: string;
  deliverables?: string[];
  budget: number;
  niche: string;
  status: 'OPEN' | 'CLOSED';
  proposalsCount?: number;
  createdAt: string;
  deadline?: string;
}
```

### 3.3 Coleção `proposals`
Armazena os pitches e candidaturas enviados pelos criadores:
```typescript
interface Proposal {
  id?: string;
  campaignId: string;
  campaignTitle: string;
  brandId: string;
  influencerId: string;
  influencerName: string;
  influencerAvatar?: string;
  influencerFollowers: number;
  influencerEngagementRate?: number;
  influencerNiche: string;
  requestedBudget?: number;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}
```

---

## 📂 4. Estrutura de Pastas

```text
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx      # Rota de Login (/auth/login)
│   │   │   └── register/page.tsx   # Rota de Cadastro (/auth/register)
│   │   ├── cadastro/page.tsx       # Cadastro de Criador / Marca
│   │   ├── dashboard/
│   │   │   ├── brand/page.tsx      # Alias do Painel da Marca
│   │   │   ├── creator/page.tsx    # Painel do Criador (Mídia Kit + Oportunidades)
│   │   │   ├── influencer/page.tsx # Alias do Painel do Criador
│   │   │   └── marca/page.tsx      # Painel da Marca (Métricas + Propostas)
│   │   ├── login/page.tsx          # Login com tratamento de erros Firebase
│   │   ├── profile/page.tsx        # Edição de Perfil
│   │   ├── globals.css             # Design tokens e classes utilitárias
│   │   ├── layout.tsx              # Root Layout com Providers
│   │   └── page.tsx                # Landing Page Editorial (Hero + BentoGrid + Feed)
│   ├── components/
│   │   ├── modals/
│   │   │   ├── EditMediaKitModal.tsx  # Modal para edição do Mídia Kit
│   │   │   ├── NewCampaignModal.tsx   # Modal para publicação de campanha
│   │   │   └── SendProposalModal.tsx  # Modal para envio de proposta
│   │   ├── BentoGrid.tsx           # Showcase interativo da plataforma
│   │   ├── Footer.tsx              # Rodapé editorial
│   │   ├── Navbar.tsx              # Barra de navegação reativa com estado auth
│   │   └── Providers.tsx           # Provedor global de autenticação
│   ├── context/
│   │   └── AuthContext.tsx         # Contexto reativo Firebase Auth & Firestore
│   ├── lib/
│   │   └── firebase.ts             # Inicialização do Firebase Auth e Firestore
│   ├── services/
│   │   ├── authService.ts          # Registro, Login, Logout e tratamento de erros
│   │   ├── campaignService.ts      # CRUD de campanhas no Firestore
│   │   ├── profileService.ts       # Gestão de perfis no Firestore
│   │   └── proposalService.ts      # Envio e aprovação de propostas no Firestore
│   └── types/
│       └── index.ts                # Definições TypeScript
├── .env.local                      # Variáveis de ambiente Firebase
├── package.json
└── README.md
```

---

## 🎨 5. Design System Editorial
O projeto segue uma estética editorial contemporânea inspirada em plataformas como *Layers*, *ReadCV* e *Bento.me*:
- **Background Principal:** `#FAFAF9` (Stone-50).
- **Acentos Elétricos:** `#D4FF00` (Lima 400) para CTAs de alto impacto.
- **Tipografia & Contraste:** `#1C1917` (Preto Editorial / Stone-900) com alta legibilidade.
- **Superfícies:** Cards brancos com bordas sutis `border-stone-200/90`, cantos `rounded-2xl` e elevações suaves.

---

## 🚀 6. Instalação e Execução

### 6.1 Pré-requisitos
- **Node.js:** Versão 18.17 ou superior.
- **NPM** ou **Yarn**.

### 6.2 Configuração do `.env.local`
Crie o arquivo `.env.local` na raiz do projeto com as credenciais do seu projeto Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### 6.3 Instalação das Dependências
```bash
npm install
```

### 6.4 Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no navegador.

### 6.5 Compilar para Produção (Build)
```bash
npm run build
npm run start
```

---

## 🧪 7. Testes Automatizados
O projeto conta com suite de testes unitários e de componentes via **Vitest**:

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (interativo)
npm run test:watch
```

---

## 🗺️ 8. Rotas Disponíveis

| Rota | Descrição |
|---|---|
| `/` | Landing page editorial com Hero, Showcase Bento Grid e Mural de Oportunidades |
| `/login` ou `/auth/login` | Tela de autenticação com tratamento de credenciais e redirecionamento dinâmico |
| `/cadastro` ou `/auth/register` | Onboarding com seletor de perfil (Criador vs. Marca) |
| `/dashboard/creator` ou `/dashboard/influencer` | Painel do Criador (Mídia Kit, Mural com filtros, Minhas Candidaturas) |
| `/dashboard/marca` ou `/dashboard/brand` | Painel da Marca (Métricas, Campanhas publicadas, Gestão de Propostas) |
| `/profile` | Edição completa dos dados do perfil e redes sociais |

---

## 📄 Licença
Distribuído sob licença proprietária para o projeto Startup One.
