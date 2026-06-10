import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, itemVariants } from "./Reveal";
import airguns from "@/assets/cat-airguns.jpg";
import pellets from "@/assets/cat-pellets.jpg";
import vests from "@/assets/cat-vests.jpg";
import pouches from "@/assets/cat-pouches.jpg";
import accessories from "@/assets/cat-accessories.jpg";
import gear from "@/assets/cat-gear.jpg";

const cats = [
  { name: "Weapons & Launchers", slug: "weapons-launchers", count: 48, img: airguns, span: "md:col-span-2 md:row-span-2" },
  { name: "Optics & Lasers", slug: "optics-lasers", count: 32, img: pellets, span: "" },
  { name: "Cases & Holsters", slug: "cases-holsters", count: 24, img: vests, span: "" },
  { name: "Tactical Apparel", slug: "tactical-apparel", count: 18, img: pouches, span: "" },
  { name: "Maintenance Tools", slug: "maintenance-tools", count: 56, img: accessories, span: "" },
  { name: "Field Gear", slug: "field-gear", count: 41, img: gear, span: "md:col-span-2" },
];

export function Categories() {
  return (
    <section id="categories" className="py-24 md:py-32 bg-background">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="eyebrow">Shop by Category</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl font-medium text-foreground max-w-xl leading-[1.05]">
                Equipment for every <span className="italic text-primary">mission</span>.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm">
              From precision airguns to tactical field gear, trusted by professionals worldwide.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:auto-rows-[280px]">
{cats.map((c) => (
  <motion.div
    key={c.name}
    variants={itemVariants}
    className={`group relative overflow-hidden rounded-md bg-charcoal ${c.span} min-h-[280px]`}
  >
    <Link to="/shop/$category" params={{ category: c.slug }} className="block h-full">
      <img
        src={c.img}
        alt={c.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-white/60 mb-2">
              {c.count} Products
            </div>
            <h3 className="text-white font-display text-2xl md:text-3xl font-medium">
              {c.name}
            </h3>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-full bg-white/0 border border-white/40 text-white transition-all duration-300 group-hover:bg-white group-hover:text-charcoal group-hover:rotate-45">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
))}
        </Stagger>
      </div>
    </section>
  );
}
