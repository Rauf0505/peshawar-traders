import { NextRequest, NextResponse } from "next/server";
import { updateHeroSlide, deleteHeroSlide } from "@/lib/api/hero.server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const result = await updateHeroSlide({
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
    await deleteHeroSlide({
      data: { token: body.token, id: Number((await params).id) },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
