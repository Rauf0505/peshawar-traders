"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function Newsletter() {
  return (
    <section className="py-24 md:py-28 bg-secondary">
      <div className="container-x">
        <Reveal>
          <motion.div className="relative overflow-hidden bg-primary text-primary-foreground p-10 md:p-16 lg:p-20 rounded-xl">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="eyebrow text-accent">Join the Pack</span>
                <h2 className="mt-4 font-display text-3xl md:text-5xl font-medium leading-[1.05]">
                  Get 10% off your first order.
                </h2>
                <p className="mt-4 text-primary-foreground/70 max-w-md">
                  Field reports, new arrivals, and exclusive subscriber-only deals — delivered monthly.
                </p>
              </div>
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 px-5 py-4 text-primary-foreground placeholder:text-primary-foreground/50 rounded-md focus:outline-none focus:border-accent transition"
                />
                <button className="group inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-7 py-4 text-sm uppercase tracking-[0.18em] font-semibold rounded-md hover:bg-white hover:text-primary transition">
                  Subscribe
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
