import { NextRequest, NextResponse } from "next/server";
import { getProductsFiltered } from "@/lib/api/brands.server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const data: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      data[key] = value;
    });
    const result = await getProductsFiltered({ data });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
