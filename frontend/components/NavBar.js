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
  const { user, loading, isDemo, signOut } = useAuth();

  function linkClass(href) {
    const active = pathname === href;
    return [
      "w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
      active
        ? "bg-white text-[#1d1d1f] shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
        : "text-[#6e6e73] hover:bg-white/70 hover:text-[#1d1d1f]",
    ].join(" ");
  }

  return (
    <nav className="flex h-full w-full flex-col gap-4 rounded-[28px] border border-white/70 bg-[rgba(250,250,252,0.72)] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <Link href={user ? "/dashboard" : "/login"} className="flex min-w-0 items-center justify-center rounded-[24px] px-3 py-3 transition hover:bg-white/60">
        <div className="rounded-2xl bg-white/90 p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
          <BrandLogo size={56} className="rounded-xl" />
        </div>
      </Link>
      {!loading && (
        <div className="flex flex-1 flex-col gap-4 rounded-[24px] border border-white/80 bg-[#f3f4f7]/90 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
          {user ? (
            <>
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={linkClass(link.href)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <button
                onClick={signOut}
                className="mt-auto w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-[#6e6e73] transition-all duration-200 hover:bg-white/70 hover:text-[#1d1d1f]"
              >
                {isDemo ? "Exit demo" : "Sign out"}
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" className={linkClass("/login")}>Sign in</Link>
              <Link href="/register" className={linkClass("/register")}>Create account</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
