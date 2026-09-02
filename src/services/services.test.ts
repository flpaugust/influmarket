import { describe, it, expect } from "vitest";
import { formatAuthError, formatFriendlyError } from "./authService";

describe("Firebase Services & Helpers", () => {
  it("formata erros de autenticação do Firebase para mensagens amigáveis", () => {
    expect(formatAuthError("auth/email-already-in-use")).toBe(
      "Este e-mail já está cadastrado em outra conta."
    );
    expect(formatAuthError("auth/weak-password")).toBe(
      "A senha deve conter no mínimo 6 caracteres."
    );
    expect(formatAuthError("auth/invalid-credential")).toBe(
      "E-mail ou senha incorretos. Verifique suas credenciais."
    );
    expect(formatAuthError("auth/unknown-error")).toBe(
      "Ocorreu um erro na autenticação. Tente novamente."
    );
  });

  it("sanitiza mensagens técnicas e códigos do Firestore/Firebase com formatFriendlyError", () => {
    expect(
      formatFriendlyError(new Error("FirebaseError: Missing or insufficient permissions."))
    ).toBe("Você não possui permissão para realizar esta ação no momento.");

    expect(
      formatFriendlyError("Firebase: Error (auth/invalid-credential).")
    ).toBe("E-mail ou senha incorretos. Verifique suas credenciais.");

    expect(
      formatFriendlyError({ code: "auth/network-request-failed" })
    ).toBe("Falha de conexão com os servidores. Verifique sua internet.");

    expect(
      formatFriendlyError("Raw generic unexpected code {xyz: 123}", "Erro padrão amigável.")
    ).toBe("Erro padrão amigável.");
  });
});
