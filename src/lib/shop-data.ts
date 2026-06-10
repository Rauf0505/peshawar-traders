export interface Subcategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
  subcategories: Subcategory[];
}

export interface ProductAttr { rating?: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  weight: string;
  material: string;
  dimensions: string;
  color: string;
  brand: string;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock" | "Discontinued";
  stockQuantity: number;
  visibility: boolean;
  featured: boolean;
  features: string[];
  metaTitle: string;
  metaDescription: string;
  category: string;
  subcategory: string;
  images: string[];
}

export const categories: Category[] = [
  {
    name: "Weapons & Launchers",
    slug: "weapons-launchers",
    description: "Precision airguns, slingshots, and launching systems for sport and field use.",
    image: "https://images.unsplash.com/photo-1585747861115-d7f9b5b91a8f?w=800&q=80",
    count: 48,
    subcategories: [
      { name: "Airguns", slug: "airguns" },
      { name: "Airgun Pellets", slug: "airgun-pellets" },
      { name: "Slingshots", slug: "slingshots" },
    ],
  },
  {
    name: "Optics & Lasers",
    slug: "optics-lasers",
    description: "High-performance scopes, binoculars, sights, and laser targeting systems.",
    image: "https://images.unsplash.com/photo-1517147177326-b37599372b73?w=800&q=80",
    count: 32,
    subcategories: [
      { name: "Gun Scopes", slug: "gun-scopes" },
      { name: "Binoculars", slug: "binoculars" },
      { name: "Sights & Lasers", slug: "sights-lasers" },
    ],
  },
  {
    name: "Cases, Holsters & Carry",
    slug: "cases-holsters",
    description: "Protective cases, holsters, pouches, and carry solutions for every mission.",
    image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437b7?w=800&q=80",
    count: 56,
    subcategories: [
      { name: "Pistol Boxes & Safes", slug: "pistol-boxes-safes" },
      { name: "Gun Covers", slug: "gun-covers" },
      { name: "Travel Bags", slug: "travel-bags" },
      { name: "Pistol Pouches", slug: "pistol-pouches" },
      { name: "Drop-Leg Pouches", slug: "drop-leg-pouches" },
    ],
  },
  {
    name: "Tactical Apparel & Gear",
    slug: "tactical-apparel",
    description: "Duty-ready uniforms, vests, jackets, belts, and tactical clothing.",
    image: "https://images.unsplash.com/photo-1596729426342-8c0f5216ae60?w=800&q=80",
    count: 41,
    subcategories: [
      { name: "Uniforms", slug: "uniforms" },
      { name: "Hunter Jackets", slug: "hunter-jackets" },
      { name: "Tactical & Magazine Vests", slug: "tactical-vests" },
      { name: "Duty Belts", slug: "duty-belts" },
    ],
  },
  {
    name: "Maintenance & Field Tools",
    slug: "maintenance-tools",
    description: "Cleaning kits, lubricants, brushes, and essential field maintenance equipment.",
    image: "https://images.unsplash.com/photo-1581092335397-9583eb92a232?w=800&q=80",
    count: 38,
    subcategories: [
      { name: "Cleaning Kits", slug: "cleaning-kits" },
      { name: "Detailing Brushes", slug: "detailing-brushes" },
      { name: "Weapon Oils & Greases", slug: "weapon-oils" },
      { name: "Corrosion Inhibitors", slug: "corrosion-inhibitors" },
      { name: "Hunting Knives", slug: "hunting-knives" },
    ],
  },
];

export const products: ProductAttr[] = [
  {
    name: "Apex Precision PCP Air Rifle",
    description:
      "High-precision pre-charged pneumatic air rifle for competitive shooting and hunting.",
    sku: "APEX-PCP-001",
    price: 689,
    comparePrice: 749,
    weight: "3.2 kg",
    material: "Steel / Synthetic",
    dimensions: "112 x 8 x 30 cm",
    color: "Black",
    brand: "Apex",
    stockStatus: "In Stock",
    stockQuantity: 15,
    visibility: true,
    featured: true,
    features: [
      "Pre-charged pneumatic system",
      "Adjustable trigger",
      "Integrated sound moderator",
      "Side-lever action",
    ],
    metaTitle: "Apex Precision PCP Air Rifle",
    metaDescription: "High-precision PCP air rifle for competitive shooting.",
    category: "Weapons & Launchers",
    subcategory: "Airguns",
    images: ["https://images.unsplash.com/photo-1585747861115-d7f9b5b91a8f?w=800&q=80"],
  },
  {
    name: "Tactical MOLLE Vest",
    description: "Modular lightweight load-carrying equipment vest with MOLLE webbing.",
    sku: "TAC-MOLLE-002",
    price: 189,
    weight: "1.1 kg",
    material: "Nylon / Polyester",
    dimensions: "56 x 42 x 5 cm",
    color: "Coyote Brown",
    brand: "Ridgeline",
    stockStatus: "In Stock",
    stockQuantity: 28,
    visibility: true,
    featured: true,
    features: [
      "Adjustable MOLLE webbing",
      "Quick-release buckles",
      "Hydration bladder compatible",
      "Padding shoulder straps",
    ],
    metaTitle: "Tactical MOLLE Vest",
    metaDescription: "Modular tactical vest with MOLLE webbing system.",
    category: "Tactical Apparel & Gear",
    subcategory: "Tactical & Magazine Vests",
    images: ["https://images.unsplash.com/photo-1596729426342-8c0f5216ae60?w=800&q=80"],
  },
  {
    name: "Hunter's Reserve .22 Pellets",
    description: "Premium grade .22 caliber pellets for consistent accuracy and clean penetration.",
    sku: "HR-22-PEL-003",
    price: 24,
    weight: "0.5 kg",
    material: "Lead / Copper",
    dimensions: "5 x 5 x 15 cm",
    color: "Silver",
    brand: "Hunter's Reserve",
    stockStatus: "In Stock",
    stockQuantity: 200,
    visibility: true,
    featured: true,
    features: [
      "Match-grade accuracy",
      "Lubricated skirt",
      "500 count tin",
      "Consistent weight sorting",
    ],
    metaTitle: "Hunter's Reserve .22 Pellets",
    metaDescription: "Premium .22 caliber pellets for precision shooting.",
    category: "Weapons & Launchers",
    subcategory: "Airgun Pellets",
    images: ["https://images.unsplash.com/photo-1517147177326-b37599372b73?w=800&q=80"],
  },
  {
    name: "Summit 10x42 HD Binoculars",
    description: "High-definition binoculars with multi-coated lenses for crystal-clear viewing.",
    sku: "SUM-1042-HD-004",
    price: 459,
    comparePrice: 519,
    weight: "0.7 kg",
    material: "Aluminum / Rubber",
    dimensions: "15 x 12 x 5 cm",
    color: "Black",
    brand: "Summit",
    stockStatus: "In Stock",
    stockQuantity: 10,
    visibility: true,
    featured: true,
    features: [
      "10x magnification",
      "42mm objective lens",
      "Fully multi-coated",
      "Waterproof / Fogproof",
    ],
    metaTitle: "Summit 10x42 HD Binoculars",
    metaDescription: "High-definition binoculars with multi-coated lenses.",
    category: "Optics & Lasers",
    subcategory: "Binoculars",
    images: ["https://images.unsplash.com/photo-1517147177326-b37599372b73?w=800&q=80"],
  },
  {
    name: "Blackwood Field Knife",
    description: "Full-tang field knife with premium steel blade and ergonomic handle.",
    sku: "BW-FK-005",
    price: 139,
    weight: "0.3 kg",
    material: "Stainless Steel / G10",
    dimensions: "25 x 4 x 2 cm",
    color: "Black",
    brand: "Blackwood",
    stockStatus: "In Stock",
    stockQuantity: 35,
    visibility: true,
    featured: true,
    features: [
      "Full tang construction",
      "Drop point blade",
      "G10 handle scales",
      "Includes Kydex sheath",
    ],
    metaTitle: "Blackwood Field Knife",
    metaDescription: "Full-tang field knife with premium steel blade.",
    category: "Maintenance & Field Tools",
    subcategory: "Hunting Knives",
    images: ["https://images.unsplash.com/photo-1581092335397-9583eb92a232?w=800&q=80"],
  },
  {
    name: "Trailhead 45L Tactical Pack",
    description: "45-liter tactical backpack with multiple compartments and hydration system.",
    sku: "TH-45L-TP-006",
    price: 219,
    weight: "1.8 kg",
    material: "Nylon / Mesh",
    dimensions: "55 x 35 x 20 cm",
    color: "Coyote Brown",
    brand: "Trailhead",
    stockStatus: "In Stock",
    stockQuantity: 18,
    visibility: true,
    featured: false,
    features: ["45L capacity", "MOLLE compatible", "Hydration sleeve", "Compression straps"],
    metaTitle: "Trailhead 45L Tactical Pack",
    metaDescription: "45L tactical backpack with hydration system.",
    category: "Tactical Apparel & Gear",
    subcategory: "Tactical & Magazine Vests",
    images: ["https://images.unsplash.com/photo-1596729426342-8c0f5216ae60?w=800&q=80"],
  },
  {
    name: "Coyote Drop-Leg Pouch",
    description: "Drop-leg tactical pouch with quick-access design for sidearm or tools.",
    sku: "CY-DLP-007",
    price: 59,
    weight: "0.2 kg",
    material: "Nylon",
    dimensions: "18 x 12 x 5 cm",
    color: "Coyote Brown",
    brand: "Coyote",
    stockStatus: "In Stock",
    stockQuantity: 45,
    visibility: true,
    featured: false,
    features: ["Drop-leg design", "Quick-release buckle", "MOLLE compatible", "Adjustable straps"],
    metaTitle: "Coyote Drop-Leg Pouch",
    metaDescription: "Drop-leg tactical pouch with quick-access design.",
    category: "Cases, Holsters & Carry",
    subcategory: "Drop-Leg Pouches",
    images: ["https://images.unsplash.com/photo-1605902711622-cfb43c4437b7?w=800&q=80"],
  },
  {
    name: "Ironwood Duty Boots",
    description: "Heavy-duty tactical boots with slip-resistant sole and reinforced toe.",
    sku: "IW-DB-008",
    price: 289,
    comparePrice: 329,
    weight: "1.5 kg",
    material: "Leather / Rubber",
    dimensions: "30 x 12 x 10 cm",
    color: "Black",
    brand: "Ironwood",
    stockStatus: "Low Stock",
    stockQuantity: 5,
    visibility: true,
    featured: true,
    features: [
      "Slip-resistant outsole",
      "Reinforced toe",
      "Waterproof membrane",
      "Anti-fatigue insole",
    ],
    metaTitle: "Ironwood Duty Boots",
    metaDescription: "Heavy-duty tactical boots with slip-resistant sole.",
    category: "Tactical Apparel & Gear",
    subcategory: "Uniforms",
    images: ["https://images.unsplash.com/photo-1596729426342-8c0f5216ae60?w=800&q=80"],
  },
];

export function getProductById(id: string): ProductAttr | undefined {
  return products.find((p) => p.sku === id);
}

export function getProductsByCategory(categorySlug: string): ProductAttr[] {
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return products.filter((p) => p.category === category.name);
}

export function getProductsBySubcategory(subcategorySlug: string): ProductAttr[] {
  const subcategory = categories
    .flatMap((c) => c.subcategories)
    .find((s) => s.slug === subcategorySlug);
  if (!subcategory) return [];
  return products.filter((p) => p.subcategory === subcategory.name);
}
