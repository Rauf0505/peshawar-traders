import { ShieldCheck, Truck, Lock, Headphones } from "lucide-react";
import { Reveal, Stagger, itemVariants } from "./Reveal";
import { motion } from "framer-motion";

const items = [
  { icon: ShieldCheck, title: "Premium Quality", text: "Field-tested and rigorously inspected before shipping." },
  { icon: Truck, title: "Fast Delivery", text: "Free 2-day shipping across the country on orders over $150." },
  { icon: Lock, title: "Secure Payments", text: "256-bit encryption and verified buyer protection on every order." },
  { icon: Headphones, title: "Expert Support", text: "Talk to real professionals seven days a week, 7am – 9pm." },
];

export function Features() {
  return (
    <section className="py-24 md:py-28 bg-background">
      <div className="container-x">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="eyebrow">Why Peshawar Traders</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-medium leading-[1.05]">
              Three decades of trust, <span className="italic text-primary">earned in the field</span>.
            </h2>
          </div>
        </Reveal>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <motion.div
              key={it.title}
              variants={itemVariants}
              className="group p-8 border border-border bg-card hover:border-primary hover:-translate-y-1 rounded-md transition-all duration-500"
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                <it.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 font-display text-2xl font-medium">{it.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.text}</p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
