import { NextRequest, NextResponse } from "next/server";
import { getBrandFeaturedProducts, setBrandFeaturedProducts } from "@/lib/api/brands.server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getBrandFeaturedProducts({ data: { brandId: Number(id) } });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;
    const result = await setBrandFeaturedProducts({
      data: { ...body, brandId: Number(id) },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
