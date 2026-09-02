# Diretrizes de Engenharia de Software e Boas Práticas

Este documento estabelece as diretrizes arquiteturais, padrões de código, segurança e convenções de desenvolvimento obrigatórias para o projeto.

---

## 1. Arquitetura e Separação de Responsabilidades (SoC)

A aplicação segue uma arquitetura em camadas desacoplada:

```text
src/
├── app/          # Camada de Apresentação (Rotas, Layouts, Server/Client Pages)
├── components/   # Camada Visual Reutilizável (Dumb/Presentational Components)
├── hooks/        # Camada de Orquestração e Estado de UI (Stateful Logic)
├── services/     # Camada de Integração / Repositórios (Firebase/Cloud SDK)
├── types/        # Camada de Domínio e Contratos de Dados (Interfaces/DTOs)
└── lib/          # Configurações de Terceiros e Utilitários Puros
```

### Regras de Dependência:
- **Componentes visuais (`components/ui`):** Não devem importar instâncias do Firebase (`db`, `auth`) nem executar consultas diretamente ao banco. Toda obtenção e escrita de dados passa por Custom Hooks ou Services.
- **Serviços (`services/`):** Devem ser agnósticos à UI. Não utilizam hooks do React (`useState`, `useEffect`) nem manipulam elementos do DOM.
- **Tratamento de Dados:** Dados vindos do Firestore devem ser convertidos para entidades de domínio antes de alcançar a camada de visualização.

---

## 2. Padrões de TypeScript e Tipagem Estrita

- **Proibição do tipo `any`:** Todo dado que transita pela aplicação deve ser estritamente tipado. Em casos de incerteza temporária, utilize `unknown` com *type guards*.
- **Contratos e DTOs (Data Transfer Objects):**
  - Entidades de banco utilizam sufixo ou interfaces claras (ex: `Campaign`, `Proposal`).
  - Criação e atualização utilizam utilitários como `Omit`, `Pick` ou tipos dedicados (`CreateCampaignDTO`, `UpdateProfileDTO`).
- **Unions Discriminadas:** Utilize unions literais para estados finitos em vez de strings genéricas:
  ```typescript
  export type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
  export type UserRole = 'INFLUENCER' | 'BRAND';
  export type CampaignStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  ```
- **Retorno Padronizado de Serviços (`Result Pattern`):**
  ```typescript
  export type ServiceResult<T> = 
    | { success: true; data: T }
    | { success: false; error: string };
  ```

---

## 3. Padrões de Componentização e UI/UX

- **Princípio da Responsabilidade Única (SRP):** Cada componente deve resolver apenas uma função visual. Componentes com mais de 150 linhas devem ser decompostos em subcomponentes.
- **Tratamento Obrigatório dos Três Estados Visuais (Three-State Rule):**
  Toda tela ou componente assíncrono deve implementar explicitamente:
  1. **Loading State:** Skeletons de carregamento correspondentes à estrutura final ou spinners não intrusivos.
  2. **Empty State:** Interface visual informativa indicando ausência de dados (ex: "Nenhuma proposta recebida"), com botão de ação (CTA).
  3. **Error State:** Feedback visual claro do erro com mecanismo de reteste (*retry*).
- **Acessibilidade e Semântica:** Uso correto de tags HTML5 (`<main>`, `<nav>`, `<header>`, `<article>`, `<section>`), atributos `aria-label` em botões de ícone e navegação por teclado.

---

## 4. Integração com Banco de Dados e Firebase

- **Isolamento do SDK:** Todas as interações com Firestore e Authentication devem ficar contidas em `src/services/`.
- **Tratamento de Exceções:** Todos os métodos assíncronos que tocam a rede ou o banco devem encapsular a execução em blocos `try/catch`, transformando códigos de erro técnicos em mensagens compreensíveis.
- **Paginação e Limites:** Consultas no Firestore devem aplicar limites explícitos de documentos (`limit()`) e filtros indexados para evitar custos desnecessários e degradação de performance.
- **Timestamps:** Persistir datas no Firestore utilizando `serverTimestamp()` ou `Timestamp.now()`, convertendo para objetos `Date` nativos na camada de serviço.

---

## 5. Segurança e Variáveis de Ambiente

- **Proteção de Segredos:** Arquivos `.env.local` e credenciais jamais devem ser commitados no controle de versão. Mantenha um arquivo `.env.example` atualizado com a lista de variáveis necessárias.
- **Validação no Cliente e no Servidor:** Valide todos os campos de formulário antes do envio (tamanho, formato de e-mail, tipos numéricos para orçamento e seguidores).
- **Regras de Firestore (Firestore Security Rules):** O acesso a documentos em produção deve validar o `request.auth.uid` correspondente para impedir que um usuário edite perfis ou delete campanhas de terceiros.

---

## 6. Convenções de Nomenclatura e Código Limpo

- **Arquivos e Pastas:**
  - Componentes React: `PascalCase.tsx` (ex: `CampaignCard.tsx`).
  - Hooks: `camelCase.ts` com prefixo `use` (ex: `useCampaigns.ts`).
  - Serviços e Utilitários: `camelCase.ts` (ex: `campaignService.ts`, `formatters.ts`).
  - Tipos e Interfaces: `camelCase.ts` (ex: `campaign.ts`).
- **Funções e Variáveis:**
  - Funções de ação: Verbo + Substantivo (`handleSubmitProposal`, `fetchBrandCampaigns`).
  - Variáveis booleanas: Prefixos afirmativos (`isLoading`, `hasError`, `isOpen`, `isAuthenticated`).
- **Clean Code:**
  - Priorize retornos antecipados (*Early Returns*) para evitar aninhamento excessivo de blocos `if/else`.
  - Evite "números mágicos"; defina constantes descritivas.

---

## 7. Padronização de Commits (Conventional Commits)

Os commits no repositório devem seguir a especificação:

| Prefixo | Finalidade | Exemplo |
| :--- | :--- | :--- |
| `feat` | Nova funcionalidade para o usuário | `feat(campaign): add filter by niche in marketplace` |
| `fix` | Correção de bug | `fix(auth): handle expired token redirect correctly` |
| `refactor` | Refatoração de código sem alterar comportamento | `refactor(services): extract Firestore mapping to helper` |
| `style` | Ajustes visuais, CSS ou formatação | `style(landing): update hero section typography and paddings` |
| `chore` | Manutenção de dependências e configurações | `chore: configure firebase sdk and env variables` |
| `docs` | Alterações na documentação | `docs: add software engineering best practices guide` |