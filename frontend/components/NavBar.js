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

  return (
    <nav className="sticky top-0 z-50 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/90 px-6 py-4 shadow-sm backdrop-blur">
      <Link href={user ? "/dashboard" : "/login"} className="flex items-center">
        <BrandLogo size={72} className="rounded-lg" />
      </Link>
      {!loading && (
        <div className="flex flex-wrap items-center gap-1">
          {user ? (
            <>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm ${pathname === link.href ? "bg-[#f5f5f7] text-[#1d1d1f]" : "text-[#86868b] hover:bg-[#f5f5f7]"}`}
                >
                  {link.label}
                </Link>
              ))}
              <button onClick={signOut} className="rounded-lg px-3 py-2 text-sm text-[#86868b] hover:bg-[#f5f5f7]">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className={`rounded-lg px-3 py-2 text-sm ${pathname === "/login" ? "bg-[#f5f5f7] text-[#1d1d1f]" : "text-[#86868b] hover:bg-[#f5f5f7]"}`}>Sign in</Link>
              <Link href="/register" className={`rounded-lg px-3 py-2 text-sm ${pathname === "/register" ? "bg-[#f5f5f7] text-[#1d1d1f]" : "text-[#86868b] hover:bg-[#f5f5f7]"}`}>Create account</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
