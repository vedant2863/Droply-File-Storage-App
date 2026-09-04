import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { bulkDeleteImageKitFiles } from "@/lib/imagekit";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all trashed items
    const trashedItems = await db
      .select({
        id: files.id,
        imagekitFileId: files.imagekitFileId,
      })
      .from(files)
      .where(and(eq(files.userId, session.id), eq(files.isTrash, true)));

    if (trashedItems.length === 0) {
      return NextResponse.json({
        message: "Trash is already empty",
        purgedCount: 0,
      });
    }

    const imagekitIds = trashedItems
      .filter((i) => Boolean(i.imagekitFileId))
      .map((i) => i.imagekitFileId as string);

    // Bulk purge cloud storage assets
    if (imagekitIds.length > 0) {
      await bulkDeleteImageKitFiles(imagekitIds);
    }

    // Purge records from database
    await db
      .delete(files)
      .where(and(eq(files.userId, session.id), eq(files.isTrash, true)));

    return NextResponse.json({
      success: true,
      message: "Trash emptied successfully",
      purgedCount: trashedItems.length,
    });
  } catch (error) {
    console.error("Empty trash error:", error);
    return NextResponse.json(
      { error: "Failed to empty trash" },
      { status: 500 },
    );
  }
}
