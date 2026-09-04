import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { getAllDescendantRecords } from "@/lib/db/hierarchy";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ fileId: string }> },
) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = await props.params;

    const [item] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, session.id)))
      .limit(1);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Determine target trash state (invert current or take body if provided)
    let targetTrashState = !item.isTrash;
    try {
      const body = await req.json();
      if (typeof body?.isTrash === "boolean") {
        targetTrashState = body.isTrash;
      }
    } catch {
      // Body not provided or empty, fallback to toggle
    }

    const idsToUpdate = [item.id];

    // If folder, recursively find all descendants to cascade trash/restore state
    if (item.isFolder) {
      const descendants = await getAllDescendantRecords(session.id, [item.id]);
      for (const d of descendants) {
        idsToUpdate.push(d.id);
      }
    }

    await db
      .update(files)
      .set({ isTrash: targetTrashState, updatedAt: new Date() })
      .where(and(eq(files.userId, session.id), inArray(files.id, idsToUpdate)));

    return NextResponse.json({
      success: true,
      isTrash: targetTrashState,
      updatedCount: idsToUpdate.length,
    });
  } catch (error) {
    console.error("Trash file error:", error);
    return NextResponse.json(
      { error: "Failed to update trash state" },
      { status: 500 },
    );
  }
}
