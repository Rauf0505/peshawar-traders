import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  { name: "Jacob Hartwell", role: "Elk Hunter · Montana", quote: "Peshawar Traders gear has carried me through twelve seasons of high-altitude hunts. Their airgun precision rivals brands twice the price.", rating: 5, avatar: "https://i.pravatar.cc/120?img=14" },
  { name: "Sarah McAllister", role: "Outdoor Guide · Colorado", quote: "I outfit my entire team with Peshawar Traders. The tactical vests are the most thoughtfully designed I have ever worn.", rating: 5, avatar: "https://i.pravatar.cc/120?img=47" },
  { name: "Marcus Lin", role: "Competitive Shooter", quote: "From the pellets to the optics, every product delivers consistent performance. Their customer service is genuinely exceptional.", rating: 5, avatar: "https://i.pravatar.cc/120?img=33" },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const item = items[i];

  return (
    <section className="py-24 md:py-32 bg-charcoal text-white relative overflow-hidden">
      <div className="container-x">
        <Reveal>
          <div className="text-center mb-16">
            <span className="eyebrow text-accent">Trusted Voices</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-medium text-white">
              Stories from <span className="italic">the field</span>.
            </h2>
          </div>
        </Reveal>

        <div className="relative max-w-3xl mx-auto">
          <Quote className="absolute -top-6 -left-2 md:-left-10 h-20 w-20 text-white/5" />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: item.rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="font-display text-2xl md:text-3xl leading-snug text-white/90 italic">
                "{item.quote}"
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-accent/50"
                />
                <div className="text-left">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                    {item.role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setI((i - 1 + items.length) % items.length)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:bg-accent hover:border-accent transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {items.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-accent" : "w-1.5 bg-white/30"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setI((i + 1) % items.length)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:bg-accent hover:border-accent transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
