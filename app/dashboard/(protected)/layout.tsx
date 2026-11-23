import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DASHBOARD_COOKIE, verifySession } from "@/lib/dashboard/auth";

import LogoutButton from "./LogoutButton";
import "../dashboard.css";

export const metadata: Metadata = {
  title: "Studio dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  if (!verifySession(store.get(DASHBOARD_COOKIE)?.value)) {
    redirect("/dashboard/login");
  }
  return (
    <div className="dash">
      <header className="dash-top">
        <Link href="/dashboard" className="dash-brand">
          Mohamed Hesham <span>Studio dashboard</span>
        </Link>
        <nav className="dash-nav">
          <Link href="/dashboard">Projects</Link>
          <Link href="/dashboard/preview">Preview</Link>
          <a href="/" target="_blank" rel="noreferrer">
            Live site ↗
          </a>
          <LogoutButton />
        </nav>
      </header>
      <div className="dash-body">{children}</div>
    </div>
  );
}
