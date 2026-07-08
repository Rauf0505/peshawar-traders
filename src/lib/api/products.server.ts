import { z } from "zod";
import { eq, sql, getTableColumns } from "drizzle-orm";
import { getDb } from "../db/connection.server";
import {
  products,
  categories,
  subcategories,
  brands,
  homeAssignments,
} from "../db/schema.server";
import { verifyToken } from "./auth.server";

function requireAuth(token: string) {
  const user = verifyToken(token);
  if (!user) throw new Error("Unauthorized");
  return user;
}

function flattenProduct(row: {
  products: typeof products.$inferSelect;
  categories: typeof categories.$inferSelect | null;
  subcategories: typeof subcategories.$inferSelect | null;
  brands: typeof brands.$inferSelect | null;
}) {
  const p = row.products;
  const c = row.categories;
  const s = row.subcategories;
  const b = row.brands;
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    sku: p.sku,
    price: p.price,
    comparePrice: p.comparePrice ?? null,
    costPrice: p.costPrice ?? null,
    weight: p.weight ?? "",
    material: p.material ?? "",
    dimensions: p.dimensions ?? "",
    color: p.color ?? "",
    brand: p.brand ?? "",
    brandId: p.brandId ?? null,
    brandName: b?.name ?? null,
    brandSlug: b?.slug ?? null,
    brandCountry: b?.country ?? null,
    stockStatus: p.stockStatus ?? "In Stock",
    stockQuantity: p.stockQuantity ?? 0,
    visibility: !!(p.visibility),
    featured: !!(p.featured),
    rating: p.rating ?? 0,
    features: JSON.parse(p.features || "[]"),
    metaTitle: p.metaTitle ?? "",
    metaDescription: p.metaDescription ?? "",
    images: JSON.parse(p.images || "[]"),
    categoryId: p.categoryId ?? null,
    categoryName: c?.name ?? null,
    categorySlug: c?.slug ?? null,
    subcategoryId: p.subcategoryId ?? null,
    subcategoryName: s?.name ?? null,
    subcategorySlug: s?.slug ?? null,
    createdAt: p.createdAt ?? "",
    updatedAt: p.updatedAt ?? "",
  };
}

async function baseProductQuery() {
  const db = await getDb();
  return db
    .select()
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
    .leftJoin(brands, eq(products.brandId, brands.id));
}

export async function getProducts() {
  const db = await getDb();
  const rows = await db
    .select()
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .orderBy(products.name);
  return rows.map(flattenProduct);
}

export async function getProductById({ data }: { data: any }) {
    const db = await getDb();
    const rows = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(eq(products.sku, data.id))
      .limit(1);
    return rows.length > 0 ? flattenProduct(rows[0]) : null;
  }

export async function getProductByDbId({ data }: { data: any }) {
    const db = await getDb();
    const rows = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(eq(products.id, data.id))
      .limit(1);
    return rows.length > 0 ? flattenProduct(rows[0]) : null;
  }

export async function getCategories() {
  const db = await getDb();
  const rows = await db
    .select({
      ...getTableColumns(categories),
      productCount: sql<number>`(SELECT COUNT(*) FROM products WHERE products.category_id = categories.id)`,
    })
    .from(categories)
    .orderBy(categories.displayOrder, categories.name);
  return rows;
}

export async function getSubcategories() {
  const db = await getDb();
  const rows = await db
    .select({
      ...getTableColumns(subcategories),
      categoryName: categories.name,
    })
    .from(subcategories)
    .leftJoin(categories, eq(subcategories.categoryId, categories.id))
    .orderBy(subcategories.name);
  return rows;
}

export async function getProductsByCategory({ data }: { data: any }) {
    const db = await getDb();
    const rows = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(eq(categories.slug, data.categorySlug))
      .orderBy(products.name);
    return rows.map(flattenProduct);
  }

export async function getProductsBySubcategory({ data }: { data: any }) {
    const db = await getDb();
    const rows = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(eq(subcategories.slug, data.subcategorySlug))
      .orderBy(products.name);
    return rows.map(flattenProduct);
  }

export async function createProduct({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    const now = new Date().toISOString();
    const [result] = await db
      .insert(products)
      .values({
        name: data.name,
        description: data.description ?? "",
        sku: data.sku,
        price: data.price,
        comparePrice: data.comparePrice ?? null,
        weight: data.weight ?? "",
        material: data.material ?? "",
        dimensions: data.dimensions ?? "",
        color: data.color ?? "",
        brand: data.brand ?? "",
        brandId: data.brandId ?? null,
        stockStatus: data.stockStatus ?? "In Stock",
        stockQuantity: data.stockQuantity ?? 0,
        visibility: data.visibility ? 1 : 0,
        featured: data.featured ? 1 : 0,
        features: JSON.stringify(data.features ?? []),
        metaTitle: data.metaTitle ?? "",
        metaDescription: data.metaDescription ?? "",
        categoryId: data.categoryId ?? null,
        subcategoryId: data.subcategoryId ?? null,
        images: JSON.stringify(data.images ?? []),
        rating: data.rating ?? 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: products.id });
    return { id: result.id };
  }

export async function updateProduct({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db
      .update(products)
      .set({
        name: data.name,
        description: data.description ?? "",
        sku: data.sku,
        price: data.price,
        comparePrice: data.comparePrice ?? null,
        weight: data.weight ?? "",
        material: data.material ?? "",
        dimensions: data.dimensions ?? "",
        color: data.color ?? "",
        brand: data.brand ?? "",
        brandId: data.brandId ?? null,
        stockStatus: data.stockStatus ?? "In Stock",
        stockQuantity: data.stockQuantity ?? 0,
        visibility: data.visibility ? 1 : 0,
        featured: data.featured ? 1 : 0,
        features: JSON.stringify(data.features ?? []),
        metaTitle: data.metaTitle ?? "",
        metaDescription: data.metaDescription ?? "",
        categoryId: data.categoryId ?? null,
        subcategoryId: data.subcategoryId ?? null,
        images: JSON.stringify(data.images ?? []),
        rating: data.rating ?? 0,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(products.id, data.id));
    return { success: true };
  }

export async function deleteProduct({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db.delete(homeAssignments).where(eq(homeAssignments.productId, data.id));
    await db.delete(products).where(eq(products.id, data.id));
    return { success: true };
  }

// ─── Categories CRUD ────────────────────────────────────────────────────────

export async function getCategoriesWithSubcategories() {
  const db = await getDb();
  const cats = await db
    .select()
    .from(categories)
    .where(eq(categories.status, 1))
    .orderBy(categories.displayOrder, categories.name);
  const subs = await db
    .select()
    .from(subcategories)
    .where(eq(subcategories.status, 1))
    .orderBy(subcategories.displayOrder, subcategories.name);
  const catMap: Record<number, any> = {};
  for (const cat of cats) {
    catMap[cat.id] = { ...cat, subcategories: [] };
  }
  for (const sub of subs) {
    const catId = sub.categoryId;
    if (catId != null && catMap[catId]) {
      catMap[catId].subcategories.push({ id: sub.id, name: sub.name, slug: sub.slug });
    }
  }
  return Object.values(catMap);
}

export async function createCategory({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    const [result] = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        displayOrder: data.displayOrder ?? 0,
        status: data.status ?? 1,
      })
      .returning({ id: categories.id });
    return { id: result.id };
  }

export async function updateCategory({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db
      .update(categories)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        displayOrder: data.displayOrder ?? 0,
        status: data.status ?? 1,
      })
      .where(eq(categories.id, data.id));
    return { success: true };
  }

export async function deleteCategory({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db
      .update(products)
      .set({ categoryId: null, subcategoryId: null })
      .where(eq(products.categoryId, data.id));
    await db.delete(subcategories).where(eq(subcategories.categoryId, data.id));
    await db.delete(categories).where(eq(categories.id, data.id));
    return { success: true };
  }

// ─── Subcategories CRUD ─────────────────────────────────────────────────────

export async function getSubcategoriesByCategory({ data }: { data: any }) {
    const db = await getDb();
    const rows = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.categoryId, data.categoryId))
      .orderBy(subcategories.displayOrder, subcategories.name);
    return rows;
  }

export async function createSubcategory({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    const [result] = await db
      .insert(subcategories)
      .values({
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        description: data.description ?? "",
        displayOrder: data.displayOrder ?? 0,
        status: data.status ?? 1,
      })
      .returning({ id: subcategories.id });
    return { id: result.id };
  }

export async function updateSubcategory({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db
      .update(subcategories)
      .set({
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        description: data.description ?? "",
        displayOrder: data.displayOrder ?? 0,
        status: data.status ?? 1,
      })
      .where(eq(subcategories.id, data.id));
    return { success: true };
  }

export async function deleteSubcategory({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db
      .update(products)
      .set({ subcategoryId: null, categoryId: null })
      .where(eq(products.subcategoryId, data.id));
    await db.delete(subcategories).where(eq(subcategories.id, data.id));
    return { success: true };
  }
