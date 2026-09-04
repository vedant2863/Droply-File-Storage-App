import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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

    const [file] = await db
      .select({ id: files.id, isStarred: files.isStarred })
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, session.id)))
      .limit(1);

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const newStarred = !file.isStarred;

    const [updated] = await db
      .update(files)
      .set({ isStarred: newStarred, updatedAt: new Date() })
      .where(and(eq(files.id, fileId), eq(files.userId, session.id)))
      .returning();

    return NextResponse.json({ success: true, file: updated });
  } catch (error) {
    console.error("Star file error:", error);
    return NextResponse.json(
      { error: "Failed to update star state" },
      { status: 500 },
    );
  }
}
