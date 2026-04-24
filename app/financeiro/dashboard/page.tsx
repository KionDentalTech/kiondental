import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/rbac";
import { UserRole } from "@prisma/client";
import DashboardView from "@/components/financeiro/DashboardView";

export const metadata = { title: "Dashboard — Controle Financeiro" };

// Force no caching for sensitive financial data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/financeiro/login");
  if (!hasPermission(session.user.role as UserRole, "dashboard:read")) {
    redirect("/financeiro/acesso-negado");
  }

  return <DashboardView userRole={session.user.role as UserRole} userName={session.user.name ?? ""} />;
}
