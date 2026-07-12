import { z } from "zod";
import { eq, sql, and, or, like, asc, desc, getTableColumns, type SQL } from "drizzle-orm";
import { getDb } from "../db/connection.server";
import { products, categories, subcategories, brands, brandFeaturedProducts } from "../db/schema.server";
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
    brand: p.brand ?? "",
    brandId: p.brandId ?? null,
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
    brandName: b?.name ?? null,
    brandSlug: b?.slug ?? null,
    brandCountry: b?.country ?? null,
    createdAt: p.createdAt ?? "",
    updatedAt: p.updatedAt ?? "",
  };
}

export async function getBrands() {
  const db = await getDb();
  const rows = await db
    .select({
      ...getTableColumns(brands),
      productCount: sql<number>`COUNT(products.id)`,
    })
    .from(brands)
    .leftJoin(products, eq(products.brandId, brands.id))
    .groupBy(brands.id)
    .orderBy(
      sql`CASE WHEN ${brands.country} = 'Pakistan' THEN 0 ELSE 1 END`,
      sql`CASE WHEN ${brands.name} = 'Salman Kash Maker' THEN 0 ELSE 1 END`,
      brands.name,
    );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    slug: r.slug,
    description: r.description ?? null,
    logo: r.logo ?? null,
    bannerImage: r.bannerImage ?? null,
    productCount: r.productCount ?? 0,
    createdAt: r.createdAt ?? "",
    updatedAt: r.updatedAt ?? "",
  }));
}

export async function getBrandBySlug({ data }: { data: any }) {
    const db = await getDb();
    const [brand] = await db
      .select()
      .from(brands)
      .where(eq(brands.slug, data.slug))
      .limit(1);
    if (!brand) return null;

    const featured = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(
        brandFeaturedProducts,
        eq(brandFeaturedProducts.productId, products.id),
      )
      .where(eq(brandFeaturedProducts.brandId, brand.id))
      .orderBy(brandFeaturedProducts.position);

    return {
      id: brand.id,
      name: brand.name,
      country: brand.country,
      slug: brand.slug,
      description: brand.description ?? null,
      logo: brand.logo ?? null,
      bannerImage: brand.bannerImage ?? null,
      featuredProducts: featured.map(flattenProduct),
    };
  }

export async function getProductsByBrand({ data }: { data: any }) {
    const db = await getDb();
    const rows = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(eq(brands.slug, data.brandSlug))
      .orderBy(products.name);
    return rows.map(flattenProduct);
  }

export async function getCountries() {
  const db = await getDb();
  const rows = await db
    .select({ country: brands.country })
    .from(brands)
    .where(and(
      sql`${brands.country} IS NOT NULL`,
      sql`${brands.country} != ''`,
    ))
    .groupBy(brands.country)
    .orderBy(brands.country);
  return rows.map((r) => r.country);
}

export async function getProductsFiltered({ data }: { data: any }) {
    const db = await getDb();
    const conditions: (SQL | undefined)[] = [];

    if (data.category) {
      conditions.push(eq(categories.slug, data.category));
    }
    if (data.brand) {
      conditions.push(eq(brands.slug, data.brand));
    }
    if (data.country) {
      conditions.push(eq(brands.country, data.country));
    }
    if (data.subcategory) {
      conditions.push(eq(subcategories.slug, data.subcategory));
    }
    if (data.search) {
      const pattern = `%${data.search}%`;
      conditions.push(
        or(
          like(products.name, pattern),
          like(products.description ?? "", pattern),
          like(products.sku, pattern),
        ),
      );
    }

    let orderBy;
    if (data.sort === "price-asc") orderBy = [asc(products.price)];
    else if (data.sort === "price-desc") orderBy = [desc(products.price)];
    else if (data.sort === "rating-desc") orderBy = [desc(products.rating)];
    else orderBy = [asc(products.name)];

    const query = db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .leftJoin(brands, eq(products.brandId, brands.id));

    const filteredQuery = conditions.length > 0
      ? query.where(and(...conditions))
      : query;

    const rows = await filteredQuery.orderBy(...orderBy);
    return rows.map(flattenProduct);
  }

export async function createBrand({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    const now = new Date().toISOString();
    const [result] = await db
      .insert(brands)
      .values({
        name: data.name,
        country: data.country,
        slug: data.slug,
        description: data.description ?? "",
        logo: data.logo ?? "",
        bannerImage: data.bannerImage ?? "",
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: brands.id });
    return { id: result.id };
  }

export async function updateBrand({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db
      .update(brands)
      .set({
        name: data.name,
        country: data.country,
        slug: data.slug,
        description: data.description ?? "",
        logo: data.logo ?? "",
        bannerImage: data.bannerImage ?? "",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(brands.id, data.id));
    return { success: true };
  }

export async function deleteBrand({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db.delete(brandFeaturedProducts).where(eq(brandFeaturedProducts.brandId, data.id));
    await db.delete(brands).where(eq(brands.id, data.id));
    return { success: true };
  }

export async function setBrandFeaturedProducts({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db.delete(brandFeaturedProducts).where(eq(brandFeaturedProducts.brandId, data.brandId));
    if (data.productIds.length > 0) {
      await db.insert(brandFeaturedProducts).values(
        data.productIds.map((pid, i) => ({
          brandId: data.brandId,
          productId: pid,
          position: i + 1,
        })),
      );
    }
    return { success: true };
  }

export async function getBrandFeaturedProducts({ data }: { data: any }) {
    const db = await getDb();
    const rows = await db
      .select({ productId: brandFeaturedProducts.productId })
      .from(brandFeaturedProducts)
      .where(eq(brandFeaturedProducts.brandId, data.brandId))
      .orderBy(brandFeaturedProducts.position);
    return rows.map((r) => r.productId);
  }
