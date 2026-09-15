import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, sanitizeForFirestore } from "@/lib/firebase";
import { UserProfile, UserRole } from "@/types";

export interface RegisterData {
  name?: string;
  handle?: string;
  companyName?: string;
  industry?: string;
  niche?: string;
  bio?: string;
  followers?: number;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  avatar?: string;
  logo?: string;
}

/**
 * Sanitiza e traduz qualquer erro do Firebase ou da aplicação em uma mensagem
 * amigável para o usuário, NUNCA exibindo códigos técnicos ou stack traces.
 */
export function formatFriendlyError(
  err: unknown,
  defaultMsg: string = "Ocorreu um erro ao processar sua solicitação. Tente novamente."
): string {
  if (!err) return defaultMsg;

  const raw =
    typeof err === "string"
      ? err
      : (err as any)?.code || (err as any)?.message || String(err);

  const lower = String(raw).toLowerCase();

  if (
    lower.includes("invalid-credential") ||
    lower.includes("wrong-password") ||
    lower.includes("user-not-found") ||
    lower.includes("auth/invalid-credential")
  ) {
    return "E-mail ou senha incorretos. Verifique suas credenciais.";
  }

  if (lower.includes("email-already-in-use") || lower.includes("auth/email-already-in-use")) {
    return "Este e-mail já está cadastrado em outra conta.";
  }

  if (lower.includes("invalid-email") || lower.includes("auth/invalid-email")) {
    return "Endereço de e-mail inválido.";
  }

  if (lower.includes("weak-password") || lower.includes("auth/weak-password")) {
    return "A senha deve conter no mínimo 6 caracteres.";
  }

  if (lower.includes("permission-denied") || lower.includes("insufficient permissions")) {
    return "Você não possui permissão para realizar esta ação no momento.";
  }

  if (
    lower.includes("network-request-failed") ||
    lower.includes("unavailable") ||
    lower.includes("failed-precondition")
  ) {
    return "Falha de conexão com os servidores. Verifique sua internet.";
  }

  if (lower.includes("user-disabled") || lower.includes("auth/user-disabled")) {
    return "Esta conta de usuário foi desativada.";
  }

  // Se for uma mensagem customizada limpa sem termos técnicos em inglês
  if (
    typeof raw === "string" &&
    !raw.includes("Firebase") &&
    !raw.includes("auth/") &&
    !raw.includes("firestore/") &&
    !raw.includes("Error:") &&
    !raw.includes("{") &&
    !raw.includes("}")
  ) {
    return raw;
  }

  return defaultMsg;
}

export function formatAuthError(errorCode: string): string {
  return formatFriendlyError(errorCode, "Ocorreu um erro na autenticação. Tente novamente.");
}

/**
 * Cria conta no Firebase Auth e cria o documento do usuário em `users/{uid}` no Cloud Firestore.
 */
export async function registerUser(
  email: string,
  password: string,
  role: UserRole,
  initialData: RegisterData = {}
): Promise<{ user: FirebaseUser; profile: UserProfile }> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userDocRef = doc(db, "users", user.uid);
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email || email,
    role,
    name: initialData.name || (role === "INFLUENCER" ? "Novo Criador" : "Responsável"),
    handle: initialData.handle || (role === "INFLUENCER" ? `@creator_${user.uid.slice(0, 5)}` : undefined),
    companyName: initialData.companyName || (role === "BRAND" ? "Nova Marca" : undefined),
    industry: initialData.industry || (role === "BRAND" ? "Geral" : undefined),
    niche: initialData.niche || "Geral",
    followers: initialData.followers ?? 0,
    engagementRate: 0,
    reach: 0,
    bio: initialData.bio || (role === "INFLUENCER" ? "Criador de Conteúdo" : "Empresa parceira"),
    instagram: initialData.instagram,
    tiktok: initialData.tiktok,
    youtube: initialData.youtube,
    avatar: initialData.avatar,
    logo: initialData.logo,
    createdAt: new Date().toISOString(),
  };

  await setDoc(userDocRef, sanitizeForFirestore(userProfile));

  return { user, profile: userProfile };
}

/**
 * Autentica usuário existente e busca seu perfil correspondente.
 */
export async function loginUser(
  email: string,
  pass: string
): Promise<{ user: FirebaseUser; profile: UserProfile | null }> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  // Busca dados de perfil
  const userDocRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    return { user, profile: null };
  }

  const profile = {
    uid: docSnap.id,
    ...docSnap.data(),
  } as UserProfile;

  return { user, profile };
}

/**
 * Realiza logout do usuário.
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}
