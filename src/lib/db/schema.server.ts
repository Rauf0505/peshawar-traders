import {
  pgTable,
  serial,
  integer,
  text,
  real,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const brandFeaturedProducts = pgTable(
  "brand_featured_products",
  {
    brandId: integer("brand_id").notNull(),
    productId: integer("product_id").notNull(),
    position: integer("position").default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.brandId, t.productId] }),
  }),
);

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logo: text("logo"),
  bannerImage: text("banner_image"),
  createdAt: text("created_at").default(sql`current_timestamp`),
  updatedAt: text("updated_at").default(sql`current_timestamp`),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  displayOrder: integer("display_order").default(0),
  status: integer("status").default(1),
});

export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id"),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  status: integer("status").default(1),
});

export const homeAssignments = pgTable(
  "home_assignments",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull(),
    tabSlug: text("tab_slug").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: text("created_at").default(sql`current_timestamp`),
  },
  (t) => ({
    productTabIdx: uniqueIndex("home_assignments_product_id_tab_slug_index").on(
      t.productId,
      t.tabSlug,
    ),
    tabPositionIdx: uniqueIndex("home_assignments_tab_slug_position_index").on(
      t.tabSlug,
      t.position,
    ),
  }),
);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sku: text("sku").notNull().unique(),
  price: real("price").notNull(),
  comparePrice: real("compare_price"),
  costPrice: real("cost_price"),
  weight: text("weight"),
  material: text("material"),
  dimensions: text("dimensions"),
  color: text("color"),
  brand: text("brand"),
  brandId: integer("brand_id"),
  stockStatus: text("stock_status").default("In Stock"),
  stockQuantity: integer("stock_quantity").default(0),
  visibility: integer("visibility").default(1),
  featured: integer("featured").default(0),
  features: text("features"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  categoryId: integer("category_id"),
  subcategoryId: integer("subcategory_id"),
  images: text("images"),
  rating: real("rating").default(0),
  createdAt: text("created_at").default(sql`current_timestamp`),
  updatedAt: text("updated_at").default(sql`current_timestamp`),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default(sql`current_timestamp`),
});
