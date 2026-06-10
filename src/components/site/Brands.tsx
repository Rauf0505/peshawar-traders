import { Reveal } from "./Reveal";

const brands = ["BENCHMADE", "LEUPOLD", "SITKA", "FILSON", "GERBER", "MAGPUL"];

export function Brands() {
  return (
    <section className="py-20 bg-background border-y border-border">
      <div className="container-x">
        <Reveal>
          <div className="text-center mb-10">
            <span className="eyebrow">Trusted Brands</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10 items-center">
            {brands.map((b) => (
              <div
                key={b}
                className="text-center font-display text-xl md:text-2xl tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer"
              >
                {b}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
