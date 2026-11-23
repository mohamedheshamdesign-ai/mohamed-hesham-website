"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/dashboard/logout", { method: "POST" });
    window.location.href = "/dashboard/login";
  }
  return (
    <button type="button" onClick={logout} className="dash-link-button">
      Sign out
    </button>
  );
}
