import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/shop" },
  { label: "New Arrivals", to: "/shop" },
  { label: "Best Sellers", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];
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
      className={`fixed inset-x-0 top-0 z-50 bg-background transition-all duration-500 ${
        scrolled ? "border-b border-border shadow-[0_1px_0_rgba(0,0,0,0.02)]" : ""
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Peshawar Traders" className="h-20 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            className="hidden sm:grid place-items-center h-10 w-10 rounded-full hover:bg-muted transition"
            aria-label="Search"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button
            className="hidden sm:grid place-items-center h-10 w-10 rounded-full hover:bg-muted transition"
            aria-label="Wishlist"
          >
            <Heart className="h-[18px] w-[18px]" />
          </button>
          <button
            className="relative grid place-items-center h-10 w-10 rounded-full hover:bg-muted transition"
            aria-label="Cart"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
              3
            </span>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 h-full w-[82%] max-w-sm bg-background p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-display text-lg font-semibold">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV.map((item, i) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="py-3 text-2xl font-display border-b border-border hover:text-primary transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
