import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/api/orders.server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || "";
    const result = await getOrders({ data: { token } });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
