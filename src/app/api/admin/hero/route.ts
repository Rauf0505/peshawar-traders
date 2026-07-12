import { NextRequest, NextResponse } from "next/server";
import { getAdminHeroSlides, createHeroSlide } from "@/lib/api/hero.server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slides = await getAdminHeroSlides();
    return NextResponse.json(slides);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createHeroSlide({ data: body });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
