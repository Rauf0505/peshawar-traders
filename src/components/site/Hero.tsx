import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -top-10 -bottom-10">
        <img src={hero} alt="Hunter at golden hour" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 container-x h-full flex flex-col justify-end pb-24 md:pb-32">
        <motion.span
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="eyebrow text-white/70"
        >
          Autumn Collection · 2026
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-3xl text-white font-display font-medium leading-[1.02] text-5xl sm:text-6xl md:text-7xl lg:text-[88px]"
        >
          Built for the wild.<br />
          <span className="italic text-white/85">Trusted for life.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-6 max-w-xl text-base md:text-lg text-white/75 leading-relaxed"
        >
          Precision airguns, tactical gear, and field-tested outdoor equipment — handpicked for hunters who refuse to compromise.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href="#products" className="group inline-flex items-center gap-3 bg-white text-charcoal px-8 py-4 text-sm font-semibold tracking-wide uppercase hover:bg-accent hover:text-accent-foreground transition-all duration-300">
            Shop Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#categories" className="inline-flex items-center gap-3 border border-white/40 text-white px-8 py-4 text-sm font-semibold tracking-wide uppercase hover:bg-white hover:text-charcoal transition-all duration-300">
            Explore Categories
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}
          className="absolute right-5 md:right-10 bottom-10 hidden md:flex flex-col items-center gap-3 text-white/60"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase rotate-90 origin-center mt-8">Scroll</span>
          <div className="h-16 w-px bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
