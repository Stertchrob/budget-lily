"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import BrandLogo from "./BrandLogo";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/uploads", label: "Uploads" },
  { href: "/transactions", label: "Transactions" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  function linkClass(href) {
    const active = pathname === href;
    return [
      "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 sm:px-4",
      active
        ? "bg-white text-[#1d1d1f] shadow-[0_6px_20px_rgba(15,23,42,0.08)]"
        : "text-[#6e6e73] hover:bg-white/70 hover:text-[#1d1d1f]",
    ].join(" ");
  }

  return (
    <nav className="sticky top-0 z-50 mx-auto flex w-full max-w-7xl flex-col items-stretch gap-3 rounded-[28px] border border-white/70 bg-[rgba(250,250,252,0.72)] px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <Link href={user ? "/dashboard" : "/login"} className="flex min-w-0 items-center justify-center gap-3 rounded-full px-2 py-1 transition hover:bg-white/60 md:justify-start">
        <div className="rounded-2xl bg-white/90 p-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
          <BrandLogo size={48} className="rounded-xl sm:h-14 sm:w-14" />
        </div>
        <div className="hidden sm:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Budget</p>
          <p className="text-sm font-semibold tracking-tight text-[#1d1d1f]">Lily</p>
        </div>
      </Link>
      {!loading && (
        <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-2 rounded-[24px] border border-white/80 bg-[#f3f4f7]/90 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] md:w-auto md:max-w-full md:justify-end">
          {user ? (
            <>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass(link.href)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={signOut}
                className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-[#6e6e73] transition-all duration-200 hover:bg-white/70 hover:text-[#1d1d1f] sm:px-4"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>Sign in</Link>
              <Link href="/register" className={linkClass("/register")}>Create account</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
