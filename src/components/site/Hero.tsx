"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

export interface Slide {
  id: number;
  slideOrder: number;
  mediaType: string;
  mediaUrl: string;
  eyebrowText: string | null;
  headingLine1: string | null;
  headingLine2: string | null;
  description: string | null;
  button1Text: string | null;
  button1Link: string | null;
  button2Text: string | null;
  button2Link: string | null;
  duration: number | null;
  videoMuted: number | null;
  showScrollIndicator: number | null;
  isActive: number;
}

export function Hero({ slides = [] }: { slides?: Slide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const current = slides[currentIndex];
  const dur = current?.duration ?? 5;

  const advance = useCallback(() => {
    if (slides.length < 2) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    timerRef.current = setTimeout(advance, dur * 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentIndex, dur, advance, slides.length]);

  const handleVideoRef = (id: number, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(id, el);
      el.muted = muted;
      el.volume = volume;
      el.play().catch(() => {});
    } else {
      videoRefs.current.delete(id);
    }
  };

  useEffect(() => {
    const el = videoRefs.current.get(current?.id);
    if (el) {
      el.muted = muted;
      el.volume = volume;
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  }, [currentIndex, muted, volume, current?.id]);

  if (slides.length === 0) return null;

  const s = current;

  return (
    <section ref={sectionRef} className="relative h-[65vh] min-h-[440px] md:h-[calc(100svh-5rem)] md:min-h-[600px] w-full overflow-hidden bg-zinc-950">
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 -top-10 -bottom-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {s.mediaType === "video" ? (
              <video
                ref={(el) => handleVideoRef(s.id, el)}
                src={s.mediaUrl}
                muted={muted}
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <img src={s.mediaUrl} alt="" className="h-full w-full object-cover" />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </motion.div>

      {s.mediaType === "video" && (
        <div className="absolute bottom-24 right-5 md:right-10 z-20 flex items-center gap-2">
          <button
            onClick={() => setMuted(!muted)}
            className="grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          {!muted && (
            <div className="flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
              <Volume2 className="h-3.5 w-3.5 text-white/70" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 accent-emerald-500"
              />
            </div>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={s.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 container-x h-full flex flex-col justify-end pb-12 md:pb-24 lg:pb-32"
        >
          {s.eyebrowText && (
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="eyebrow text-white/70"
            >
              {s.eyebrowText}
            </motion.span>
          )}
          {(s.headingLine1 || s.headingLine2) && (
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 sm:mt-5 max-w-3xl text-white font-display font-medium leading-[1.02] text-3xl sm:text-5xl md:text-7xl lg:text-[88px]"
            >
              {s.headingLine1 && <>{s.headingLine1}<br /></>}
              {s.headingLine2 && <span className="italic text-white/85">{s.headingLine2}</span>}
            </motion.h1>
          )}
          {s.description && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base md:text-lg text-white/75 leading-relaxed"
            >
              {s.description}
            </motion.p>
          )}
          {(s.button1Text || s.button2Text) && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              {s.button1Text && (
                <a
                  href={s.button1Link || "#"}
                  className="group inline-flex items-center justify-center gap-3 bg-white text-charcoal px-8 py-4 text-sm font-semibold tracking-wide uppercase rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-300 w-full sm:w-auto"
                >
                  {s.button1Text}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              )}
              {s.button2Text && (
                <a
                  href={s.button2Link || "#"}
                  className="inline-flex items-center justify-center gap-3 border border-white/40 text-white px-8 py-4 text-sm font-semibold tracking-wide uppercase rounded-md hover:bg-white hover:text-charcoal transition-all duration-300 w-full sm:w-auto"
                >
                  {s.button2Text}
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {s.showScrollIndicator === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute right-5 md:right-10 bottom-10 hidden md:flex flex-col items-center gap-3 text-white/60"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase rotate-90 origin-center mt-8">
            Scroll
          </span>
          <div className="h-16 w-px bg-white/40" />
        </motion.div>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
