import { NextRequest, NextResponse } from "next/server";
import { getCategories, getCategoriesWithSubcategories } from "@/lib/api/products.server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const withSubs = searchParams.get("withSubcategories");
    if (withSubs === "true") {
      const result = await getCategoriesWithSubcategories();
      return NextResponse.json(result);
    }
    const result = await getCategories();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
