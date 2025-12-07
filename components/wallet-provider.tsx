"use client";
import { createContext, useContext, ReactNode } from "react";
import { useWallet } from "@/hooks/use-wallet";

import { WalletState } from "@/types";

type WalletContextType = ReturnType<typeof useWallet>;

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
}
