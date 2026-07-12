import { NextRequest, NextResponse } from "next/server";
import { getAttributeById, updateAttribute, deleteAttribute } from "@/lib/api/attributes.server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const attr = await getAttributeById(Number(id));
    if (!attr) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(attr);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await updateAttribute({ ...body, id: Number(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await deleteAttribute({ token: body.token, id: Number(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
