import { NextRequest, NextResponse } from "next/server";
import {
  getHomeAssignments,
  setHomeAssignment,
  removeHomeAssignment,
  reorderHomeAssignments,
} from "@/lib/api/home-assignments.server";

export async function GET(req: NextRequest) {
  try {
    const result = await getHomeAssignments();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...data } = body;
    let result;
    switch (action) {
      case "set":
        result = await setHomeAssignment({ data });
        break;
      case "remove":
        result = await removeHomeAssignment({ data });
        break;
      case "reorder":
        result = await reorderHomeAssignments({ data });
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
