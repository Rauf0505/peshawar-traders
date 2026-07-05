import { createRequire } from "node:module";
const _require = createRequire(import.meta.url);

// We need to set up the environment same as the app
process.env.ADMIN_USERNAME = "admin";
process.env.ADMIN_PASSWORD = "admin123";
process.env.DATABASE_PATH = "./data/shop.db";
process.env.JWT_SECRET = "dev-secret-change-in-production";
process.env.IMAGEKIT_PUBLIC_KEY = "public_qBoLGEmh5+qne11/yOZy1vuMShM=";
process.env.IMAGEKIT_PRIVATE_KEY = "private_IE9d7LggyJPDJiLU4cu7Imbud7Y=";
process.env.IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/chaudaryrauf";

const Database = _require("better-sqlite3");
const db = new Database(process.env.DATABASE_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, image TEXT, display_order INTEGER DEFAULT 0, status INTEGER DEFAULT 1);
  CREATE TABLE IF NOT EXISTS subcategories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE, description TEXT, display_order INTEGER DEFAULT 0, status INTEGER DEFAULT 1);
  CREATE TABLE IF NOT EXISTS brands (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, country TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, logo TEXT, banner_image TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, sku TEXT UNIQUE NOT NULL, price REAL NOT NULL, comparePrice REAL, costPrice REAL, weight TEXT, material TEXT, dimensions TEXT, color TEXT, brand TEXT, brand_id INTEGER REFERENCES brands(id), stockStatus TEXT DEFAULT 'In Stock', stockQuantity INTEGER DEFAULT 0, visibility INTEGER DEFAULT 1, featured INTEGER DEFAULT 0, features TEXT, metaTitle TEXT, metaDescription TEXT, category_id INTEGER REFERENCES categories(id), subcategory_id INTEGER REFERENCES subcategories(id), images TEXT, rating REAL DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS brand_featured_products (brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE, product_id INTEGER REFERENCES products(id) ON DELETE CASCADE, position INTEGER DEFAULT 0, PRIMARY KEY (brand_id, product_id));
  CREATE TABLE IF NOT EXISTS home_assignments (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER REFERENCES products(id) ON DELETE CASCADE, tab_slug TEXT NOT NULL, position INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), UNIQUE(product_id, tab_slug));
`);

// Check if we need to seed
const existingUser = db.prepare("SELECT id FROM users LIMIT 1").get();
if (!existingUser) {
  const { scryptSync, randomBytes } = _require("node:crypto");
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync("admin123", salt, 64).toString("hex");
  db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run("admin", `${salt}:${hash}`);

  // Seed categories
  const catStmt = db.prepare("INSERT OR IGNORE INTO categories (name, slug, description, image, display_order, status) VALUES (?, ?, ?, ?, ?, 1)");
  const subStmt = db.prepare("INSERT OR IGNORE INTO subcategories (name, slug, category_id, description, display_order, status) VALUES (?, ?, ?, '', ?, 1)");
  
  const categoriesData = [
    { name: "Weapons", slug: "weapons-launchers", description: "Precision airguns, slingshots, and launching systems for sport and field use.", image: "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-airguns_QUU5YAuhX.jpg", subs: [{ name: "Airguns / Pneumatic Rifles", slug: "airguns" }, { name: "Airgun Pellets & Ammunition", slug: "airgun-pellets" }, { name: "Slingshots", slug: "slingshots" }] },
    { name: "Optics", slug: "optics-lasers", description: "High-performance scopes, binoculars, sights, and laser targeting systems.", image: "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-pellets_XFDJx1kuQ.jpg", subs: [{ name: "Gun Scopes & Optics", slug: "gun-scopes" }, { name: "Binoculars & Field Optics", slug: "binoculars" }, { name: "Tactical Flashlights", slug: "tactical-flashlights" }, { name: "Aiming Lasers", slug: "aiming-lasers" }] },
    { name: "Cases & Holsters", slug: "cases-holsters", description: "Protective cases, holsters, pouches, and carry solutions for every mission.", image: "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-pouches_EWSfLgldc.jpg", subs: [{ name: "Gun Covers", slug: "gun-covers" }, { name: "Pistol Holsters", slug: "pistol-holsters" }, { name: "Tactical Travel Gear", slug: "tactical-travel-gear" }, { name: "Pistol Boxes & Firearm Safes", slug: "pistol-boxes-safes" }, { name: "Drop-Leg Pouches", slug: "drop-leg-pouches" }] },
    { name: "Tactical Gear", slug: "tactical-apparel", description: "Duty-ready uniforms, vests, jackets, belts, and tactical clothing.", image: "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-vests_OMfPi852D.jpg", subs: [{ name: "Tactical Uniforms", slug: "tactical-uniforms" }, { name: "Hunting Jackets", slug: "hunting-jackets" }, { name: "Tactical Vests", slug: "tactical-vests" }, { name: "Magazine Jackets", slug: "magazine-jackets" }, { name: "Tactical Belts", slug: "tactical-belts" }, { name: "Leather Holster Belts", slug: "leather-holster-belts" }] },
    { name: "Field Tools", slug: "maintenance-tools", description: "Cleaning kits, lubricants, brushes, and essential field maintenance equipment.", image: "https://ik.imagekit.io/chaudaryrauf/wildwood/categories/cat-accessories_PQUqIqX6T.jpg", subs: [{ name: "Firearm Cleaning Kits", slug: "cleaning-kits" }, { name: "Cleaning Brushes", slug: "cleaning-brushes" }, { name: "Weapon Lubricants", slug: "weapon-lubricants" }, { name: "Anti-Rust Solutions", slug: "anti-rust-solutions" }, { name: "Hunting & Survival Knives", slug: "hunting-knives" }] },
  ];

  const catIds = {};
  categoriesData.forEach((cat, ci) => {
    const result = catStmt.run(cat.name, cat.slug, cat.description, cat.image, ci + 1);
    catIds[cat.slug] = result.lastInsertRowid;
    cat.subs.forEach((sub, si) => {
      subStmt.run(sub.name, sub.slug, catIds[cat.slug], si + 1);
    });
  });
  console.log("Categories seeded");
}

// Seed original brands
const brandSeedData = [
  ["Gerber", "China"], ["Browning", "China"], ["Discoverer", "China"], ["Spike", "China"],
  ["5.11 Tactical", "United States"], ["SNOWPEAK", "China"], ["GAMO", "Spain"],
  ["Jet", "Iran"], ["Duniya Bachman", "Iran"], ["JSB", "Spain"],
  ["Salman Kash Maker", "Pakistan"], ["Green Pigeon", "Pakistan"], ["Diabolo", "Pakistan"], ["Hunter", "Pakistan"],
  ["Target", "Pakistan"], ["Shaheen", "Pakistan"], ["Diamond", "Pakistan"], ["Nishan", "Pakistan"],
];

const brandInsert = db.prepare("INSERT OR IGNORE INTO brands (name, country, slug) VALUES (?, ?, ?)");
for (const [name, country] of brandSeedData) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  brandInsert.run(name, country, slug);
}
console.log("Original brands seeded");

// ADD NEW BRANDS for our products
const newBrandsData = [
  ["Hatsan", "Turkey", "Turkish airgun manufacturer known for break-barrel and PCP air rifles"],
  ["Reximex", "Turkey", "Turkish PCP air rifle manufacturer based in Konya, known for bullpup designs"],
  ["Kral Arms", "Turkey", "Turkish airgun manufacturer producing PCP and break-barrel air rifles"],
  ["Artemis", "China", "Chinese airgun brand manufactured by Snowpeak Air Gun Factory"],
  ["Arrow", "Spain", "Spanish airgun brand"],
];

const brandInsertWithDesc = db.prepare("INSERT OR IGNORE INTO brands (name, country, slug, description) VALUES (?, ?, ?, ?)");
for (const [name, country, description] of newBrandsData) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  brandInsertWithDesc.run(name, country, slug, description);
}
console.log("New brands added");

// List all brands
const brands = db.prepare("SELECT * FROM brands ORDER BY country, name").all();
console.log("\nAll brands in database:");
console.table(brands);

// Get category and subcategory IDs
const cats = db.prepare("SELECT * FROM categories").all();
console.log("\nCategories:");
console.table(cats);
const subs = db.prepare("SELECT * FROM subcategories").all();
console.log("\nSubcategories:");
console.table(subs);

db.close();
console.log("\nDatabase ready!");
