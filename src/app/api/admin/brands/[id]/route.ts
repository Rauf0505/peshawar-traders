import { NextRequest, NextResponse } from "next/server";
import { updateBrand, deleteBrand } from "@/lib/api/brands.server";
import { createBrand } from "@/lib/api/brands.server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const result = await updateBrand({
      data: { ...body, id: Number((await params).id) },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const result = await deleteBrand({
      data: { token: body.token, id: Number((await params).id) },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
