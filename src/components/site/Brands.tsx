"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { getBrands } from "@/lib/api-client";
import { COUNTRY_CODE, getFlagEmoji } from "@/lib/countries";

export function Brands() {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    getBrands().then(setBrands);
  }, []);

  if (brands.length === 0) return null;

  const selectedNames = [
    "Salman Kash Maker",
    "Hatsan",
    "Duniya Bachman",
    "5.11 Tactical",
    "Arrow",
    "Artemis"
  ];

  const displayed = selectedNames
    .map(name => brands.find(b => b.name === name))
    .filter((b): b is any => !!b);

  return (
    <section className="py-20 bg-background border-y border-border">
      <div className="container-x">
        <Reveal>
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="eyebrow">Trusted Brands</span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-medium max-w-lg">
                Premium Manufacturers <span className="italic text-primary">Worldwide</span>
              </h2>
            </div>
            <Link
              href="/brands"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View All Brands →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {displayed.map((b) => (
              <Link
                key={b.id}
                href={`/brands/${b.slug}`}
                className="group block"
              >
                <div className="aspect-square rounded-xl bg-secondary border border-border/60 hover:border-primary transition-all duration-300 flex flex-col items-center justify-center p-6 text-center">
                  {b.logo ? (
                    <Image src={b.logo} alt={b.name} width={160} height={40} className="h-10 object-contain mb-3 grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <span className="text-3xl mb-2">{COUNTRY_CODE[b.country] ? getFlagEmoji(COUNTRY_CODE[b.country]) : "🌐"}</span>
                  )}
                  <span className="font-display text-sm font-semibold group-hover:text-primary transition-colors">{b.name}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{b.country}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/brands"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View All Brands →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
