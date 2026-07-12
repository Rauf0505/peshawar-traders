"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Home,
  LogOut,
  Shield,
  Loader2,
  Tag,
  Grid3X3,
  List,
  ShoppingCart,
  MessageSquare,
  Image,
  ListOrdered,
  Settings,
} from "lucide-react";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/brands", label: "Brands", icon: Tag },
  { href: "/admin/categories", label: "Categories", icon: Grid3X3 },
  { href: "/admin/subcategories", label: "Subcategories", icon: List },
  { href: "/admin/hero", label: "Hero", icon: Image },
  { href: "/admin/attributes", label: "Attributes", icon: ListOrdered },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/home-control", label: "Home Control", icon: Home },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthed(false);
      return;
    }
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.valid) {
          localStorage.removeItem("admin_token");
          setAuthed(false);
        } else {
          setAuthed(true);
        }
      })
      .catch(() => setAuthed(false));
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto text-red-400 mb-4" />
          <p className="text-zinc-400 mb-4">You need to log in first.</p>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-100 rounded-md hover:bg-zinc-700 text-sm transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setAuthed(false);
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col">
        <div className="flex items-center gap-2 px-5 h-14 border-b border-zinc-800">
          <div className="h-7 w-7 rounded-full bg-emerald-600 grid place-items-center">
            <span className="text-xs font-bold">PT</span>
          </div>
          <span className="text-sm font-medium">Admin Panel</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition ${
                  isActive(item.href)
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-zinc-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300 rounded-md hover:bg-zinc-800/50 transition"
          >
            <Home className="h-4 w-4" />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-zinc-500 hover:text-red-400 rounded-md hover:bg-zinc-800/50 transition"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
