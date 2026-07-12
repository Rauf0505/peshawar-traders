import { NextRequest, NextResponse } from "next/server";
import { changePassword } from "@/lib/api/auth.server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await changePassword({ data });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to change password" }, { status: 400 });
  }
}
