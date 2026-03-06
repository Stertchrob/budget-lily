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
  const { signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 mb-8 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/80 px-5 py-4 backdrop-blur">
      <Link href="/dashboard" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
        <BrandLogo size={48} />
        <span>Budget Lily</span>
      </Link>
      <div className="flex flex-wrap items-center gap-1">
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
      </div>
    </nav>
  );
}
