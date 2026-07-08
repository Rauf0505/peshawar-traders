"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Menu, X, ChevronDown, Globe, Tag, Grid3X3, Home, Info, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getBrands, getCategoriesWithSubcategories } from "@/lib/api-client";
import { COUNTRY_CODE, getFlagEmoji } from "@/lib/countries";
import { useCart } from "@/lib/cart-context";
const LOGO_IMG = "https://ik.imagekit.io/chaudaryrauf/wildwood/site/logo_FQb_afTiw.png";

// ─── Desktop Nav Item with Dropdown ─────────────────────────────────────────
function NavDropdown({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={hide}
      className="relative"
    >
      <button className="relative flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-1">
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        {/* active underline */}
        <span
          className={`absolute left-0 -bottom-1 h-px bg-primary transition-all duration-300 ${open ? "w-full" : "w-0"}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseEnter={show}
            onMouseLeave={hide}
            className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+12px)] z-50 min-w-[240px]"
          >
            {/* Arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 overflow-hidden">
              <div className="w-3 h-3 bg-background border border-border rotate-45 mx-auto -mt-1.5 shadow-sm" />
            </div>
            <div className="bg-background border border-border rounded-xl shadow-2xl shadow-black/10 overflow-hidden">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mobile Accordion Section ────────────────────────────────────────────────
function MobileSection({
  icon: Icon,
  label,
  children,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/60">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-base font-medium"
      >
        <span className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
          {label}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-8 space-y-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Header ─────────────────────────────────────────────────────────────────
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [productsMenu, setProductsMenu] = useState<any[]>([]);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getBrands().then(setBrands);
    getCategoriesWithSubcategories().then(setProductsMenu);
  }, []);

  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Group brands by country for dropdown
  const brandsByCountry = brands.reduce<Record<string, any[]>>((acc, b) => {
    const c = b.country || "Other";
    if (!acc[c]) acc[c] = [];
    acc[c].push(b);
    return acc;
  }, {});

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-background"
        }`}
      >
        <div className="container-x flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src={LOGO_IMG} alt="Peshawar Traders" className="h-16 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-3">
            {/* Home */}
            <Link
              href="/"
              className="relative px-3 py-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-px after:w-0 after:bg-primary hover:after:w-[calc(100%-24px)] after:transition-all after:duration-300"
            >
              Home
            </Link>

            {/* Brands Mega-Menu */}
            <NavDropdown label="Brands">
              <div className="p-3 min-w-[850px] max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                    By Country of Origin
                  </span>
                  <Link href="/brands" className="text-xs text-primary font-semibold hover:underline">
                    All Brands →
                  </Link>
                </div>
                {brands.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">Loading…</div>
                ) : (
                  <div className="flex flex-nowrap gap-x-3">
                    {Object.entries(brandsByCountry).map(([country, cBrands]) => (
                      <div key={country} className="flex flex-col flex-1 min-w-0">
                        <div className="px-4 py-1 text-xs text-muted-foreground flex items-center gap-2">
                          <span>{COUNTRY_CODE[country] ? getFlagEmoji(COUNTRY_CODE[country]) : "🌐"}</span>
                          <span className="font-medium">{country}</span>
                        </div>
                        <div className="border-t border-border/40 my-1.5 mx-4" />
                        {cBrands.map((b) => (
                          <Link
                            key={b.id}
                            href={'/brands/' + b.slug}
                            className="block px-4 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary"
                          >
                            {b.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </NavDropdown>

            {/* Products Mega-Menu */}
            <NavDropdown label="Products">
              <div className="p-3 min-w-[950px] max-h-[70vh] overflow-y-auto">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold px-4 py-2">
                  Browse by Category
                </div>
                {productsMenu.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">Loading…</div>
                ) : (
                  <div className="grid grid-cols-5 gap-x-4">
                    {productsMenu.map((cat: any) => (
                      <div key={cat.id} className="flex flex-col">
                        <Link
                          href={`/products?category=${cat.slug}`}
                          className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                        >
                          {cat.name}
                        </Link>
                        <div className="border-t border-border/40 my-1.5 mx-4" />
                        {cat.subcategories?.map((sub: any) => (
                          <Link
                            key={sub.id}
                            href={`/products?subcategory=${sub.slug}`}
                            className="px-4 py-1.5 text-sm text-foreground/80 hover:text-primary rounded-lg hover:bg-secondary transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-border mt-2 pt-2 px-4">
                  <Link
                    href="/products"
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    View all products →
                  </Link>
                </div>
              </div>
            </NavDropdown>

            {/* About */}
            <Link
              href="/about"
              className="relative px-3 py-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-px after:w-0 after:bg-primary hover:after:w-[calc(100%-24px)] after:transition-all after:duration-300"
            >
              About Us
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className="relative px-3 py-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-px after:w-0 after:bg-primary hover:after:w-[calc(100%-24px)] after:transition-all after:duration-300"
            >
              Contact Us
            </Link>

            {/* Track Order */}
            <Link
              href="/track-order"
              className="relative flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-px after:w-0 after:bg-primary hover:after:w-[calc(100%-24px)] after:transition-all after:duration-300"
            >
              <MapPin className="h-3.5 w-3.5" />
              Track Order
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/products"
              className="hidden sm:grid place-items-center h-10 w-10 rounded-full hover:bg-muted transition"
              aria-label="Search products"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>
            <button
              onClick={openCart}
              className="relative grid place-items-center h-10 w-10 rounded-full hover:bg-muted transition"
              aria-label="Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
            <button
              className="lg:hidden grid place-items-center h-10 w-10 rounded-full hover:bg-muted transition"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 h-full w-[88%] max-w-sm bg-background shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-20 border-b border-border">
                <img src={LOGO_IMG} alt="Peshawar Traders" className="h-12 w-auto" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="h-10 w-10 grid place-items-center rounded-full hover:bg-muted transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 overflow-y-auto px-5 py-4">
                <Link
                  href="/"
                  className="flex items-center gap-3 py-4 text-base font-medium border-b border-border/60"
                >
                  <Home className="h-5 w-5 text-muted-foreground" />
                  Home
                </Link>

                <MobileSection icon={Tag} label="Brands">
                  {brands.map((b) => (
                    <Link
                      key={b.id}
                      href={`/brands/${b.slug}`}
                      className="block py-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      {b.name}
                    </Link>
                  ))}
                  <Link href="/brands" className="block py-2 text-sm text-primary font-semibold">
                    All Brands →
                  </Link>
                </MobileSection>

                <MobileSection icon={Grid3X3} label="Products">
                  {productsMenu.length === 0 ? (
                    <Link href="/products" className="block py-2 text-sm text-foreground/80 hover:text-primary transition-colors">
                      All Products
                    </Link>
                  ) : (
                    productsMenu.map((cat: any) => (
                      <div key={cat.id} className="py-1">
                        <Link
                          href={`/products?category=${cat.slug}`}
                          className="block py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                        >
                          {cat.name}
                        </Link>
                        {cat.subcategories?.map((sub: any) => (
                          <Link
                            key={sub.id}
                            href={`/products?subcategory=${sub.slug}`}
                            className="block py-1.5 pl-3 text-sm text-foreground/80 hover:text-primary transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ))
                  )}
                  <Link href="/products" className="block py-2 text-sm text-primary font-semibold">
                    All Products →
                  </Link>
                </MobileSection>

                <Link
                  href="/about"
                  className="flex items-center gap-3 py-4 text-base font-medium border-b border-border/60"
                >
                  <Info className="h-5 w-5 text-muted-foreground" />
                  About Us
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center gap-3 py-4 text-base font-medium border-b border-border/60"
                >
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  Contact Us
                </Link>

                <Link
                  href="/track-order"
                  className="flex items-center gap-3 py-4 text-base font-medium border-b border-border/60"
                >
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  Track Order
                </Link>
              </nav>

              {/* Footer strip */}
              <div className="px-5 py-4 border-t border-border bg-secondary/40">
                <p className="text-xs text-muted-foreground">
                  Premium Tactical &amp; Outdoor Gear
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
