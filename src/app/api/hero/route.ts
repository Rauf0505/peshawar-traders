import { NextResponse } from "next/server";
import { getHeroSlides } from "@/lib/api/hero.server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slides = await getHeroSlides();
    return NextResponse.json(slides);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
