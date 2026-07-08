import { NextRequest, NextResponse } from "next/server";
import { uploadProductImage, uploadBrandImage, deleteProductImage } from "@/lib/api/upload.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ...data } = body;
    let result;
    if (type === "brand") {
      result = await uploadBrandImage({ data });
    } else {
      result = await uploadProductImage({ data });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await deleteProductImage({ data: body });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
