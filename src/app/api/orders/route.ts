import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/api/orders.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createOrder({ data: body });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
