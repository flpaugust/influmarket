"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import NewCampaignModal from "@/components/modals/NewCampaignModal";
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
  UserCheck,
  Building2,
  LogOut,
  Plus,
  Send,
  FileText,
  User,
  MessageSquareText,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, role, isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);

  const activeRole = role || (profile?.role as string) || "INFLUENCER";

  const dashboardPath =
    activeRole === "BRAND" ? "/dashboard/marca" : "/dashboard/creator";

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const displayName =
    activeRole === "BRAND"
      ? profile?.companyName || user?.email?.split("@")[0] || "Minha Marca"
      : profile?.name || user?.email?.split("@")[0] || "Meu Perfil";

  const avatarUrl =
    activeRole === "BRAND" ? profile?.logo : profile?.avatar;

  const initialLetter = (displayName || "U").charAt(0).toUpperCase();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-stone-50/85 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center font-bold text-white text-sm transition-transform group-hover:scale-105">
                  IM
                </div>
                <span className="text-lg font-bold tracking-tight text-stone-900">
                  InfluMarket
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium text-stone-600">
              {/* Not Logged In Navigation */}
              {!isLoggedIn && (
                <>
                  <Link
                    href="/"
                    className={`whitespace-nowrap transition-colors hover:text-stone-900 ${
                      pathname === "/" ? "text-stone-900 font-semibold" : ""
                    }`}
                  >
                    Início
                  </Link>
                  <Link
                    href="/dashboard/creator"
                    className={`whitespace-nowrap transition-colors hover:text-stone-900 ${
                      pathname.includes("creator") ? "text-stone-900 font-semibold" : ""
                    }`}
                  >
                    Mural de Oportunidades
                  </Link>
                  <Link
                    href="/dashboard/marca"
                    className={`whitespace-nowrap transition-colors hover:text-stone-900 ${
                      pathname.includes("marca") ? "text-stone-900 font-semibold" : ""
                    }`}
                  >
                    Para Marcas
                  </Link>
                </>
              )}

              {/* Influencer Navigation */}
              {isLoggedIn && activeRole === "INFLUENCER" && (
                <>
                  <Link
                    href="/"
                    className={`whitespace-nowrap transition-colors hover:text-stone-900 ${
                      pathname === "/" ? "text-stone-900 font-semibold" : ""
                    }`}
                  >
                    Início (Feed de Campanhas)
                  </Link>
                  <Link
                    href="/dashboard/creator"
                    className={`whitespace-nowrap transition-colors hover:text-stone-900 ${
                      pathname === "/dashboard/creator" ? "text-stone-900 font-semibold" : ""
                    }`}
                  >
                    Minhas Propostas
                  </Link>
                  <Link
                    href="/profile"
                    className={`whitespace-nowrap transition-colors hover:text-stone-900 ${
                      pathname === "/profile" ? "text-stone-900 font-semibold" : ""
                    }`}
                  >
                    Meu Mídia Kit
                  </Link>
                </>
              )}

              {/* Brand Navigation */}
              {isLoggedIn && activeRole === "BRAND" && (
                <>
                  <Link
                    href="/"
                    className={`whitespace-nowrap transition-colors hover:text-stone-900 ${
                      pathname === "/" ? "text-stone-900 font-semibold" : ""
                    }`}
                  >
                    Início (Explorar Creators)
                  </Link>
                  <Link
                    href="/dashboard/marca?tab=campanhas"
                    className={`whitespace-nowrap transition-colors hover:text-stone-900 ${
                      pathname === "/dashboard/marca" ? "text-stone-900 font-semibold" : ""
                    }`}
                  >
                    Minhas Campanhas
                  </Link>
                  <Link
                    href="/dashboard/marca?tab=propostas"
                    className="whitespace-nowrap transition-colors hover:text-stone-900"
                  >
                    Propostas Recebidas
                  </Link>
                  <Link
                    href="/hub"
                    className={`whitespace-nowrap transition-colors hover:text-stone-900 flex items-center gap-1 ${
                      pathname === "/hub" ? "text-stone-900 font-semibold" : ""
                    }`}
                  >
                    <MessageSquareText className="w-3.5 h-3.5" />
                    Hub IA
                  </Link>
                </>
              )}
            </div>

            {/* Right Action buttons / User profile */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  {/* Brand Action: + Nova Campanha button */}
                  {activeRole === "BRAND" && (
                    <button
                      onClick={() => setIsNewCampaignModalOpen(true)}
                      className="btn-lime text-xs py-1.5 px-3 font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Nova Campanha
                    </button>
                  )}

                  {/* Role indicator pill */}
                  <span className="pill-badge pill-stone text-[11px]">
                    {activeRole === "BRAND" ? (
                      <>
                        <Building2 className="w-3 h-3" /> Marca
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3 h-3" /> Criador
                      </>
                    )}
                  </span>

                  <div className="w-px h-6 bg-stone-200" />

                  {/* Profile Link with Avatar or Initials */}
                  <Link
                    href={dashboardPath}
                    className="flex items-center gap-2 text-xs font-bold text-stone-900 hover:opacity-80 transition-opacity"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-300"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center ring-1 ring-stone-300">
                        {initialLetter}
                      </div>
                    )}
                    <span className="max-w-[120px] truncate">{displayName}</span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                    title="Sair da Conta"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* NOT LOGGED IN */
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-xs font-bold text-stone-700 hover:text-stone-950 px-3 py-2 transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    className="btn-dark text-xs py-2 px-3.5"
                  >
                    Cadastrar-se <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              className="lg:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-3">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Início
            </Link>

            {isLoggedIn ? (
              <>
                {activeRole === "INFLUENCER" ? (
                  <>
                    <Link
                      href="/dashboard/creator"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                      Minhas Propostas
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                      Meu Mídia Kit
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard/marca?tab=campanhas"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                      Minhas Campanhas
                    </Link>
                    <Link
                      href="/dashboard/marca?tab=propostas"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                      Propostas Recebidas
                    </Link>
                    <Link
                      href="/hub"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
                    >
                      <MessageSquareText className="w-4 h-4" /> Hub IA
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsNewCampaignModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-lime-900 bg-lime-50 hover:bg-lime-100 flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Nova Campanha
                    </button>
                  </>
                )}

                <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-300"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center ring-1 ring-stone-300">
                        {initialLetter}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-stone-900 block truncate">
                        {displayName}
                      </span>
                      <span className="text-xs text-stone-500">
                        {activeRole === "BRAND" ? "Conta de Marca" : "Conta de Criador"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-800 flex items-center justify-center gap-2 hover:bg-stone-50"
                  >
                    <LogOut className="w-4 h-4" /> Sair da Conta
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/creator"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  Mural de Oportunidades (Criador)
                </Link>
                <Link
                  href="/dashboard/marca"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  Dashboard da Marca
                </Link>

                <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-800"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    onClick={() => setMenuOpen(false)}
                    className="w-full btn-dark text-sm py-2.5 text-center"
                  >
                    Começar Agora
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Brand New Campaign Modal */}
      {isNewCampaignModalOpen && (
        <NewCampaignModal
          isOpen={isNewCampaignModalOpen}
          onClose={() => setIsNewCampaignModalOpen(false)}
        />
      )}
    </>
  );
}
