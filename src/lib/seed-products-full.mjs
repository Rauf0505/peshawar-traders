import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const _require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const ASSETS_BASE = join(__dirname, "..", "..", "src", "assets", "guns");

const Database = _require("better-sqlite3");
const ImageKit = _require("imagekit");

const imagekit = new ImageKit({
  publicKey: "public_qBoLGEmh5+qne11/yOZy1vuMShM=",
  privateKey: "private_IE9d7LggyJPDJiLU4cu7Imbud7Y=",
  urlEndpoint: "https://ik.imagekit.io/chaudaryrauf",
});

const db = new Database("./data/shop.db");
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function uploadFile(filePath, fileName, folder) {
  const fileBuffer = readFileSync(filePath);
  const base64 = fileBuffer.toString("base64");
  return new Promise((resolve, reject) => {
    imagekit.upload(
      { file: base64, fileName, folder: `/wildwood/guns/${folder}`, useUniqueFileName: true },
      (err, result) => {
        if (err) reject(err);
        else resolve({ url: result.url, fileId: result.fileId });
      }
    );
  });
}

function getBrandId(name) {
  const row = db.prepare("SELECT id FROM brands WHERE name = ? OR slug = ?").get(name, name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  return row ? row.id : null;
}

// Brand mappings
const BRAND_MAP = {
  "SNOWPEAK": 6,  // existing
  "GAMO": 7,      // existing
  "Hatsan": 19,
  "Reximex": 20,
  "Kral Arms": 21,
  "Artemis": 22,
  "Arrow": 23,
};

// All product data with country, folder, brand info
const PRODUCTS = [
  // ===== CHINA - SNOWPEAK =====
  { folder: "china air Guns /Snoepeak SR1250W", name: "Snowpeak SR1250W Break Barrel Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 39000, caliber: "5.5mm (.22)", velocity: "800 fps", power: "Gas Piston / Spring", weight: "3.7 kg", dimensions: "1180×200×60 mm", stock: "German Beech Wood" },
  { folder: "china air Guns /Snow peak GR1600W", name: "Snowpeak GR1600W Break Barrel Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 37960, caliber: "5.5mm (.22)", velocity: "1000 fps", power: "Gas Piston", weight: "3.8 kg", dimensions: "1180×46×130 mm", stock: "European Beech" },
  { folder: "china air Guns /SNOWPEAK PR900S GEN 2", name: "Snowpeak PR900S Gen 2 PCP Air Rifle (Synthetic)", brand: "SNOWPEAK", brandId: 6, price: 41999, caliber: "5.5mm (.22)", velocity: "800 fps", power: "PCP Regulated", weight: "2.25 kg", dimensions: "950×55×200 mm", stock: "Synthetic" },
  { folder: "china air Guns /PR900W G2", name: "Snowpeak PR900W Gen 2 PCP Air Rifle (Wood)", brand: "SNOWPEAK", brandId: 6, price: 44500, caliber: "5.5mm (.22)", velocity: "900 fps", power: "PCP Regulated", weight: "2.27 kg", dimensions: "950×55×200 mm", stock: "European Beech" },
  { folder: "china air Guns /pr900s gen 3", name: "Snowpeak PR900S Gen 3 PCP Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 54999, caliber: "5.5mm (.22)", velocity: "900 fps", power: "PCP Regulated", weight: "2.25 kg", dimensions: "950×55×200 mm", stock: "Synthetic" },
  { folder: "china air Guns /pr900 camo colour gernation 2", name: "Snowpeak PR900 Gen 2 Camo PCP Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 44999, caliber: "5.5mm (.22)", velocity: "900 fps", power: "PCP Regulated", weight: "2.27 kg", dimensions: "950×55×200 mm", stock: "Camo Synthetic" },
  { folder: "china air Guns /SR1000S", name: "Snowpeak SR1000S Break Barrel Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 26000, caliber: "5.5mm (.22)", velocity: "750 fps", power: "Spring / Gas Spring", weight: "3.6 kg", dimensions: "1290×180×70 mm", stock: "Polymer" },
  { folder: "china air Guns /sr1000s camo", name: "Snowpeak SR1000S Camo Break Barrel Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 28600, caliber: "5.5mm (.22)", velocity: "750 fps", power: "Spring / Gas Spring", weight: "3.6 kg", dimensions: "1290×180×70 mm", stock: "Camo Polymer" },
  { folder: "china air Guns /SR1000x", name: "Snowpeak SR1000X Break Barrel Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 30000, caliber: "5.5mm (.22)", velocity: "800 fps", power: "Spring / Gas Spring", weight: "3.7 kg", dimensions: "1210×225×55 mm", stock: "Synthetic" },
  { folder: "china air Guns /sr1250w", name: "Snowpeak SR1250W Break Barrel Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 35000, caliber: "5.5mm (.22)", velocity: "800 fps", power: "Spring / Gas Spring", weight: "3.7 kg", dimensions: "1180×200×60 mm", stock: "Wood" },
  { folder: "china air Guns /P15Air", name: "Snowpeak P15 Bullpup PCP Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 100000, caliber: "5.5mm (.22)", velocity: "900 fps", power: "PCP Regulated", weight: "2.0 kg", dimensions: "675×200×40 mm", stock: "European Beech" },
  { folder: "china air Guns /P35 PCP Air Rifle", name: "Snowpeak P35 Bullpup PCP Air Rifle (Black)", brand: "SNOWPEAK", brandId: 6, price: 97000, caliber: "5.5mm (.22)", velocity: "900 fps", power: "PCP Regulated 265CC", weight: "2.4 kg", dimensions: "687×190×51 mm", stock: "Synthetic PP" },
  { folder: "china air Guns /p35 camo", name: "Snowpeak P35 Camo Bullpup PCP Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 100000, caliber: "5.5mm (.22)", velocity: "900 fps", power: "PCP Regulated 265CC", weight: "2.4 kg", dimensions: "687×190×51 mm", stock: "Camo Synthetic" },
  { folder: "china air Guns /P35XAir gun", name: "Snowpeak P35X Bullpup PCP Air Rifle (Wood)", brand: "SNOWPEAK", brandId: 6, price: 140400, caliber: "5.5mm (.22)", velocity: "900 fps", power: "PCP Regulated 280CC", weight: "2.4 kg", dimensions: "675×200×40 mm", stock: "Wood" },
  { folder: "china air Guns /p35xtb", name: "Snowpeak P35X TB Bullpup PCP Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 156999, caliber: "5.5mm (.22)", velocity: "900 fps", power: "PCP Regulated", weight: "2.4 kg", dimensions: "675×200×40 mm", stock: "Synthetic" },
  { folder: "china air Guns /AP900Air", name: "Snowpeak AP900 Mercury Compact PCP Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 85000, caliber: "5.5mm (.22)", velocity: "900 fps", power: "PCP Regulated", weight: "2.2 kg", dimensions: "800×200×60 mm", stock: "Synthetic/Folding" },
  { folder: "china air Guns /ap1000b", name: "Snowpeak AP1000B Mercury PCP Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 100000, caliber: "5.5mm (.22)", velocity: "950 fps", power: "PCP Regulated 500CC", weight: "2.15 kg", dimensions: "945×200×60 mm", stock: "Synthetic/Folding" },
  { folder: "china air Guns /GR1250XAir", name: "Snowpeak GR1250X Break Barrel Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 35000, caliber: "5.5mm (.22)", velocity: "900 fps", power: "Gas Piston 23J", weight: "3.7 kg", dimensions: "1180×200×60 mm", stock: "Wood" },
  { folder: "china air Guns /Artemis P-10", name: "Artemis P-10 Bullpup PCP Air Rifle", brand: "Artemis", brandId: 22, price: 56000, caliber: "5.5mm (.22)", velocity: "1000 fps", power: "PCP 280CC", weight: "3.75 kg", dimensions: "790×40×200 mm", stock: "German Beech" },
  { folder: "china air Guns /m16", name: "Artemis M16A Bullpup PCP Air Rifle", brand: "Artemis", brandId: 22, price: 98000, caliber: "5.5mm (.22)", velocity: "800 fps", power: "PCP 350CC Regulated", weight: "2.5 kg", dimensions: "790×40×200 mm", stock: "Wood Bullpup" },
  { folder: "china air Guns /m22", name: "Artemis M22 PCP Air Rifle", brand: "Artemis", brandId: 22, price: 93600, caliber: "5.5mm (.22)", velocity: "1000 fps", power: "PCP 250CC Regulated", weight: "3.7 kg", dimensions: "1140×200×60 mm", stock: "Beech Wood" },
  { folder: "china air Guns /m60 tb", name: "Snowpeak M60 TB PCP Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 150800, caliber: "5.5mm (.22)", velocity: "1000 fps", power: "PCP 205CC Regulated", weight: "3.0 kg", dimensions: "925×185×55 mm", stock: "Synthetic" },
  { folder: "china air Guns /T Rex rifle", name: "Snowpeak T-Rex PCP Air Rifle", brand: "SNOWPEAK", brandId: 6, price: 120000, caliber: "5.5mm (.22)", velocity: "950 fps", power: "PCP", weight: "3.0 kg", dimensions: "900×200×60 mm", stock: "Synthetic" },

  // ===== SPAIN - GAMO =====
  { folder: "Spain ai Guns/Gamo shadow 1000", name: "Gamo Shadow 1000 Break Barrel Air Rifle", brand: "GAMO", brandId: 7, price: 38000, caliber: "5.5mm (.22)", velocity: "938 fps", power: "Spring Piston 24J", weight: "3.1 kg", dimensions: "1100×200×60 mm", stock: "Synthetic" },
  { folder: "Spain ai Guns/Gamo Whisper X", name: "Gamo Whisper X Break Barrel Air Rifle", brand: "GAMO", brandId: 7, price: 45000, caliber: "5.5mm (.22)", velocity: "938 fps", power: "Spring Piston 24J", weight: "2.6 kg", dimensions: "1170×200×60 mm", stock: "Synthetic" },
  { folder: "Spain ai Guns/Gamo black shadow", name: "Gamo Black Shadow Youth Break Barrel Air Rifle", brand: "GAMO", brandId: 7, price: 38000, caliber: "5.5mm (.22)", velocity: "695 fps", power: "Spring Piston 14J", weight: "2.4 kg", dimensions: "1090×200×60 mm", stock: "Synthetic" },
  { folder: "Spain ai Guns/gamo balck fusion", name: "Gamo Black Fusion IGT Mach 1 Break Barrel Air Rifle", brand: "GAMO", brandId: 7, price: 55000, caliber: "5.5mm (.22)", velocity: "1033 fps", power: "IGT Gas Piston 29J", weight: "3.0 kg", dimensions: "1170×200×60 mm", stock: "Synthetic" },
  { folder: "Spain ai Guns/Gamo Roadster IGT 10X GEN 2", name: "Gamo Roadster IGT 10X GEN 2 Multi-Shot Air Rifle", brand: "GAMO", brandId: 7, price: 65000, caliber: "5.5mm (.22)", velocity: "880 fps", power: "IGT Gas Piston 24J", weight: "3.1 kg", dimensions: "1310×200×60 mm", stock: "Synthetic Thumbhole" },
  { folder: "Spain ai Guns/Arrow PCP", name: "Arrow PCP Air Rifle", brand: "Arrow", brandId: 23, price: 75000, caliber: "5.5mm (.22)", velocity: "900 fps", power: "PCP", weight: "3.0 kg", dimensions: "900×200×60 mm", stock: "Synthetic" },

  // ===== TURKEY =====
  { folder: "Turkey Made/Hatson airtact 1100 camo colour", name: "Hatsan AirTact 1100 Break Barrel Air Rifle (Camo)", brand: "Hatsan", brandId: 19, price: 36000, caliber: "5.5mm (.22)", velocity: "800 fps", power: "Spring Piston", weight: "2.75 kg", dimensions: "1135×200×60 mm", stock: "Camo Synthetic" },
  { folder: "Turkey Made/Hatson airtact camo colour", name: "Hatsan AirTact Break Barrel Air Rifle (Camo)", brand: "Hatsan", brandId: 19, price: 33800, caliber: "5.5mm (.22)", velocity: "800 fps", power: "Spring Piston", weight: "2.75 kg", dimensions: "1135×200×60 mm", stock: "Camo Synthetic" },
  { folder: "Turkey Made/Hatson N06", name: "Hatsan Striker 1100 Edge Break Barrel Air Rifle", brand: "Hatsan", brandId: 19, price: 34000, caliber: "5.5mm (.22)", velocity: "800 fps", power: "Spring Piston", weight: "3.0 kg", dimensions: "1100×200×60 mm", stock: "Black Synthetic" },
  { folder: "Turkey Made/mod65 springer", name: "Hatsan Model 65 Break Barrel Air Rifle (Wood)", brand: "Hatsan", brandId: 19, price: 44000, caliber: "5.5mm (.22)", velocity: "800 fps", power: "Spring Piston SAS", weight: "3.0 kg", dimensions: "1185×200×60 mm", stock: "Turkish Walnut" },
  { folder: "Turkey Made/Empire X", name: "Kral Arms Puncher Empire X Bullpup PCP Air Rifle", brand: "Kral Arms", brandId: 21, price: 150000, caliber: "5.5mm (.22)", velocity: "900 fps", power: "PCP 600CC", weight: "3.6 kg", dimensions: "760×200×60 mm", stock: "Turkish Walnut" },
  { folder: "Turkey Made/Throne gen2", name: "Reximex Throne Gen 2 Bullpup PCP Air Rifle", brand: "Reximex", brandId: 20, price: 160000, caliber: "5.5mm (.22)", velocity: "935 fps", power: "PCP 425CC Regulated", weight: "3.5 kg", dimensions: "850×200×60 mm", stock: "Synthetic Bullpup" },
  { folder: "Turkey Made/Turkey zone", name: "Reximex Zone Bullpup PCP Air Rifle", brand: "Reximex", brandId: 20, price: 105000, caliber: "5.5mm (.22)", velocity: "935 fps", power: "PCP 260CC Regulated", weight: "3.3 kg", dimensions: "900×200×60 mm", stock: "Synthetic Bullpup" },
];

const AIRGUN_CATEGORY_ID = 1;  // Weapons & Launchers
const AIRGUN_SUBCATEGORY_ID = 1;  // Airguns

function generateSku(name, brand) {
  const prefix = brand.substring(0, 3).toUpperCase();
  const short = name.replace(/[^a-zA-Z0-9]/g, "").substring(0, 8).toUpperCase();
  return `${prefix}-${short}-${Date.now()}`;
}

function createDescription(p) {
  return `The ${p.name} is a high-quality air rifle chambered in ${p.caliber} with a muzzle velocity of ${p.velocity}. Powered by ${p.power}, it features a ${p.stock} stock and weighs ${p.weight}. Ideal for target shooting, plinking, and small game hunting.`;
}

async function uploadFolderImages(folderPath, productSlug) {
  const { readdirSync, statSync } = _require("node:fs");
  const results = [];
  
  try {
    const files = readdirSync(folderPath).filter(f => 
      f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg")
    );
    
    for (const file of files) {
      const filePath = join(folderPath, file);
      const stat = statSync(filePath);
      if (stat.size > 20 * 1024 * 1024) { // skip files > 20MB
        console.log(`    Skipping ${file} (too large: ${(stat.size/1024/1024).toFixed(1)}MB)`);
        continue;
      }
      try {
        const result = await uploadFile(filePath, file, productSlug);
        results.push(result.url);
        console.log(`    Uploaded: ${file} -> ${result.url}`);
      } catch (err) {
        console.log(`    Failed: ${file} - ${err.message}`);
      }
    }
  } catch (err) {
    console.log(`    Error reading folder: ${err.message}`);
  }
  
  return results;
}

async function main() {
  console.log("Starting product seeding...\n");
  
  const insertStmt = db.prepare(`
    INSERT INTO products (name, description, sku, price, brand, brand_id, stockStatus, stockQuantity, visibility, featured, features, metaTitle, metaDescription, category_id, subcategory_id, images, weight, material, dimensions, color, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  let total = 0;
  
  for (const p of PRODUCTS) {
    const folderPath = join(ASSETS_BASE, p.folder);
    const productSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const sku = generateSku(p.name, p.brand);
    const description = createDescription(p);
    const metaTitle = `${p.name} | Wildwood Crafts`;
    const metaDescription = `Buy ${p.name} online in Pakistan. ${p.caliber}, ${p.velocity}, ${p.power}. Best price Rs.${p.price.toLocaleString()}.`;
    
    console.log(`Processing: ${p.name}`);
    console.log(`  Folder: ${p.folder}`);
    
    // Upload images
    const imageUrls = await uploadFolderImages(folderPath, productSlug);
    const imagesJson = JSON.stringify(imageUrls);
    
    if (imageUrls.length === 0) {
      console.log(`  WARNING: No images uploaded for ${p.name}`);
    }
    
    // Insert product
    const features = JSON.stringify([`Caliber: ${p.caliber}`, `Velocity: ${p.velocity}`, `Power: ${p.power}`, `Stock: ${p.stock}`]);
    const material = p.stock.includes("Wood") ? "Steel / Wood" : "Steel / Synthetic";
    const color = p.stock.includes("Camo") ? "Camo" : p.stock.includes("Wood") ? "Wood" : "Black";
    
    try {
      insertStmt.run(
        p.name, description, sku, p.price, p.brand, p.brandId,
        "In Stock", 5, 1, 0,
        features, metaTitle, metaDescription,
        AIRGUN_CATEGORY_ID, AIRGUN_SUBCATEGORY_ID,
        imagesJson, p.weight, material, p.dimensions, color, 0
      );
      console.log(`  ✓ Inserted: ${sku}`);
      total++;
    } catch (err) {
      console.log(`  ✗ Error inserting: ${err.message}`);
    }
    
    console.log("");
  }
  
  console.log(`\nTotal products inserted: ${total}`);
  
  // Assign all products to home page
  const allProducts = db.prepare("SELECT id FROM products").all();
  const homeStmt = db.prepare("INSERT OR IGNORE INTO home_assignments (product_id, tab_slug, position) VALUES (?, 'all', ?)");
  for (let i = 0; i < allProducts.length; i++) {
    homeStmt.run(allProducts[i].id, i + 1);
  }
  console.log(`Assigned ${allProducts.length} products to home page`);
  
  db.close();
  console.log("\nDone!");
}

main().catch(console.error);
