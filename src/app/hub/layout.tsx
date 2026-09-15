import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hub Conversacional — InfluMarket",
  description:
    "Crie campanhas de marketing de influência usando linguagem natural. O assistente inteligente da InfluMarket extrai os dados e grava sua campanha automaticamente.",
};

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
