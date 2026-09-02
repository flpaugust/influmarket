"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { UserProfile, UserRole } from "@/types";
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
  RegisterData,
} from "@/services/authService";
import { updateUserProfile as apiUpdateProfile } from "@/services/profileService";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ user: FirebaseUser; profile: UserProfile | null }>;
  register: (
    email: string,
    password: string,
    role: UserRole,
    initialData?: RegisterData
  ) => Promise<{ user: FirebaseUser; profile: UserProfile }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const refreshProfile = async () => {
    if (!auth.currentUser) {
      setProfile(null);
      return;
    }
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
      }
    } catch (err) {
      console.error("Erro ao recarregar perfil:", err);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Escuta atualizações do documento de perfil em tempo real
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeDoc = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
            } else {
              setProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Erro no snapshot do perfil:", error);
            setLoading(false);
          }
        );

        return () => unsubscribeDoc();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    showToast("✨ Login realizado com sucesso!");
    return result;
  };

  const register = async (
    email: string,
    password: string,
    role: UserRole,
    initialData?: RegisterData
  ) => {
    const result = await apiRegister(email, password, role, initialData);
    showToast("🎉 Conta criada com sucesso!");
    return result;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setProfile(null);
    showToast("👋 Sessão encerrada com sucesso.");
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("Usuário não autenticado");
    await apiUpdateProfile(user.uid, data);
    showToast("✅ Perfil atualizado com sucesso!");
  };

  const role = profile?.role || null;
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        isLoggedIn,
        login,
        register,
        logout,
        updateProfile,
        toastMessage,
        showToast,
        refreshProfile,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-stone-900 text-white rounded-2xl shadow-2xl border border-stone-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-ping" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
