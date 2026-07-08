import Image from "next/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ShieldCheck, Users, Globe, Award } from "lucide-react";
import { Reveal, Stagger, itemVariants } from "@/components/site/Reveal";
import { MotionDiv } from "@/components/site/MotionDiv";

const values = [
  {
    icon: ShieldCheck,
    title: "Quality First",
    text: "Every product is field-tested and rigorously inspected before it reaches your hands.",
  },
  {
    icon: Users,
    title: "Family Owned",
    text: "Three generations of expertise in tactical and outdoor equipment.",
  },
  {
    icon: Globe,
    title: "Global Sourcing",
    text: "We source from the best manufacturers worldwide to bring you top-tier gear.",
  },
  {
    icon: Award,
    title: "Lifetime Guarantee",
    text: "We stand behind everything we sell with our no-questions-asked guarantee.",
  },
];

export default function AboutView() {
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-20">
        <section className="py-24 md:py-32">
          <div className="container-x">
            <div className="max-w-3xl mx-auto text-center">
              <Reveal>
                <span className="eyebrow">Our Story</span>
                <h1 className="mt-4 font-display text-4xl md:text-6xl font-medium leading-[1.05]">
                  Three decades of trust,{" "}
                  <span className="italic text-primary">earned in the field</span>.
                </h1>
                <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                  Founded in 1987, Peshawar Traders started as a small family operation supplying
                  tactical equipment to security professionals. Today we serve hunters, shooters,
                  law enforcement, and outdoor enthusiasts across the country.
                </p>
              </Reveal>
            </div>

            <div className="mt-20 max-w-4xl mx-auto">
              <Reveal>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div>
                    <Image
                      src="https://ik.imagekit.io/chaudaryrauf/wildwood/site/about-hero_t8dKGCUiK.jpg"
                      alt="Our workshop"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="rounded-md w-full h-auto object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl md:text-4xl font-medium leading-[1.1]">
                      Built by professionals,{" "}
                      <span className="italic text-primary">for professionals</span>.
                    </h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      Every product in our catalog is selected based on real-world performance. We
                      don't just sell gear — we use it. Our team includes competitive shooters,
                      hunters, and tactical professionals who test everything we stock.
                    </p>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      From precision airguns to field-maintenance tools, if it's at Peshawar
                      Traders, it has earned its place.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-24 bg-secondary">
          <div className="container-x">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="eyebrow">Our Values</span>
                <h2 className="mt-4 font-display text-4xl md:text-5xl font-medium leading-[1.05]">
                  What we <span className="italic text-primary">stand for</span>.
                </h2>
              </div>
            </Reveal>
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <MotionDiv
                  key={v.title}
                  variants={itemVariants}
                  className="group p-8 border border-border bg-card hover:border-primary hover:-translate-y-1 rounded-md transition-all duration-500"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-background text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                    <v.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-medium">{v.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
                </MotionDiv>
              ))}
            </Stagger>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
