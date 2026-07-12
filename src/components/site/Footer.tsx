import Image from "next/image";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { SiTiktok } from "react-icons/si";
const LOGO_IMG = "https://ik.imagekit.io/chaudaryrauf/wildwood/site/logo_FQb_afTiw.png";

const cols = [
  { title: "Shop", links: ["Airguns", "Pellets", "Tactical Vests", "Gun Pouches", "Optics", "Field Gear"] },
  { title: "Customer Service", links: ["Contact Us", "Shipping & Returns", "Warranty", "FAQ", "Size Guide", "Track Order"] },
];

const iconClass = "grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:bg-accent hover:border-accent hover:text-accent-foreground transition";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/70">
      <div className="container-x pt-20 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Image src={LOGO_IMG} alt="Peshawar Traders" width={192} height={96} className="h-24 w-auto mb-6" />
            <p className="text-sm leading-relaxed max-w-sm">
              Premium tactical and outdoor equipment for those who refuse to compromise.
              Family owned, three generations strong.
            </p>
            <div className="mt-8 flex gap-3">
              <a href="#" aria-label="Instagram" className={iconClass}>
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/share/1BTMM1TiCp/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={iconClass}>
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://youtube.com/@peshawartradersalmanhunting" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={iconClass}>
                <Youtube className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@peshawartraders3" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={iconClass}>
                <SiTiktok className="h-4 w-4" />
              </a>
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
          <div className="max-md:col-span-2">
            <h4 className="text-white font-display text-lg mb-5">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-white/40" />
                <span>03006018100 · 03326018100</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-white/40" />
                <a href="mailto:peshawartraderofficial@gmail.com" className="hover:text-accent transition">
                  peshawartraderofficial@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-white/40" />
                <div>
                  <div>Branch 1: Peshawar</div>
                  <div>Branch 2: Sahiwal</div>
                  <div>Branch 3: Faisalabad</div>
                </div>
              </li>
            </ul>
          </div>
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
