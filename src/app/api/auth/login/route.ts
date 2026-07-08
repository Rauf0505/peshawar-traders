import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/api/auth.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await login({ data: body });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
