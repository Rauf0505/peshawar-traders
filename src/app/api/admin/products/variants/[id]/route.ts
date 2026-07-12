import { NextRequest, NextResponse } from "next/server";
import {
  getVariantById,
  updateProductVariant,
  deleteProductVariant,
} from "@/lib/api/attributes.server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const variant = await getVariantById(Number(id));
  if (!variant) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(variant);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();
  const result = await updateProductVariant({ ...data, id: Number(id) });
  return NextResponse.json(result);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();
  const result = await deleteProductVariant({ ...data, id: Number(id) });
  return NextResponse.json(result);
}
