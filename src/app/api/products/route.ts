import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductsByCategory, getProductsBySubcategory } from "@/lib/api/products.server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const brand = searchParams.get("brand");

    let result;
    if (category) {
      result = await getProductsByCategory({ data: { categorySlug: category } });
    } else if (subcategory) {
      result = await getProductsBySubcategory({ data: { subcategorySlug: subcategory } });
    } else {
      result = await getProducts();
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
