import { eq, asc } from "drizzle-orm";
import { getDb } from "../db/connection.server";
import { attributes, attributeOptions, categoryAttributes, productVariants, productVariantOptions } from "../db/schema.server";
import { verifyToken } from "./auth.server";

export async function getAttributes() {
  const db = await getDb();
  return db.select().from(attributes).orderBy(asc(attributes.sortOrder));
}

export async function getAttributeBySlug(slug: string) {
  const db = await getDb();
  const rows = await db.select().from(attributes).where(eq(attributes.slug, slug)).limit(1);
  return rows[0] || null;
}

export async function getAttributeById(id: number) {
  const db = await getDb();
  const rows = await db.select().from(attributes).where(eq(attributes.id, id)).limit(1);
  return rows[0] || null;
}

export async function createAttribute(data: {
  token: string;
  name: string;
  slug: string;
  type?: string;
  isVariantDefining?: number;
  sortOrder?: number;
}) {
  await verifyToken(data.token);
  const db = await getDb();
  const rows = await db
    .insert(attributes)
    .values({
      name: data.name,
      slug: data.slug,
      type: data.type || "text",
      isVariantDefining: data.isVariantDefining ?? 0,
      sortOrder: data.sortOrder ?? 0,
    })
    .returning({ id: attributes.id });
  return rows[0];
}

export async function updateAttribute(data: {
  token: string;
  id: number;
  name?: string;
  slug?: string;
  type?: string;
  isVariantDefining?: number;
  sortOrder?: number;
}) {
  await verifyToken(data.token);
  const db = await getDb();
  await db
    .update(attributes)
    .set({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.isVariantDefining !== undefined && { isVariantDefining: data.isVariantDefining }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
    })
    .where(eq(attributes.id, data.id));
}

export async function deleteAttribute(data: { token: string; id: number }) {
  await verifyToken(data.token);
  const db = await getDb();
  await db.delete(attributeOptions).where(eq(attributeOptions.attributeId, data.id));
  await db.delete(categoryAttributes).where(eq(categoryAttributes.attributeId, data.id));
  await db.delete(attributes).where(eq(attributes.id, data.id));
}

// Option management
export async function getAttributeOptions(attributeId: number) {
  const db = await getDb();
  return db
    .select()
    .from(attributeOptions)
    .where(eq(attributeOptions.attributeId, attributeId))
    .orderBy(asc(attributeOptions.sortOrder));
}

export async function createAttributeOption(data: {
  token: string;
  attributeId: number;
  value: string;
  meta?: string;
  sortOrder?: number;
}) {
  await verifyToken(data.token);
  const db = await getDb();
  const rows = await db
    .insert(attributeOptions)
    .values({
      attributeId: data.attributeId,
      value: data.value,
      meta: data.meta || null,
      sortOrder: data.sortOrder ?? 0,
    })
    .returning({ id: attributeOptions.id });
  return rows[0];
}

export async function updateAttributeOption(data: {
  token: string;
  id: number;
  value?: string;
  meta?: string;
  sortOrder?: number;
}) {
  await verifyToken(data.token);
  const db = await getDb();
  await db
    .update(attributeOptions)
    .set({
      ...(data.value !== undefined && { value: data.value }),
      ...(data.meta !== undefined && { meta: data.meta }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
    })
    .where(eq(attributeOptions.id, data.id));
}

// ─── Product Variants ──────────────────────────────────────────────

export async function getProductVariants(productId: number) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId))
    .orderBy(asc(productVariants.sortOrder));
  const result: any[] = [];
  for (const v of rows) {
    const opts = await db
      .select()
      .from(productVariantOptions)
      .innerJoin(attributeOptions, eq(productVariantOptions.attributeOptionId, attributeOptions.id))
      .innerJoin(attributes, eq(attributeOptions.attributeId, attributes.id))
      .where(eq(productVariantOptions.variantId, v.id));
    result.push({
      id: v.id,
      productId: v.productId,
      skuSuffix: v.skuSuffix,
      priceOverride: v.priceOverride,
      sortOrder: v.sortOrder,
      isActive: v.isActive,
      images: JSON.parse(v.images || "[]"),
      options: opts.map((o) => ({
        attributeOptionId: o.attribute_options.id,
        attributeId: o.attribute_options.attributeId,
        value: o.attribute_options.value,
        meta: o.attribute_options.meta,
        attributeName: o.attributes.name,
        attributeType: o.attributes.type,
      })),
    });
  }
  return result;
}

export async function getVariantById(id: number) {
  const db = await getDb();
  const [v] = await db.select().from(productVariants).where(eq(productVariants.id, id)).limit(1);
  if (!v) return null;
  const opts = await db
    .select()
    .from(productVariantOptions)
    .innerJoin(attributeOptions, eq(productVariantOptions.attributeOptionId, attributeOptions.id))
    .innerJoin(attributes, eq(attributeOptions.attributeId, attributes.id))
    .where(eq(productVariantOptions.variantId, v.id));
  return {
    id: v.id,
    productId: v.productId,
    skuSuffix: v.skuSuffix,
    priceOverride: v.priceOverride,
    sortOrder: v.sortOrder,
    isActive: v.isActive,
    images: JSON.parse(v.images || "[]"),
    options: opts.map((o) => ({
      attributeOptionId: o.attribute_options.id,
      attributeId: o.attribute_options.attributeId,
      value: o.attribute_options.value,
      meta: o.attribute_options.meta,
      attributeName: o.attributes.name,
      attributeType: o.attributes.type,
    })),
  };
}

export async function createProductVariant(data: {
  token: string;
  productId: number;
  skuSuffix?: string;
  priceOverride?: number;
  images?: string[];
  sortOrder?: number;
  isActive?: number;
  optionIds: number[];
}) {
  await verifyToken(data.token);
  const db = await getDb();
  const [variant] = await db
    .insert(productVariants)
    .values({
      productId: data.productId,
      skuSuffix: data.skuSuffix ?? null,
      priceOverride: data.priceOverride ?? null,
      images: JSON.stringify(data.images ?? []),
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? 1,
    })
    .returning({ id: productVariants.id });
  if (data.optionIds.length > 0) {
    await db.insert(productVariantOptions).values(
      data.optionIds.map((oid) => ({ variantId: variant.id, attributeOptionId: oid })),
    );
  }
  return { id: variant.id };
}

export async function updateProductVariant(data: {
  token: string;
  id: number;
  skuSuffix?: string;
  priceOverride?: number;
  images?: string[];
  sortOrder?: number;
  isActive?: number;
  optionIds?: number[];
}) {
  await verifyToken(data.token);
  const db = await getDb();
  await db
    .update(productVariants)
    .set({
      ...(data.skuSuffix !== undefined && { skuSuffix: data.skuSuffix }),
      ...(data.priceOverride !== undefined && { priceOverride: data.priceOverride }),
      ...(data.images !== undefined && { images: JSON.stringify(data.images) }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    })
    .where(eq(productVariants.id, data.id));
  if (data.optionIds !== undefined) {
    await db.delete(productVariantOptions).where(eq(productVariantOptions.variantId, data.id));
    if (data.optionIds.length > 0) {
      await db.insert(productVariantOptions).values(
        data.optionIds.map((oid) => ({ variantId: data.id, attributeOptionId: oid })),
      );
    }
  }
  return { success: true };
}

export async function deleteProductVariant(data: { token: string; id: number }) {
  await verifyToken(data.token);
  const db = await getDb();
  await db.delete(productVariantOptions).where(eq(productVariantOptions.variantId, data.id));
  await db.delete(productVariants).where(eq(productVariants.id, data.id));
  return { success: true };
}

export async function deleteAttributeOption(data: { token: string; id: number }) {
  await verifyToken(data.token);
  const db = await getDb();
  await db.delete(attributeOptions).where(eq(attributeOptions.id, data.id));
}

// Category-attribute assignments
export async function getCategoryAttributesInclude(categoryId: number) {
  const db = await getDb();
  const rows = await db
    .select({
      categoryId: categoryAttributes.categoryId,
      attributeId: categoryAttributes.attributeId,
      required: categoryAttributes.required,
      sortOrder: categoryAttributes.sortOrder,
      showInFilter: categoryAttributes.showInFilter,
      attribute: attributes,
    })
    .from(categoryAttributes)
    .where(eq(categoryAttributes.categoryId, categoryId))
    .innerJoin(attributes, eq(categoryAttributes.attributeId, attributes.id))
    .orderBy(asc(categoryAttributes.sortOrder));
  return rows;
}

export async function setCategoryAttributes(data: {
  token: string;
  categoryId: number;
  assignments: { attributeId: number; required?: number; sortOrder?: number; showInFilter?: number }[];
}) {
  await verifyToken(data.token);
  const db = await getDb();
  await db.delete(categoryAttributes).where(eq(categoryAttributes.categoryId, data.categoryId));
  if (data.assignments.length > 0) {
    await db.insert(categoryAttributes).values(
      data.assignments.map((a) => ({
        categoryId: data.categoryId,
        attributeId: a.attributeId,
        required: a.required ?? 0,
        sortOrder: a.sortOrder ?? 0,
        showInFilter: a.showInFilter ?? 0,
      })),
    );
  }
}
