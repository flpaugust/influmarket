/**
 * Firebase Admin SDK — Inicialização Server-Side
 *
 * Responsável por fornecer acesso autenticado ao Firestore a partir de
 * Route Handlers e Server Actions, executando com credenciais de serviço
 * que bypassam as Firestore Security Rules de forma segura.
 *
 * IMPORTANTE: Este módulo NÃO deve ser importado em componentes client-side.
 * Ele é exclusivo para a camada de API Routes (server-side) do Next.js.
 *
 * Referências de Segurança:
 * - OWASP A01:2021 (Broken Access Control): Gravações críticas passam por
 *   este SDK validado no backend, não pelo SDK client-side.
 * - ISO/IEC 27002 – Controle de Acesso: Credenciais do Service Account
 *   são isoladas em variáveis de ambiente e jamais expostas ao cliente.
 */

import {
  initializeApp,
  cert,
  getApps,
  getApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Inicializa ou reutiliza a instância do Firebase Admin App.
 * Utiliza variáveis de ambiente para as credenciais do Service Account.
 *
 * Variáveis necessárias:
 * - FIREBASE_ADMIN_PROJECT_ID (fallback: NEXT_PUBLIC_FIREBASE_PROJECT_ID)
 * - FIREBASE_ADMIN_CLIENT_EMAIL
 * - FIREBASE_ADMIN_PRIVATE_KEY (com \\n escapados)
 */
function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawPrivateKey) {
    throw new Error(
      "[firebase-admin] Credenciais ausentes. Configure as variáveis de ambiente: " +
        "FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL e FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  // A private key vem com \\n literais do .env — precisa converter para newlines reais
  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

/** Singleton do Firestore Admin — lazy-initialized */
let _adminDb: Firestore | null = null;

/**
 * Retorna a instância singleton do Firestore via Firebase Admin SDK.
 * Usa inicialização lazy para evitar erros se as credenciais não estiverem
 * configuradas e o módulo for apenas importado sem uso.
 */
export function getAdminDb(): Firestore {
  if (!_adminDb) {
    const app = getAdminApp();
    _adminDb = getFirestore(app);
  }
  return _adminDb;
}
