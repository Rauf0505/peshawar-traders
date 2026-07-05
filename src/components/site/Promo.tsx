import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
const PROMO_IMG = "https://ik.imagekit.io/chaudaryrauf/wildwood/site/promo_oZDWG3OTK.jpg";
import { useEffect, useState } from "react";

function useCountdown(targetHours = 47) {
  const [t, setT] = useState({ h: targetHours, m: 32, s: 18 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((p) => {
        let { h, m, s } = p;
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 0;
          m = 0;
          s = 0;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function Promo() {
  const { h, m, s } = useCountdown();
  const Box = ({ v, l }: { v: number; l: string }) => (
    <div className="text-center">
      <div className="font-display text-4xl md:text-5xl text-white tabular-nums">
        {String(v).padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 mt-1">{l}</div>
    </div>
  );
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img src={PROMO_IMG} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />
      </div>
      <div className="relative container-x">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="eyebrow text-accent">Limited Time</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-medium text-white leading-[1.05]">
            Spring Offensive — <span className="italic text-white/85">Up to 30% off</span>
          </h2>
          <p className="mt-5 text-white/70 text-lg max-w-lg leading-relaxed">
            Gear up for the season with field-proven essentials. Free shipping on orders over $150.
          </p>
          <div className="mt-10 flex items-center gap-4 md:gap-6">
            <Box v={h} l="Hours" />
            <span className="text-white/40 text-3xl">:</span>
            <Box v={m} l="Minutes" />
            <span className="text-white/40 text-3xl">:</span>
            <Box v={s} l="Seconds" />
          </div>
          <a
            href="#"
            className="mt-10 inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 text-sm uppercase tracking-[0.18em] font-semibold rounded-md hover:bg-white hover:text-charcoal transition-all group"
          >
            Shop the Sale
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
