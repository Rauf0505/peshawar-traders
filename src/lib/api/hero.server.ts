import { eq, asc } from "drizzle-orm";
import { getDb } from "../db/connection.server";
import { heroSlides } from "../db/schema.server";
import { verifyToken } from "./auth.server";

function requireAuth(token: string) {
  const user = verifyToken(token);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function getHeroSlides() {
  const db = await getDb();
  return db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.isActive, 1))
    .orderBy(asc(heroSlides.slideOrder));
}

export async function getAdminHeroSlides() {
  const db = await getDb();
  return db
    .select()
    .from(heroSlides)
    .orderBy(asc(heroSlides.slideOrder));
}

export async function createHeroSlide({ data }: { data: any }) {
  requireAuth(data.token);
  const db = await getDb();
  const maxOrder = await db
    .select({ max: heroSlides.slideOrder })
    .from(heroSlides)
    .orderBy(asc(heroSlides.slideOrder))
    .limit(1);

  const nextOrder = (maxOrder[0]?.max ?? 0) + 1;
  const now = new Date().toISOString();
  const [slide] = await db
    .insert(heroSlides)
    .values({
      slideOrder: nextOrder,
      mediaType: data.mediaType || "image",
      mediaUrl: data.mediaUrl,
      eyebrowText: data.eyebrowText ?? null,
      headingLine1: data.headingLine1 ?? null,
      headingLine2: data.headingLine2 ?? null,
      description: data.description ?? null,
      button1Text: data.button1Text ?? null,
      button1Link: data.button1Link ?? null,
      button2Text: data.button2Text ?? null,
      button2Link: data.button2Link ?? null,
      duration: data.duration ?? 5,
      videoMuted: data.videoMuted ?? 1,
      showScrollIndicator: data.showScrollIndicator ?? 1,
      isActive: data.isActive ?? 1,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return slide;
}

export async function updateHeroSlide({ data }: { data: any }) {
  requireAuth(data.token);
  const db = await getDb();
  const now = new Date().toISOString();
  const [slide] = await db
    .update(heroSlides)
    .set({
      mediaType: data.mediaType,
      mediaUrl: data.mediaUrl,
      eyebrowText: data.eyebrowText ?? null,
      headingLine1: data.headingLine1 ?? null,
      headingLine2: data.headingLine2 ?? null,
      description: data.description ?? null,
      button1Text: data.button1Text ?? null,
      button1Link: data.button1Link ?? null,
      button2Text: data.button2Text ?? null,
      button2Link: data.button2Link ?? null,
      duration: data.duration,
      videoMuted: data.videoMuted,
      showScrollIndicator: data.showScrollIndicator,
      isActive: data.isActive,
      updatedAt: now,
    })
    .where(eq(heroSlides.id, data.id))
    .returning();
  return slide;
}

export async function deleteHeroSlide({ data }: { data: any }) {
  requireAuth(data.token);
  const db = await getDb();
  await db.delete(heroSlides).where(eq(heroSlides.id, data.id));
  return { success: true };
}

export async function reorderHeroSlides({ data }: { data: any }) {
  requireAuth(data.token);
  const db = await getDb();
  for (const item of data.slides) {
    await db
      .update(heroSlides)
      .set({ slideOrder: item.slideOrder })
      .where(eq(heroSlides.id, item.id));
  }
  return { success: true };
}
