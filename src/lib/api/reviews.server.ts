import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { getDb } from "../db/connection.server";
import { productReviews, products } from "../db/schema.server";
import { verifyToken } from "./auth.server";

async function updateProductAverageRating(db: any, productId: number) {
  const reviewsList = await db
    .select({ rating: productReviews.rating })
    .from(productReviews)
    .where(eq(productReviews.productId, productId));

  let avgRating = 0;
  if (reviewsList.length > 0) {
    avgRating = reviewsList.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewsList.length;
  }

  await db
    .update(products)
    .set({ rating: avgRating })
    .where(eq(products.id, productId));
}

function requireAuth(token: string) {
  const user = verifyToken(token);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export const getProductReviews = createServerFn({ method: "GET" })
  .validator(z.object({ productId: z.number() }))
  .handler(async ({ data }) => {
    const db = await getDb();
    const rows = await db
      .select()
      .from(productReviews)
      .where(eq(productReviews.productId, data.productId))
      .orderBy(desc(productReviews.createdAt));
    return rows;
  });

export const createReview = createServerFn({ method: "POST" })
  .validator(
    z.object({
      productId: z.number(),
      reviewerName: z.string().min(1),
      reviewerEmail: z.string().email().optional().or(z.literal("")),
      rating: z.number().min(1).max(5),
      title: z.string().optional(),
      comment: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const db = await getDb();
    const now = new Date().toISOString();
    const [result] = await db
      .insert(productReviews)
      .values({
        productId: data.productId,
        reviewerName: data.reviewerName,
        reviewerEmail: data.reviewerEmail || null,
        rating: data.rating,
        title: data.title || null,
        comment: data.comment,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    await updateProductAverageRating(db, data.productId);
    return result;
  });

export const getAllReviews = createServerFn({ method: "GET" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const db = await getDb();
    const rows = await db
      .select()
      .from(productReviews)
      .orderBy(desc(productReviews.createdAt));
    return rows;
  });

export const updateReview = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string(),
      id: z.number(),
      reviewerName: z.string().min(1),
      reviewerEmail: z.string().email().optional().or(z.literal("")),
      rating: z.number().min(1).max(5),
      title: z.string().optional(),
      comment: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const db = await getDb();
    const [result] = await db
      .update(productReviews)
      .set({
        reviewerName: data.reviewerName,
        reviewerEmail: data.reviewerEmail || null,
        rating: data.rating,
        title: data.title || null,
        comment: data.comment,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(productReviews.id, data.id))
      .returning();

    if (result) {
      await updateProductAverageRating(db, result.productId);
    }
    return result;
  });

export const deleteReview = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string(),
      id: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const db = await getDb();
    const review = await db
      .select({ productId: productReviews.productId })
      .from(productReviews)
      .where(eq(productReviews.id, data.id))
      .limit(1);

    await db.delete(productReviews).where(eq(productReviews.id, data.id));

    if (review.length > 0) {
      await updateProductAverageRating(db, review[0].productId);
    }
    return { success: true };
  });

export const getFiveStarReviews = createServerFn({ method: "GET" })
  .handler(async () => {
    const db = await getDb();
    const rows = await db
      .select({
        id: productReviews.id,
        reviewerName: productReviews.reviewerName,
        rating: productReviews.rating,
        title: productReviews.title,
        comment: productReviews.comment,
        createdAt: productReviews.createdAt,
        productName: products.name,
      })
      .from(productReviews)
      .innerJoin(products, eq(productReviews.productId, products.id))
      .where(eq(productReviews.rating, 5))
      .orderBy(desc(productReviews.createdAt))
      .limit(30);
    return rows;
  });
