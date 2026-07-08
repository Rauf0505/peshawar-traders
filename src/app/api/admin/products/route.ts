import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/lib/api/products.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createProduct({ data: body });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
