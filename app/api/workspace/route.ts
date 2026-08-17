import { NextResponse } from "next/server";
import { loadWorkspaceData, saveWorkspaceData } from "@/lib/db";
import { normalizeData } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await loadWorkspaceData();
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Workspace GET failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Database error" }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const raw = await request.json();
    const payload = normalizeData(raw);
    const result = await saveWorkspaceData(payload);
    return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Workspace PUT failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Database error" }, { status: 503 });
  }
}
