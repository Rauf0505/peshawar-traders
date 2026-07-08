import { getDb } from "./connection.server";
import { users, categories, subcategories, brands, products, homeAssignments } from "./schema.server";
import { getServerConfig } from "../config.server";
import { eq } from "drizzle-orm";

async function seed() {
  const db = getDb();
  const config = getServerConfig();

  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .limit(1);
  if (existingUser) {
    console.log("Database already seeded, skipping.");
    return;
  }

  const { scryptSync, randomBytes } = await import("node:crypto");
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(config.adminPassword, salt, 64).toString("hex");
  await db.insert(users).values({
    username: config.adminUsername,
    passwordHash: `${salt}:${hash}`,
  });

  const categoriesData = [
    {
      name: "Weapons", slug: "weapons-launchers",
      description: "Precision airguns, slingshots, and launching systems for sport and field use.",
      image: "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-airguns_QUU5YAuhX.jpg",
      subs: [
        { name: "Airguns / Pneumatic Rifles", slug: "airguns" },
        { name: "Airgun Pellets & Ammunition", slug: "airgun-pellets" },
        { name: "Slingshots", slug: "slingshots" },
      ],
    },
    {
      name: "Optics", slug: "optics-lasers",
      description: "High-performance scopes, binoculars, sights, and laser targeting systems.",
      image: "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-pellets_XFDJx1kuQ.jpg",
      subs: [
        { name: "Gun Scopes & Optics", slug: "gun-scopes" },
        { name: "Binoculars & Field Optics", slug: "binoculars" },
        { name: "Tactical Flashlights", slug: "tactical-flashlights" },
        { name: "Aiming Lasers", slug: "aiming-lasers" },
      ],
    },
    {
      name: "Cases & Holsters", slug: "cases-holsters",
      description: "Protective cases, holsters, pouches, and carry solutions for every mission.",
      image: "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-pouches_EWSfLgldc.jpg",
      subs: [
        { name: "Gun Covers", slug: "gun-covers" },
        { name: "Pistol Holsters", slug: "pistol-holsters" },
        { name: "Tactical Travel Gear", slug: "tactical-travel-gear" },
        { name: "Pistol Boxes & Firearm Safes", slug: "pistol-boxes-safes" },
        { name: "Drop-Leg Pouches", slug: "drop-leg-pouches" },
      ],
    },
    {
      name: "Tactical Gear", slug: "tactical-apparel",
      description: "Duty-ready uniforms, vests, jackets, belts, and tactical clothing.",
      image: "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-vests_OMfPi852D.jpg",
      subs: [
        { name: "Tactical Uniforms", slug: "tactical-uniforms" },
        { name: "Hunting Jackets", slug: "hunting-jackets" },
        { name: "Tactical Vests", slug: "tactical-vests" },
        { name: "Magazine Jackets", slug: "magazine-jackets" },
        { name: "Tactical Belts", slug: "tactical-belts" },
        { name: "Leather Holster Belts", slug: "leather-holster-belts" },
      ],
    },
    {
      name: "Field Tools", slug: "maintenance-tools",
      description: "Cleaning kits, lubricants, brushes, and essential field maintenance equipment.",
      image: "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-accessories_PQUqIqX6T.jpg",
      subs: [
        { name: "Firearm Cleaning Kits", slug: "cleaning-kits" },
        { name: "Cleaning Brushes", slug: "cleaning-brushes" },
        { name: "Weapon Lubricants", slug: "weapon-lubricants" },
        { name: "Anti-Rust Solutions", slug: "anti-rust-solutions" },
        { name: "Hunting & Survival Knives", slug: "hunting-knives" },
      ],
    },
  ];

  for (let ci = 0; ci < categoriesData.length; ci++) {
    const cat = categoriesData[ci];
    const [insertedCat] = await db
      .insert(categories)
      .values({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        displayOrder: ci + 1,
        status: 1,
      })
      .returning({ id: categories.id });

    for (let si = 0; si < cat.subs.length; si++) {
      const sub = cat.subs[si];
      await db.insert(subcategories).values({
        name: sub.name,
        slug: sub.slug,
        categoryId: insertedCat.id,
        displayOrder: si + 1,
        status: 1,
      });
    }
  }

  interface BrandSeed {
    name: string;
    country: string;
    description: string;
  }

  const brandsData: BrandSeed[] = [
    { name: "Salman Kash Maker", country: "Pakistan", description: "Legendary airgun maker from Sindh, Pakistan. Hand-crafted spring-piston air rifles known for exceptional durability, power, and precision. Family-owned workshop producing reliable airguns for hunting and sport shooting across South Asia for decades." },
    { name: "Diabolo", country: "Pakistan", description: "Named after the classic diabolo pellet shape, this Pakistani brand produces traditional spring-piston break-barrel air rifles. Reliable entry-level options for local hunters and sport shooters." },
    { name: "Diamond", country: "Pakistan", description: "Pakistani airgun brand offering budget-friendly spring-piston break-barrel rifles. Known for affordability and reliability, making them a popular choice for beginners and recreational plinkers." },
    { name: "Green Pigeon", country: "Pakistan", description: "Sialkot-based air rifle manufacturer producing break-barrel airguns for hunting and sport shooting. Known for classic wooden stocks and dependable performance in the field." },
    { name: "Hunter", country: "Pakistan", description: "Classic Pakistani airgun brand known for affordable break-barrel rifles popular among local hunters and sport shooters. Traditional design and reliable performance." },
    { name: "Nishan", country: "Pakistan", description: "Pakistani airgun manufacturer known for traditional design spring-piston rifles. Focuses on delivering reliable, no-frills airguns for the local market." },
    { name: "Shaheen", country: "Pakistan", description: "Named after the falcon — Pakistan's national bird. Pakistani airgun manufacturer producing spring-piston and CO2 models. Known for combining traditional craftsmanship with modern design." },
    { name: "Target", country: "Pakistan", description: "Pakistani brand known for value-priced air rifles offering good entry-level options for beginners. Reliable spring-piston break-barrel designs." },
    { name: "5.11 Tactical", country: "United States", description: "Premier American tactical apparel and gear brand founded in 2003. Named after the rock climbing difficulty grade. Trusted by law enforcement, military, and outdoor professionals worldwide for duty gear, apparel, and accessories." },
    { name: "Arrow", country: "Spain", description: "Modern PCP air rifle platform by Gamo featuring a straight-pull bolt action, 10-shot rotary magazine, and ambidextrous design. Built in Barcelona, Spain with Whisper Fusion noise reduction technology." },
    { name: "GAMO", country: "Spain", description: "Europe's largest airgun manufacturer, founded in 1959 in Barcelona, Spain. World's largest producer of airgun pellets. Known for IGT gas piston technology, Whisper noise-dampening, Swarm multi-shot systems, and innovative PCP rifles. BSA Guns UK is a subsidiary." },
    { name: "JSB", country: "Spain", description: "Founded in 1991, JSB is a world-renowned manufacturer of precision airgun pellets. Gold standard for competition shooters worldwide. Known for Exact, Hades, and Match Grade diabolo pellet lines offering exceptional accuracy and consistency." },
    { name: "Artemis", country: "China", description: "Brand of Shaoxing Snowpeak Air Gun Factory (est. 1976) in China's Yangtze River Delta. Produces spring, CO2, and PCP air rifles known for excellent value. Named after the Greek goddess of hunting. Popular models include P15, M10, M16A, CR600W." },
    { name: "Browning", country: "China", description: "Legendary firearms name founded in 1878 by John Moses Browning in Utah, USA. Browning-licensed air rifles are manufactured under license in China. Known for blending heritage design with modern airgun technology." },
    { name: "Discoverer", country: "China", description: "Chinese airgun brand offering spring-piston and CO2 powered air rifles and pistols at budget-friendly prices. Popular entry-level options for recreational shooting and plinking." },
    { name: "Gerber", country: "China", description: "Budget-focused Chinese airgun brand manufacturing entry-level spring-piston and CO2 air rifles. Popular choice for beginners seeking affordable and functional airguns." },
    { name: "SNOWPEAK", country: "China", description: "Shaoxing Snowpeak Air Gun Factory (est. 1976) — one of China's largest airgun manufacturers. Produces the Snowpeak line alongside Artemis. Known for regulated PCP rifles like the PR900W, M16, and bullpup designs with excellent value." },
    { name: "Spike", country: "China", description: "Chinese manufacturer of tactical airguns and accessories. Known for CO2-powered and spring-piston models with modern styling aimed at recreational shooters." },
    { name: "Duniya Bachman", country: "Iran", description: "Iranian brand whose name translates to 'World Saver' in Farsi. Produces airguns and tactical accessories for the regional market. Known for functional, no-frills designs." },
    { name: "Jet", country: "Iran", description: "Iranian airgun manufacturer producing spring-piston rifles and CO2 pistols. Serves the regional Middle Eastern market with affordable and reliable airguns." },
    { name: "Hatsan", country: "Turkey", description: "Founded in 1976 in Izmir, Turkey — one of the world's largest and most respected airgun manufacturers. 700+ employees across four factories (45,000m²). Exports 95% of production to 100+ countries. Known for Quattro Trigger, SAS shock absorber, Triopad butt system, and high-quality German steel/Turkish walnut construction. Produces spring-piston, gas piston, CO2, and PCP airguns plus Escort shotguns." },
    { name: "Kral Arms", country: "Turkey", description: "Leading Turkish firearms and airgun manufacturer founded in 1997 in Beyşehir, Konya. 250+ employees across 43,000m² integrated facility. Exports to 80+ countries. Renowned for PCP air rifles including Puncher, Empire, NP series. Also produces shotguns, pistols, and rifles." },
    { name: "Reximex", country: "Turkey", description: "Turkish PCP air rifle specialist founded in 2015 in Konya-Beyşehir. 90 employees, 12,000m² modern facility. Exports to 60+ countries. Known for innovative PCP models: Throne Gen2, Meta, Accura, Zone, Tormenta, Daystar, Lyra, and NYX. Also manufactures shotguns and pistols." },
  ];

  const now = new Date().toISOString();
  for (const b of brandsData) {
    const slug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await db.insert(brands).values({
      name: b.name,
      country: b.country,
      slug,
      description: b.description,
      createdAt: now,
      updatedAt: now,
    });
  }

  const existingProducts = await db.select({ id: products.id }).from(products);
  for (let i = 0; i < existingProducts.length; i++) {
    await db.insert(homeAssignments).values({
      productId: existingProducts[i].id,
      tabSlug: "all",
      position: i + 1,
    });
  }

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
