"use client";

/**
 * Hub Conversacional — Interface de Chat com IA
 *
 * Página de interação conversacional onde a marca (PME) cria campanhas
 * de marketing de influência usando linguagem natural processada pelo
 * Google Gemini no backend.
 *
 * Princípios de Segurança Aplicados:
 * - LGPD (Minimização de Dados): Apenas brandId e brandName são enviados
 *   ao backend. Dados sensíveis do perfil não transitam na requisição.
 * - OWASP A01 (Broken Access Control): Route protection por papel (BRAND).
 * - Client-side: Validação de tamanho de input e sanitização visual.
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  campaignCreated?: boolean;
  campaignId?: string;
  timestamp: Date;
}

interface ApiResponse {
  reply: string;
  campaignCreated?: boolean;
  campaignId?: string;
}

interface ApiErrorResponse {
  error: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const MAX_MESSAGE_LENGTH = 5000;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "model",
  text: "Olá! 👋 Sou o assistente inteligente da **InfluMarket**. Posso te ajudar a criar campanhas de marketing de influência de forma rápida e conversacional.\n\nMe diga o **nicho** e o **orçamento** e eu cuido do resto! Por exemplo:\n\n> _\"Quero criar uma campanha de tecnologia e pago 800 reais.\"_",
  timestamp: new Date(),
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function HubPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll para a última mensagem
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Route protection: apenas BRAND pode acessar o Hub
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (profile?.role !== "BRAND") {
        router.push("/");
      } else {
        inputRef.current?.focus();
      }
    }
  }, [authLoading, user, profile, router]);

  // ── Envio de mensagem ────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();

      if (!user || !profile) return;

      const trimmed = input.trim();
      if (!trimmed || isLoading) return;

      // Validação client-side de tamanho
      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        const errorMsg: ChatMessage = {
          id: generateId(),
          role: "model",
          text: `⚠️ Mensagem excede o limite de ${MAX_MESSAGE_LENGTH} caracteres. Por favor, reduza o texto.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        text: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      // Monta o payload com histórico (excluindo a welcome message)
      // LGPD — Minimização: Apenas brandId e brandName transitam.
      // Dados como logo, industry, email e followers NÃO são enviados.
      const historyForApi = [
        ...messages.filter((m) => m.id !== "welcome"),
        userMessage,
      ].map((m) => ({ role: m.role, text: m.text }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: historyForApi,
            brandId: user.uid,
            brandName: profile?.companyName || "Marca Parceira",
          }),
        });

        if (!res.ok) {
          const errorData = (await res.json()) as ApiErrorResponse;
          throw new Error(errorData.error || `Erro HTTP ${res.status}`);
        }

        const data = (await res.json()) as ApiResponse;

        const botMessage: ChatMessage = {
          id: generateId(),
          role: "model",
          text: data.reply,
          campaignCreated: data.campaignCreated,
          campaignId: data.campaignId,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (error: unknown) {
        const errorText =
          error instanceof Error
            ? error.message
            : "Algo deu errado. Tente novamente.";

        const errorMessage: ChatMessage = {
          id: generateId(),
          role: "model",
          text: `⚠️ ${errorText}`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, isLoading, messages, user, profile]
  );

  // Enter para enviar, Shift+Enter para nova linha
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // ── Auth guard (depois de todos os hooks) ─────────────────────────────────────

  if (authLoading || !user || profile?.role !== "BRAND") {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-lime-500" />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen pt-16 bg-stone-50">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between gap-3 px-5 py-4 bg-white border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-stone-900">
              <Sparkles className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-stone-900 leading-tight">
                InfluMarket Hub
              </h1>
              <p className="text-xs text-stone-500">
                Assistente conversacional para criação de campanhas
              </p>
            </div>
          </div>

          {/* Indicador de segurança */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">Conexão Protegida</span>
          </div>
        </header>

        {/* ── Messages Area ───────────────────────────────────────────────── */}
        <main
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
          role="log"
          aria-label="Histórico de mensagens do chat"
          aria-live="polite"
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </main>

        {/* ── Input Area ──────────────────────────────────────────────────── */}
        <footer className="shrink-0 border-t border-stone-200 bg-white px-4 py-3">
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-3 max-w-3xl mx-auto"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Descreva a campanha que deseja criar..."
                disabled={isLoading}
                rows={1}
                maxLength={MAX_MESSAGE_LENGTH}
                className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 pr-16 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all disabled:opacity-50"
                style={{ maxHeight: "120px" }}
                aria-label="Campo de mensagem"
              />
              {/* Contador de caracteres */}
              {input.length > MAX_MESSAGE_LENGTH * 0.8 && (
                <span
                  className={`absolute right-3 bottom-3 text-[10px] font-medium ${
                    input.length > MAX_MESSAGE_LENGTH
                      ? "text-red-500"
                      : "text-stone-400"
                  }`}
                >
                  {input.length}/{MAX_MESSAGE_LENGTH}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || input.length > MAX_MESSAGE_LENGTH}
              className="flex items-center justify-center w-11 h-11 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label="Enviar mensagem"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          <p className="text-center text-[10px] text-stone-400 mt-2 max-w-3xl mx-auto">
            Dados processados em conformidade com a LGPD. Apenas informações
            necessárias para criação de campanhas são transmitidas.
          </p>
        </footer>
      </div>
    </>
  );
}

// ── Sub-Components ─────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} max-w-3xl mx-auto`}
    >
      <div
        className={`flex gap-2.5 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        {!isUser && (
          <div className="flex items-start shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-stone-900">
              <Bot className="w-4 h-4 text-lime-400" />
            </div>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-stone-900 text-white rounded-br-md"
              : "bg-white border border-stone-200 text-stone-800 rounded-bl-md shadow-sm"
          }`}
        >
          {/* Renderiza markdown básico (bold) */}
          <span
            dangerouslySetInnerHTML={{
              __html: formatMessage(message.text),
            }}
          />

          {/* Banner de campanha criada */}
          {message.campaignCreated && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-200/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs font-medium text-emerald-600">
                Campanha gravada com segurança — ID: {message.campaignId}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      className="flex justify-start max-w-3xl mx-auto"
      role="status"
      aria-label="Assistente está digitando"
    >
      <div className="flex gap-2.5">
        <div className="flex items-start shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-stone-900">
            <Bot className="w-4 h-4 text-lime-400" />
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Formatação simples de markdown ─────────────────────────────────────────────

function formatMessage(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(
      /^&gt;\s*(.+)$/gm,
      '<span class="text-stone-500 italic pl-3 border-l-2 border-stone-300 block my-1">$1</span>'
    )
    .replace(/\n/g, "<br />");
}
