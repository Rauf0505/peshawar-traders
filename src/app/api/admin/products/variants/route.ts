import { NextRequest, NextResponse } from "next/server";
import {
  getProductVariants,
  createProductVariant,
} from "@/lib/api/attributes.server";

export async function GET(req: NextRequest) {
  const productId = Number(req.nextUrl.searchParams.get("productId"));
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  const variants = await getProductVariants(productId);
  return NextResponse.json(variants);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await createProductVariant(data);
  return NextResponse.json(result);
}
