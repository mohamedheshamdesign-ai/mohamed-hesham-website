import type { Metadata } from "next";

import LoginForm from "./LoginForm";
import "../dashboard.css";

export const metadata: Metadata = {
  title: "Studio dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLoginPage() {
  return (
    <div className="dash dash-login">
      <div className="dash-login-card">
        <p className="dash-eyebrow">MOHAMED HESHAM</p>
        <h1>Studio dashboard</h1>
        <p className="dash-muted">
          Private area for managing your portfolio. Enter your dashboard
          password to continue.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
