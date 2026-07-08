import { useEffect, useState } from "react";
import { Link, Outlet, useRouter, useLocation } from "@tanstack/react-router";
import { verifyAuth } from "@/lib/api/auth.server";
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
} from "lucide-react";


function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function AdminLayout() {
  const router = useRouter();
  const location = useLocation();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthed(false);
      return;
    }
    verifyAuth({ data: { token } }).then((res) => {
      if (!res.valid) {
        localStorage.removeItem("admin_token");
        setAuthed(false);
      } else {
        setAuthed(true);
      }
    });
  }, []);

  if (isLoginPage) {
    return <Outlet />;
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
          <a
            href="/admin/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-100 rounded-md hover:bg-zinc-700 text-sm transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const isActive = (path: string) =>
    location.pathname.startsWith(path)
      ? "bg-zinc-800 text-zinc-100"
      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50";

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.navigate({ to: "/admin/login" });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col">
        <div className="h-14 flex items-center gap-2 px-5 border-b border-zinc-800">
          <Shield className="h-5 w-5 text-emerald-400" />
          <span className="font-display font-medium text-sm tracking-wide">
            Admin Panel
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${isActive("/admin") && location.pathname === "/admin" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${isActive("/admin/products")}`}
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link
            to="/admin/categories"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${isActive("/admin/categories")}`}
          >
            <Grid3X3 className="h-4 w-4" />
            Categories
          </Link>
          <Link
            to="/admin/subcategories"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${isActive("/admin/subcategories")}`}
          >
            <List className="h-4 w-4" />
            Subcategories
          </Link>
          <Link
            to="/admin/brands"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${isActive("/admin/brands")}`}
          >
            <Tag className="h-4 w-4" />
            Brands
          </Link>
          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${isActive("/admin/orders")}`}
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
          </Link>
          <Link
            to="/admin/reviews"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${isActive("/admin/reviews")}`}
          >
            <MessageSquare className="h-4 w-4" />
            Reviews
          </Link>
          <Link
            to="/admin/home-control"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${isActive("/admin/home-control")}`}
          >
            <Home className="h-4 w-4" />
            Home Control
          </Link>
        </nav>
        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
