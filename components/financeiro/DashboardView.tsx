"use client";

import { useEffect, useState } from "react";
import { UserRole } from "@prisma/client";

interface DashboardData {
  summary: {
    total: number;
    byStatus: Record<string, number>;
    overdue: number;
    dueSoon7: number;
    dueSoon30: number;
    pendingEmailReview: number;
  };
  generatedAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  RASCUNHO: "Rascunho",
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  PAGO: "Pago",
  ATRASADO: "Atrasado",
  CANCELADO: "Cancelado",
  SUSPENSO: "Suspenso",
};

const STATUS_COLORS: Record<string, string> = {
  RASCUNHO: "bg-gray-700 text-gray-300",
  PENDENTE: "bg-yellow-900/50 text-yellow-300",
  APROVADO: "bg-blue-900/50 text-blue-300",
  PAGO: "bg-green-900/50 text-green-300",
  ATRASADO: "bg-red-900/50 text-red-300",
  CANCELADO: "bg-gray-800 text-gray-500",
  SUSPENSO: "bg-orange-900/50 text-orange-300",
};

export default function DashboardView({ userRole, userName }: { userRole: UserRole; userName: string }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard", { credentials: "same-origin" })
      .then((r) => {
        if (!r.ok) throw new Error("Falha ao carregar dados");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error ?? "Erro desconhecido"} />;

  const { summary } = data;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Controle Financeiro</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{userName}</span>
            <RoleBadge role={userRole} />
            <a href="/api/auth/signout" className="text-sm text-gray-400 hover:text-red-400 transition-colors">
              Sair
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">
            Atualizado em {new Date(data.generatedAt).toLocaleString("pt-BR")}
          </p>
        </div>

        {/* Risk alerts */}
        {(summary.overdue > 0 || summary.pendingEmailReview > 0) && (
          <div className="mb-6 space-y-3">
            {summary.overdue > 0 && (
              <div className="flex items-center gap-3 bg-red-900/30 border border-red-700 rounded-lg px-4 py-3">
                <AlertIcon className="text-red-400 w-5 h-5 flex-shrink-0" />
                <span className="text-red-200 text-sm">
                  <strong>{summary.overdue}</strong> pagamento{summary.overdue > 1 ? "s" : ""} em atraso.
                  Ação imediata necessária.
                </span>
              </div>
            )}
            {summary.pendingEmailReview > 0 && (
              <div className="flex items-center gap-3 bg-yellow-900/30 border border-yellow-700 rounded-lg px-4 py-3">
                <MailIcon className="text-yellow-400 w-5 h-5 flex-shrink-0" />
                <span className="text-yellow-200 text-sm">
                  <strong>{summary.pendingEmailReview}</strong> e-mail{summary.pendingEmailReview > 1 ? "s" : ""} aguardando revisão manual.
                </span>
              </div>
            )}
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Total de Pagamentos" value={summary.total} color="blue" />
          <KpiCard label="Vencem em 7 dias" value={summary.dueSoon7} color="yellow" />
          <KpiCard label="Vencem em 30 dias" value={summary.dueSoon30} color="purple" />
          <KpiCard label="Em Atraso" value={summary.overdue} color="red" />
        </div>

        {/* Status breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-200 mb-4">Status dos Pagamentos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.entries(summary.byStatus).map(([status, count]) => (
              <div key={status} className={`rounded-lg px-3 py-3 ${STATUS_COLORS[status] ?? "bg-gray-800"}`}>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs mt-0.5 opacity-75">{STATUS_LABELS[status] ?? status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/financeiro/pagamentos" className="bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl p-5 transition-colors group">
            <div className="text-blue-400 mb-2">
              <ListIcon className="w-6 h-6" />
            </div>
            <div className="font-medium text-white group-hover:text-blue-300">Ver Pagamentos</div>
            <div className="text-xs text-gray-500 mt-1">Gerenciar todos os pagamentos</div>
          </a>
          {(userRole === UserRole.ADMIN || userRole === UserRole.FINANCEIRO) && (
            <a href="/financeiro/pagamentos/novo" className="bg-gray-900 border border-gray-800 hover:border-green-600 rounded-xl p-5 transition-colors group">
              <div className="text-green-400 mb-2">
                <PlusIcon className="w-6 h-6" />
              </div>
              <div className="font-medium text-white group-hover:text-green-300">Novo Pagamento</div>
              <div className="text-xs text-gray-500 mt-1">Cadastrar pagamento manual</div>
            </a>
          )}
          {userRole === UserRole.ADMIN && (
            <a href="/financeiro/auditoria" className="bg-gray-900 border border-gray-800 hover:border-purple-600 rounded-xl p-5 transition-colors group">
              <div className="text-purple-400 mb-2">
                <ShieldIcon className="w-6 h-6" />
              </div>
              <div className="font-medium text-white group-hover:text-purple-300">Trilha de Auditoria</div>
              <div className="text-xs text-gray-500 mt-1">Histórico completo de ações</div>
            </a>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function KpiCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    purple: "text-purple-400",
    red: "text-red-400",
  };
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className={`text-3xl font-bold ${colors[color]}`}>{value}</div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, { label: string; cls: string }> = {
    ADMIN: { label: "Admin", cls: "bg-red-900/50 text-red-300" },
    FINANCEIRO: { label: "Financeiro", cls: "bg-blue-900/50 text-blue-300" },
    APROVADOR: { label: "Aprovador", cls: "bg-yellow-900/50 text-yellow-300" },
    CONSULTA: { label: "Consulta", cls: "bg-gray-800 text-gray-400" },
  };
  const { label, cls } = map[role];
  return <span className={`text-xs px-2 py-0.5 rounded font-medium ${cls}`}>{label}</span>;
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400 animate-pulse">Carregando...</div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-6 py-4">{message}</div>
    </div>
  );
}

// Minimal inline SVG icons (no external CDN = CSP compliant)
const AlertIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const MailIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const ListIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const PlusIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const ShieldIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
