import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/api/auth.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await verifyAuth({ data: body });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
