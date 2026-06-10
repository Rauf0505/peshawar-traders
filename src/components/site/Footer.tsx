import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import logo from "@/assets/logo.png";

const cols = [
  { title: "Shop", links: ["Airguns", "Pellets", "Tactical Vests", "Gun Pouches", "Optics", "Field Gear"] },
  { title: "Quick Links", links: ["New Arrivals", "Best Sellers", "Sale", "Gift Cards", "Our Story", "Journal"] },
  { title: "Customer Service", links: ["Contact Us", "Shipping & Returns", "Warranty", "FAQ", "Size Guide", "Track Order"] },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/70">
      <div className="container-x pt-20 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <div className="col-span-2">
            <img src={logo} alt="Peshawar Traders" className="h-24 w-auto mb-6" />
            <p className="text-sm leading-relaxed max-w-sm">
              Premium tactical and outdoor equipment for those who refuse to compromise.
              Family owned, three generations strong.
            </p>
            <div className="mt-8 flex gap-3">
              {[Instagram, Facebook, Youtube, Twitter].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:bg-accent hover:border-accent hover:text-accent-foreground transition"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-white font-display text-lg mb-5">{c.title}</h4>
              <ul className="space-y-3 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-accent transition">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-white/50">
          <div>© {new Date().getFullYear()} Peshawar Traders. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
            <a href="#" className="hover:text-white transition">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
