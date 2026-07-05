import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, itemVariants } from "./Reveal";
import { getCategories } from "@/lib/api/products.server";
const catImages: Record<string, string> = {
  "weapons-launchers": "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-airguns_QUU5YAuhX.jpg",
  "optics-lasers": "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-pellets_XFDJx1kuQ.jpg",
  "cases-holsters": "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-pouches_EWSfLgldc.jpg",
  "tactical-apparel": "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-vests_OMfPi852D.jpg",
  "maintenance-tools": "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-accessories_PQUqIqX6T.jpg",
};

const catSubtitle: Record<string, string> = {
  "weapons-launchers": "Launchers",
  "optics-lasers": "Lasers",
  "cases-holsters": "Holsters",
  "tactical-apparel": "Gear",
  "maintenance-tools": "Tools",
};

const catSpan: Record<string, string> = {
  "weapons-launchers": "col-span-2 md:col-span-2 md:row-span-2",
  "optics-lasers": "col-span-2 md:col-span-1",
  "cases-holsters": "col-span-1 md:col-span-1",
  "tactical-apparel": "col-span-1 md:col-span-1",
  "maintenance-tools": "col-span-2 md:col-span-1",
};

export function Categories() {
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    getCategories().then((data: any) => setCats(data));
  }, []);

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

        <Stagger>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[280px]">
            {cats.map((c: any) => (
            <motion.div
              key={c.slug}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-md bg-charcoal h-full ${catSpan[c.slug] || ""}`}
            >
              <Link to="/shop/$category" params={{ category: c.slug }} className="block h-full w-full">
                <img
                  src={catImages[c.slug] || "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-airguns_QUU5YAuhX.jpg"}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <span className="absolute top-4 right-4 z-10 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white/80 font-medium tracking-wider">
                  {c.product_count || 0} Products
                </span>

                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                  <div className="flex flex-col items-start">
                    <h3 className="text-white font-display text-2xl sm:text-3xl font-semibold leading-tight tracking-tight">
                      {c.name}
                    </h3>
                    <p className="text-white/80 text-sm sm:text-base font-light mt-1">
                      {catSubtitle[c.slug] || ""}
                    </p>
                    <span className="mt-4 text-xs font-bold tracking-[0.2em] text-primary uppercase inline-block border-b-2 border-primary pb-0.5 transition-all duration-300 group-hover:text-white group-hover:border-white">
                      SHOP NOW
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          </div>
        </Stagger>
      </div>
    </section>
  );
}
