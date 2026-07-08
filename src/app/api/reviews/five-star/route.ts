import { NextResponse } from "next/server";
import { getFiveStarReviews } from "@/lib/api/reviews.server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getFiveStarReviews();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
