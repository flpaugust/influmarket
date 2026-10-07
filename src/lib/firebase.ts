import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NODE_ENV !== "test") {
  console.warn("Variáveis de ambiente do Firebase ausentes. Configure o .env.local.");
}

const isTest = process.env.NODE_ENV === "test";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (isTest ? "mock-api-key" : ""),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (isTest ? "mock.firebaseapp.com" : ""),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (isTest ? "mock-project" : ""),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Remove recursivamente todas as propriedades com valor `undefined` de um objeto,
 * evitando erros do Firestore que rejeita campos com valor undefined.
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      item !== null && typeof item === "object" ? sanitizeForFirestore(item) : item
    ) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      // Se for nulo, mantemos como nulo
      if (value === null) {
        result[key] = null;
        continue;
      }
      
      // Checa se é um objeto plano. Objetos de classe como Date ou FieldValue têm construtores diferentes.
      const isPlainObject = typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype;

      result[key] = isPlainObject ? sanitizeForFirestore(value) : value;
    }
  }
  return result as T;
}

export default app;
