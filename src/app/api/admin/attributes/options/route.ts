import { NextRequest, NextResponse } from "next/server";
import { getAttributeOptions, createAttributeOption } from "@/lib/api/attributes.server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const attributeId = Number(searchParams.get("attributeId"));
    if (!attributeId) return NextResponse.json({ error: "attributeId required" }, { status: 400 });
    const list = await getAttributeOptions(attributeId);
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createAttributeOption(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
