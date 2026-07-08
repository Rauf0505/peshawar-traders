import { NextRequest, NextResponse } from "next/server";
import { createBrand } from "@/lib/api/brands.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createBrand({ data: body });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
