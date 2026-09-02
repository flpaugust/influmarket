# Prompt: Front-End & UI/UX - Plataforma Matchmaking Influenciadores & Marcas

Você é um Engenheiro Front-End Especialista em UI/UX e Design System para a Creator Economy.
Sua missão é construir **exclusivamente a interface visual (Front-end completo)** de uma plataforma web moderna que conecta micro/nano influenciadores a marcas (PMEs). 

A aplicação deve operar inteiramente no client-side com **mock data interativo** (sem dependência de back-end ou banco de dados neste momento), garantindo navegação fluida, formulários funcionais com estados de tela e zero estética genérica de IA.

---

### 1. DIRETRIZES DE DESIGN E ESTÉTICA
- **Estilo Visual:** Editorial contemporâneo, inspirado em plataformas como *Layers*, *ReadCV* e *Bento.me*.
- **Paleta de Cores:**
  - Fundo principal: Off-white / Stone (`bg-stone-50` / `bg-[#FAFAF9]`).
  - Superfícies/Cards: Branco puro (`bg-white`) com bordas suaves (`border border-stone-200/80`).
  - Textos: Alto contraste em Stone escuro (`text-stone-900` para títulos, `text-stone-500` para legendas).
  - Cor de Ação/Destaque: Lima elétrico (`#D4FF00` ou `bg-lime-400` com texto escuro) ou Preto puro (`bg-stone-900` com texto branco).
- **Tipografia:** Hierarquia forte com títulos marcantes (ex: *Syne*, *Plus Jakarta Sans* ou *Clash Display*) e corpo neutro legível (*Geist*, *Inter* ou *DM Sans*).
- **Componentes:** Bento Grids, pílulas de status sutis, avatares elegantes, cards de mídia kit e transições suaves de hover (`transition-all duration-200 hover:-translate-y-0.5`).

---

### 2. STACK TÉCNICA (FRONT-END ONLY)
- **Framework:** Next.js (App Router) ou React + Vite com TypeScript.
- **Estilização:** Tailwind CSS.
- **Ícones:** Lucide React (`lucide-react`).
- **Estado Local / Mock:** React `useState` / `useReducer` com dados simulados ricos para simular toda a jornada do usuário.

---

### 3. TELAS E COMPONENTES A CONSTRUIR

#### A. Landing Page (`/`)
- **Header:** Logo tipográfico moderno, links de âncora e botões "Entrar" e "Começar Agora".
- **Hero Section:** Headline de impacto, subheadline contextual, badge com indicador ao vivo ("+1.200 creators ativos") e CTA duplo ("Sou Creator" / "Sou Marca").
- **Showcase Interativo (Bento Grid):**
  - Card 1: Visualizador de Mini Mídia Kit dinâmico com métricas de alcance e engajamento.
  - Card 2: Exemplo de card de campanha de marca com orçamento visível.
  - Card 3: Fluxo de proposta e segurança de pagamento simplificado.
- **Mural de Demonstração:** Carrossel/grade com creators e marcas em destaque.
- **Footer:** Links de navegação, termos, copyright e visual minimalista.

#### B. Autenticação & Onboarding (`/login` e `/cadastro`)
- Tela de autenticação unificada com visual dividido (lado esquerdo com manifesto/depoimento de creator; lado direito com formulário limpo).
- Seletor de Role interativo: Botões para alternar entre perfil **"Criador"** e **"Marca"**.
- Simulação de login que redireciona automaticamente para o dashboard respectivo.

#### C. Dashboard da Marca (`/dashboard/marca`)
- **Barra de Navegação Superior:** Identificação da marca, saldo de orçamento e botão de criar campanha.
- **Overview de Métricas:** Cards compactos com contadores (Campanhas Ativas, Propostas Recebidas, Taxa de Match).
- **Modal "Nova Campanha":** Formulário interativo (Título da Campanha, Nicho, Orçamento em R$, Descrição dos Entregáveis).
- **Lista de Campanhas Criadas:**
  - Cards com status (`Aberta`, `Em Andamento`, `Concluída`).
  - Painel expansível ao clicar na campanha: lista de influenciadores que enviaram proposta, exibindo foto, nicho, métricas e botões de ação interativos (**Aceitar Proposta** / **Recusar** com atualização visual imediata do status).

#### D. Dashboard do Influenciador (`/dashboard/creator`)
- **Card de Mídia Kit (Painel Lateral/Topo):** 
  - Nome, avatar, nicho (ex: "Tech & Lifestyle"), contadores de seguidores, taxa média de engajamento e links clicáveis de redes.
  - Botão "Editar Mídia Kit" (com modal para alterar dados mockados).
- **Aba "Mural de Oportunidades":**
  - Filtros rápidos por nicho (Moda, Tech, Fitness, Gastronomia, Games) e faixa de orçamento.
  - Cards de campanhas disponíveis com valor da parceria em destaque e botão **"Enviar Proposta"**.
- **Modal de Envio de Proposta:** Campo de texto para mensagem/pitch para a marca e botão de envio com animação de feedback (toast/alerta de sucesso).
- **Aba "Minhas Candidaturas":** Tabela/lista com o histórico de propostas enviadas e badges de status dinâmicas (`Pendente`, `Aceita`, `Recusada`).

---

### 4. DADOS MOCKADOS INICIAIS
Inclua uma estrutura de dados inicial rica contendo:
- 4 perfis de influenciadores de nichos variados com métricas realistas (alcance, seguidores de 15k a 120k, engajamento de 3.5% a 7.2%).
- 3 campanhas abertas por marcas reais fictícias com orçamentos definidos (ex: R$ 800,00 a R$ 3.500,00).
- 2 propostas pré-populadas para testar a aprovação/recusa imediatamente na interface.

---

### 5. REQUISITOS DE ENTREGA
1. Código limpo, componentizado, com tipagem TypeScript completa para as entidades (`Influencer`, `Brand`, `Campaign`, `Proposal`).
2. Sem placeholders de layout quebrados ou textos `Lorem Ipsum` genéricos.
3. Totalmente responsivo para telas desktop, tablets e smartphones.