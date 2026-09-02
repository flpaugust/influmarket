import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile, UpdateProfileDTO } from "@/types";

/**
 * Retorna os dados do perfil logado do Firestore.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    uid: docSnap.id,
    ...docSnap.data(),
  } as UserProfile;
}

/**
 * Atualiza dados do criador (redes, seguidores, bio) ou da marca no Firestore.
 */
export async function updateUserProfile(
  uid: string,
  data: UpdateProfileDTO | Partial<UserProfile>
): Promise<void> {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export interface InfluencerFilterOptions {
  niche?: string;
  followerRange?: string; // "ALL" | "NANO" (10k-50k) | "MICRO" (50k-200k) | "ENTRY" (<10k)
  platform?: string; // "ALL" | "INSTAGRAM" | "TIKTOK"
  maxResults?: number;
}

/**
 * Lista influenciadores para o Marketplace de Descoberta de Criadores.
 */
export async function listInfluencers(
  options: InfluencerFilterOptions = {}
): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("role", "==", "INFLUENCER"),
      limit(options.maxResults || 50)
    );

    const querySnapshot = await getDocs(q);
    let influencers: UserProfile[] = querySnapshot.docs.map((d) => ({
      uid: d.id,
      ...d.data(),
    })) as UserProfile[];

    // Filtro por nicho
    if (options.niche && options.niche !== "TODOS") {
      influencers = influencers.filter((inf) =>
        (inf.niche || "").toLowerCase().includes(options.niche!.toLowerCase())
      );
    }

    // Filtro por faixa de seguidores
    if (options.followerRange && options.followerRange !== "ALL") {
      influencers = influencers.filter((inf) => {
        const f = Number(inf.followers || 0);
        if (options.followerRange === "ENTRY") return f < 10000;
        if (options.followerRange === "NANO") return f >= 10000 && f <= 50000;
        if (options.followerRange === "MICRO") return f > 50000;
        return true;
      });
    }

    // Filtro por rede social
    if (options.platform && options.platform !== "ALL") {
      if (options.platform === "INSTAGRAM") {
        influencers = influencers.filter((inf) => Boolean(inf.instagram));
      } else if (options.platform === "TIKTOK") {
        influencers = influencers.filter((inf) => Boolean(inf.tiktok));
      }
    }

    return influencers;
  } catch (error) {
    console.error("Erro ao listar influenciadores:", error);
    return [];
  }
}

/**
 * Retorna influenciadores em destaque para o showcase público.
 */
export async function getFeaturedInfluencers(count: number = 8): Promise<UserProfile[]> {
  return listInfluencers({ maxResults: count });
}
