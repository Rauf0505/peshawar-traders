import { getDb } from "./connection.server";
import { users, categories, subcategories, brands, products, homeAssignments } from "./schema.server";
import { getServerConfig } from "../config.server";
import { eq } from "drizzle-orm";

async function seed() {
  const db = getDb();
  const config = getServerConfig();

  // Check if already seeded
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

  // Categories and subcategories
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

  // Brands
  const brandsData = [
    ["Gerber", "China"],
    ["Browning", "China"],
    ["Discoverer", "China"],
    ["Spike", "China"],
    ["5.11 Tactical", "United States"],
    ["SNOWPEAK", "China"],
    ["GAMO", "Spain"],
    ["Jet", "Iran"],
    ["Duniya Bachman", "Iran"],
    ["JSB", "Spain"],
    ["Salman Kash Maker", "Pakistan"],
    ["Green Pigeon", "Pakistan"],
    ["Diabolo", "Pakistan"],
    ["Hunter", "Pakistan"],
    ["Target", "Pakistan"],
    ["Shaheen", "Pakistan"],
    ["Diamond", "Pakistan"],
    ["Nishan", "Pakistan"],
  ];

  const now = new Date().toISOString();
  for (const [name, country] of brandsData) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await db.insert(brands).values({
      name,
      country,
      slug,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Assign existing products to home (if any exist)
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
