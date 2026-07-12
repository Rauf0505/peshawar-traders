import { NextRequest, NextResponse } from "next/server";
import { getAttributes, createAttribute } from "@/lib/api/attributes.server";

export async function GET() {
  try {
    const list = await getAttributes();
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createAttribute(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
