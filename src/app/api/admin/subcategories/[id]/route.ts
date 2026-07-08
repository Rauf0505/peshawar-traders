import { NextRequest, NextResponse } from "next/server";
import { updateSubcategory, deleteSubcategory } from "@/lib/api/products.server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const result = await updateSubcategory({
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
    const result = await deleteSubcategory({
      data: { token: body.token, id: Number((await params).id) },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
