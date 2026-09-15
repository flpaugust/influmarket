"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bot, Send, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
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

// ── Helpers ────────────────────────────────────────────────────────────────────

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

  // Route protection & focus
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

  if (authLoading || !user || profile?.role !== "BRAND") {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-lime-500" />
      </div>
    );
  }

  // ── Envio de mensagem ────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();

      const trimmed = input.trim();
      if (!trimmed || isLoading) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        text: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      // Monta o payload com todo o histórico (excluindo a welcome message)
      const historyForApi = [...messages.filter((m) => m.id !== "welcome"), userMessage].map(
        (m) => ({ role: m.role, text: m.text })
      );

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyForApi }),
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
    [input, isLoading, messages]
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

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen pt-16 bg-stone-50">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-5 py-4 bg-white border-b border-stone-200 shrink-0">
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
      </header>

      {/* ── Messages Area ───────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </main>

      {/* ── Input Area ──────────────────────────────────────────────────────── */}
      <footer className="shrink-0 border-t border-stone-200 bg-white px-4 py-3">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-3 max-w-3xl mx-auto"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva a campanha que deseja criar..."
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all disabled:opacity-50"
            style={{ maxHeight: "120px" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
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
      <div className={`flex gap-2.5 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
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
                Campanha gravada — ID: {message.campaignId}
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
    <div className="flex justify-start max-w-3xl mx-auto">
      <div className="flex gap-2.5">
        <div className="flex items-start shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-stone-900">
            <Bot className="w-4 h-4 text-lime-400" />
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
    .replace(/^&gt;\s*(.+)$/gm, '<span class="text-stone-500 italic pl-3 border-l-2 border-stone-300 block my-1">$1</span>')
    .replace(/\n/g, "<br />");
}
