"use client";

import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

/**
 * Legacy compatibility context.
 * The application has been fully migrated to AuthContext and Firebase Cloud Firestore services.
 */
const MockDataContext = createContext<any>(null);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return (
    <MockDataContext.Provider value={auth}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  return useAuth();
}
