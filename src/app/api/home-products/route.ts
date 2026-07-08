import { NextRequest, NextResponse } from "next/server";
import { getHomePageProducts } from "@/lib/api/home-assignments.server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tabSlug = searchParams.get("tabSlug") || "all";
    const result = await getHomePageProducts({ data: { tabSlug } });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
