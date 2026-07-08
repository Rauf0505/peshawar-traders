import { NextResponse } from "next/server";
import { getCountries } from "@/lib/api/brands.server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getCountries();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
