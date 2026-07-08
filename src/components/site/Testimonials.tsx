import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import { getFiveStarReviews } from "@/lib/api/reviews.server";

const mockReviews = [
  {
    id: "mock-1",
    reviewerName: "Jacob Hartwell",
    productName: "Elk Hunter · Montana",
    comment: "Peshawar Traders gear has carried me through twelve seasons of high-altitude hunts. Their airgun precision rivals brands twice the price.",
    rating: 5,
    avatar: "https://i.pravatar.cc/120?img=14",
  },
  {
    id: "mock-2",
    reviewerName: "Sarah McAllister",
    productName: "Outdoor Guide · Colorado",
    comment: "I outfit my entire team with Peshawar Traders. The tactical vests are the most thoughtfully designed I have ever worn.",
    rating: 5,
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    id: "mock-3",
    reviewerName: "Marcus Lin",
    productName: "Competitive Shooter",
    comment: "From the pellets to the optics, every product delivers consistent performance. Their customer service is genuinely exceptional.",
    rating: 5,
    avatar: "https://i.pravatar.cc/120?img=33",
  },
];

export function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [i, setI] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await getFiveStarReviews();
        if (res && res.length > 0) {
          setReviews(res);
        }
      } catch (err) {
        console.error("Error loading testimonials:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeReviews = reviews.length > 0 ? reviews : mockReviews;

  // Make sure index is in bounds if activeReviews changes
  useEffect(() => {
    setI(0);
  }, [activeReviews.length]);

  if (activeReviews.length === 0) return null;

  const item = activeReviews[i];

  return (
    <section className="py-24 md:py-28 bg-secondary/15 border-y border-border/50 text-foreground relative overflow-hidden">
      <div className="container-x">
        <Reveal>
          <div className="text-center mb-16">
            <span className="eyebrow text-accent">Trusted Voices</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-medium text-foreground">
              Stories from <span className="italic">the field</span>.
            </h2>
          </div>
        </Reveal>

        <div className="relative max-w-3xl mx-auto">
          {/* Outer Quote Accent */}
          <Quote className="absolute -top-10 -left-6 md:-left-14 h-24 w-24 text-accent/5 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="text-center bg-card border border-border/40 rounded-2xl p-8 md:p-12 shadow-sm"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: item.rating || 5 }).map((_, k) => (
                  <Star key={k} className="h-4.5 w-4.5 fill-accent text-accent" />
                ))}
              </div>

              {/* Comment / Quote */}
              <p className="font-display text-lg sm:text-xl md:text-2xl leading-relaxed text-foreground/90 italic">
                "{item.comment}"
              </p>

              {/* Author Info */}
              <div className="mt-8 flex items-center justify-center gap-4">
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.reviewerName}
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-accent/35"
                  />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-full bg-accent/10 border border-accent/25 text-accent flex items-center justify-center font-display font-semibold text-lg uppercase">
                    {item.reviewerName?.charAt(0) || "A"}
                  </div>
                )}
                <div className="text-left">
                  <div className="font-semibold text-sm sm:text-base text-foreground">{item.reviewerName}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
                    {item.avatar ? item.productName : `Verified Buyer · Product: ${item.productName}`}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setI((i - 1 + activeReviews.length) % activeReviews.length)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {activeReviews.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${k === i ? "w-8 bg-accent" : "w-1.5 bg-border"}`}
                  aria-label={`Go to slide ${k + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setI((i + 1) % activeReviews.length)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
