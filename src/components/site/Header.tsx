import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";

const NAV = ["Home", "Shop", "Categories", "New Arrivals", "Best Sellers", "About", "Contact"];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-[0_1px_0_rgba(0,0,0,0.02)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="grid h-9 w-9 place-items-center rounded-sm bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21l9-18 9 18M7 17h10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="leading-none">
            <div className="font-display text-xl font-semibold tracking-wide text-foreground">
              RIDGELINE
            </div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground">OUTFITTERS · EST 1987</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <a
              key={n}
              href="#"
              className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
            >
              {n}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button className="hidden sm:grid place-items-center h-10 w-10 rounded-full hover:bg-muted transition" aria-label="Search">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button className="hidden sm:grid place-items-center h-10 w-10 rounded-full hover:bg-muted transition" aria-label="Wishlist">
            <Heart className="h-[18px] w-[18px]" />
          </button>
          <button className="relative grid place-items-center h-10 w-10 rounded-full hover:bg-muted transition" aria-label="Cart">
            <ShoppingBag className="h-[18px] w-[18px]" />
            <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">3</span>
          </button>
          <button
            className="lg:hidden grid place-items-center h-10 w-10 rounded-full hover:bg-muted transition"
            aria-label="Menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 h-full w-[82%] max-w-sm bg-background p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-display text-lg font-semibold">Menu</span>
                <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV.map((n, i) => (
                  <motion.a
                    key={n} href="#"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    onClick={() => setOpen(false)}
                    className="py-3 text-2xl font-display border-b border-border hover:text-primary transition"
                  >
                    {n}
                  </motion.a>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
