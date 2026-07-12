import {
  pgTable,
  serial,
  integer,
  text,
  real,
  primaryKey,
  uniqueIndex,
  timestamp,
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
  attributes: text("attributes"),
  rating: real("rating").default(0),
  createdAt: text("created_at").default(sql`current_timestamp`),
  updatedAt: text("updated_at").default(sql`current_timestamp`),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  paymentMethod: text("payment_method").notNull().default("cod"),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  total: real("total").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productSku: text("product_sku").notNull(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  totalPrice: real("total_price").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default(sql`current_timestamp`),
});

export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  slideOrder: integer("slide_order").notNull().default(0),
  mediaType: text("media_type").notNull().default("image"),
  mediaUrl: text("media_url").notNull(),
  eyebrowText: text("eyebrow_text"),
  headingLine1: text("heading_line1"),
  headingLine2: text("heading_line2"),
  description: text("description"),
  button1Text: text("button1_text"),
  button1Link: text("button1_link"),
  button2Text: text("button2_text"),
  button2Link: text("button2_link"),
  duration: integer("duration").default(5),
  videoMuted: integer("video_muted").default(1),
  showScrollIndicator: integer("show_scroll_indicator").default(1),
  isActive: integer("is_active").default(1),
  createdAt: text("created_at").default(sql`current_timestamp`),
  updatedAt: text("updated_at").default(sql`current_timestamp`),
});

export const attributes = pgTable("attributes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull().default("text"),
  isVariantDefining: integer("is_variant_defining").default(0),
  sortOrder: integer("sort_order").default(0),
});

export const attributeOptions = pgTable("attribute_options", {
  id: serial("id").primaryKey(),
  attributeId: integer("attribute_id").notNull().references(() => attributes.id),
  value: text("value").notNull(),
  meta: text("meta"),
  sortOrder: integer("sort_order").default(0),
});

export const categoryAttributes = pgTable(
  "category_attributes",
  {
    categoryId: integer("category_id").notNull().references(() => categories.id),
    attributeId: integer("attribute_id").notNull().references(() => attributes.id),
    required: integer("required").default(0),
    sortOrder: integer("sort_order").default(0),
    showInFilter: integer("show_in_filter").default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.categoryId, t.attributeId] }),
  }),
);

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  skuSuffix: text("sku_suffix"),
  priceOverride: real("price_override"),
  images: text("images"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(1),
});

export const productVariantOptions = pgTable(
  "product_variant_options",
  {
    variantId: integer("variant_id").notNull().references(() => productVariants.id),
    attributeOptionId: integer("attribute_option_id").notNull().references(() => attributeOptions.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.variantId, t.attributeOptionId] }),
  }),
);

export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  reviewerName: text("reviewer_name").notNull(),
  reviewerEmail: text("reviewer_email"),
  rating: integer("rating").notNull(),
  title: text("title"),
  comment: text("comment").notNull(),
  createdAt: text("created_at").default(sql`current_timestamp`),
  updatedAt: text("updated_at").default(sql`current_timestamp`),
});

