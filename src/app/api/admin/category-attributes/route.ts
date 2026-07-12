import { NextRequest, NextResponse } from "next/server";
import { getCategoryAttributesInclude, setCategoryAttributes } from "@/lib/api/attributes.server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = Number(searchParams.get("categoryId"));
    if (!categoryId) return NextResponse.json({ error: "categoryId required" }, { status: 400 });
    const list = await getCategoryAttributesInclude(categoryId);
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await setCategoryAttributes(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
