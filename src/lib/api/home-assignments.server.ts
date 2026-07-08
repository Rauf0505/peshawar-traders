import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { getDb } from "../db/connection.server";
import { products, categories, subcategories, homeAssignments } from "../db/schema.server";
import { verifyToken } from "./auth.server";

function requireAuth(token: string) {
  const user = verifyToken(token);
  if (!user) throw new Error("Unauthorized");
  return user;
}

function safeJsonParse(val: unknown, fallback: any = []) {
  try {
    const parsed = JSON.parse((val as string) || "[]");
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function mapProductRow(row: any, position: number) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    sku: row.sku,
    price: row.price,
    comparePrice: row.comparePrice ?? null,
    weight: row.weight ?? "",
    material: row.material ?? "",
    dimensions: row.dimensions ?? "",
    color: row.color ?? "",
    brand: row.brand ?? "",
    stockStatus: row.stockStatus ?? "In Stock",
    stockQuantity: row.stockQuantity ?? 0,
    visibility: !!(row.visibility),
    featured: !!(row.featured),
    rating: row.rating ?? 0,
    features: safeJsonParse(row.features),
    metaTitle: row.metaTitle ?? "",
    metaDescription: row.metaDescription ?? "",
    images: safeJsonParse(row.images),
    category: row.categoryName ?? null,
    categorySlug: row.categorySlug ?? null,
    subcategory: row.subcategoryName ?? null,
    subcategorySlug: row.subcategorySlug ?? null,
    position,
  };
}

async function getAllProducts(db: any) {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      sku: products.sku,
      price: products.price,
      comparePrice: products.comparePrice,
      weight: products.weight,
      material: products.material,
      dimensions: products.dimensions,
      color: products.color,
      brand: products.brand,
      stockStatus: products.stockStatus,
      stockQuantity: products.stockQuantity,
      visibility: products.visibility,
      featured: products.featured,
      rating: products.rating,
      features: products.features,
      metaTitle: products.metaTitle,
      metaDescription: products.metaDescription,
      images: products.images,
      categoryName: categories.name,
      categorySlug: categories.slug,
      subcategoryName: subcategories.name,
      subcategorySlug: subcategories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
    .where(eq(products.visibility, 1))
    .orderBy(products.id);

  return rows.map((row, i) => mapProductRow(row, i + 1));
}

export async function getHomeAssignments() {
  const db = await getDb();
  const rows = await db
    .select({
      id: homeAssignments.id,
      productId: homeAssignments.productId,
      tabSlug: homeAssignments.tabSlug,
      position: homeAssignments.position,
      createdAt: homeAssignments.createdAt,
      productName: products.name,
      sku: products.sku,
      price: products.price,
      images: products.images,
    })
    .from(homeAssignments)
    .innerJoin(products, eq(homeAssignments.productId, products.id))
    .orderBy(homeAssignments.tabSlug, homeAssignments.position);

  const grouped: Record<string, Array<Record<string, any>>> = {};
  for (const row of rows) {
    const tab = row.tabSlug;
    if (!grouped[tab]) grouped[tab] = [];
    grouped[tab].push({
      ...row,
      images: safeJsonParse(row.images),
    });
  }
  return grouped;
}

export async function getHomePageProducts({ data }: { data: any }) {
    const db = await getDb();

    if (data.tabSlug === "all") {
      return getAllProducts(db);
    }

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        sku: products.sku,
        price: products.price,
        comparePrice: products.comparePrice,
        weight: products.weight,
        material: products.material,
        dimensions: products.dimensions,
        color: products.color,
        brand: products.brand,
        stockStatus: products.stockStatus,
        stockQuantity: products.stockQuantity,
        visibility: products.visibility,
        featured: products.featured,
        rating: products.rating,
        features: products.features,
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
        images: products.images,
        categoryName: categories.name,
        categorySlug: categories.slug,
        subcategoryName: subcategories.name,
        subcategorySlug: subcategories.slug,
        position: homeAssignments.position,
      })
      .from(homeAssignments)
      .innerJoin(products, eq(homeAssignments.productId, products.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .where(and(
        eq(homeAssignments.tabSlug, data.tabSlug),
        eq(products.visibility, 1),
      ))
      .orderBy(homeAssignments.position);

    return rows.map((row) => mapProductRow(row, row.position));
  }

export async function setHomeAssignment({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db
      .delete(homeAssignments)
      .where(
        and(
          eq(homeAssignments.productId, data.productId),
          eq(homeAssignments.tabSlug, data.tabSlug),
        ),
      );
    await db.insert(homeAssignments).values({
      productId: data.productId,
      tabSlug: data.tabSlug,
      position: data.position,
    });
    return { success: true };
  }

export async function removeHomeAssignment({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db
      .delete(homeAssignments)
      .where(
        and(
          eq(homeAssignments.productId, data.productId),
          eq(homeAssignments.tabSlug, data.tabSlug),
        ),
      );
    return { success: true };
  }

export async function reorderHomeAssignments({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db.delete(homeAssignments).where(eq(homeAssignments.tabSlug, data.tabSlug));
    if (data.productIds.length > 0) {
      await db.insert(homeAssignments).values(
        data.productIds.map((pid, index) => ({
          productId: pid,
          tabSlug: data.tabSlug,
          position: index + 1,
        })),
      );
    }
    return { success: true };
  }
