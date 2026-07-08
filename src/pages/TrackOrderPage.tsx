import { motion } from "framer-motion";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowUpRight } from "lucide-react";

const couriers = [
  {
    id: "leopard",
    name: "Leopard Courier",
    abbr: "LC",
    number: "01",
    url: "https://pk.leopardscourier.com/tracking",
    tagline: "Pakistan's leading last-mile courier with nationwide coverage.",
  },
  {
    id: "mp",
    name: "M&P Logistics",
    abbr: "M&P",
    number: "02",
    url: "https://www.mulphilog.com/tracking/1",
    tagline: "Reliable and secure logistics solutions across Pakistan.",
  },
  {
    id: "tcs",
    name: "TCS Express",
    abbr: "TCS",
    number: "03",
    url: "https://www.tcsexpress.com/track/",
    tagline: "Pakistan's No.1 trusted express courier service.",
  },
  {
    id: "trax",
    name: "Trax",
    abbr: "TRX",
    number: "04",
    url: "https://slgtrax.com/",
    tagline: "Smart e-commerce logistics made simple.",
  },
];

export function TrackOrderPage() {
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-20">

        {/* ── Hero ── */}
        <section className="relative py-24 md:py-36 bg-charcoal overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(var(--primary),0.12),transparent)]" />
          <div className="container-x relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="eyebrow text-white/40">Delivery Tracking</span>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-7xl font-medium text-white leading-[1.04] max-w-3xl mx-auto">
                Track Your <span className="italic text-primary">Order</span>
              </h1>
              <p className="mt-6 text-white/50 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                Select the courier used for your shipment and you'll be taken directly to their official tracking portal.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Steps strip ── */}
        <section className="border-b border-border bg-secondary">
          <div className="container-x py-6">
            <ol className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3 sm:gap-10 text-sm text-muted-foreground">
              {[
                "Find the tracking number in your order SMS or email",
                "Select your courier below",
                "Enter the number on their official site",
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="h-5 w-5 rounded-sm bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary grid place-items-center shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Courier Cards ── */}
        <section className="py-16 md:py-24">
          <div className="container-x">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {couriers.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col h-full bg-secondary border border-border hover:border-primary rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
                  >
                    {/* Top accent line — appears on hover via primary color */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-border group-hover:bg-primary transition-colors duration-300" />

                    <div className="p-4 sm:p-6 flex flex-col h-full">

                      {/* Number + arrow row */}
                      <div className="flex items-center justify-between mb-5 sm:mb-8">
                        <span className="font-display text-3xl sm:text-4xl font-medium text-border group-hover:text-primary/25 transition-colors duration-300 leading-none select-none">
                          {c.number}
                        </span>
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-border grid place-items-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
                          <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                        </div>
                      </div>

                      {/* Abbr pill */}
                      <span className="self-start text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground border border-border/60 rounded px-2 py-0.5 mb-3">
                        {c.abbr}
                      </span>

                      {/* Name */}
                      <h3 className="font-display text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
                        {c.name}
                      </h3>

                      {/* Tagline */}
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
                        {c.tagline}
                      </p>

                      {/* CTA */}
                      <div className="mt-5 pt-4 border-t border-border/50">
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] font-semibold text-muted-foreground group-hover:text-primary transition-colors duration-200">
                          Track Now →
                        </span>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Help Note ── */}
        <section className="py-12 bg-secondary border-t border-border">
          <div className="container-x text-center">
            <p className="text-sm text-muted-foreground">
              Not sure which courier was used?{" "}
              <a
                href="/contact"
                className="text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors"
              >
                Contact our support team
              </a>{" "}
              and we'll help you out.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
