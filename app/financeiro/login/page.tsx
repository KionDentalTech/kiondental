"use client";

/**
 * Login page with MFA support.
 * Security: no autocomplete on TOTP, error messages generic to prevent enumeration.
 */

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/financeiro/dashboard";

  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      totpCode: step === "mfa" ? totpCode : undefined,
      redirect: false,
    });

    setLoading(false);

    if (!result) {
      setError("Erro inesperado. Tente novamente.");
      return;
    }

    if (result.error === "MFA_REQUIRED") {
      setStep("mfa");
      return;
    }

    if (result.error) {
      // Generic message — prevents user enumeration and brute force intelligence
      setError("Credenciais inválidas ou conta bloqueada.");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Controle Financeiro</h1>
            <p className="text-gray-400 text-sm mt-1">
              {step === "credentials" ? "Acesse sua conta" : "Autenticação de dois fatores"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {step === "credentials" ? (
              <>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm text-gray-300 mb-1.5 font-medium">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="seu@email.com"
                    maxLength={255}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm text-gray-300 mb-1.5 font-medium">
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="••••••••••••"
                    maxLength={128}
                  />
                </div>
              </>
            ) : (
              <div className="mb-6">
                <label htmlFor="totp" className="block text-sm text-gray-300 mb-1.5 font-medium">
                  Código de verificação (Autenticador)
                </label>
                <input
                  id="totp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  autoComplete="one-time-code"
                  autoFocus
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-center text-2xl tracking-[0.5em] placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="000000"
                  maxLength={6}
                />
                <p className="text-gray-500 text-xs mt-2 text-center">
                  Digite o código de 6 dígitos do seu aplicativo autenticador
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 transition-colors"
            >
              {loading ? "Verificando..." : step === "credentials" ? "Entrar" : "Verificar"}
            </button>

            {step === "mfa" && (
              <button
                type="button"
                onClick={() => { setStep("credentials"); setTotpCode(""); setError(null); }}
                className="w-full mt-3 text-gray-400 hover:text-gray-300 text-sm"
              >
                ← Voltar
              </button>
            )}
          </form>

          <p className="text-center text-gray-600 text-xs mt-6">
            Acesso restrito. Somente usuários autorizados.
          </p>
        </div>
      </div>
    </div>
  );
}
