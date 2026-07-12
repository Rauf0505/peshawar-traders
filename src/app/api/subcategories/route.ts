import { NextRequest, NextResponse } from "next/server";
import { getSubcategories, getSubcategoriesByCategory } from "@/lib/api/products.server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    if (categoryId) {
      const result = await getSubcategoriesByCategory({ data: { categoryId: Number(categoryId) } });
      return NextResponse.json(result);
    }
    const result = await getSubcategories();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
