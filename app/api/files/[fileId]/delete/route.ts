import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { deleteImageKitFile, bulkDeleteImageKitFiles } from "@/lib/imagekit";
import { getAllDescendantRecords } from "@/lib/db/hierarchy";

export async function DELETE(
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

    const idsToDelete = [item.id];
    const imagekitIdsToDelete: string[] = [];

    if (item.imagekitFileId) {
      imagekitIdsToDelete.push(item.imagekitFileId);
    }

    // If folder, recursively collect all descendant records and their imagekit IDs
    if (item.isFolder) {
      const descendants = await getAllDescendantRecords(session.id, [item.id]);
      for (const d of descendants) {
        idsToDelete.push(d.id);
        if (d.imagekitFileId) {
          imagekitIdsToDelete.push(d.imagekitFileId);
        }
      }
    }

    // Delete assets from ImageKit cloud storage
    if (imagekitIdsToDelete.length > 0) {
      if (imagekitIdsToDelete.length === 1) {
        await deleteImageKitFile(imagekitIdsToDelete[0]);
      } else {
        await bulkDeleteImageKitFiles(imagekitIdsToDelete);
      }
    }

    // Delete records from PostgreSQL
    await db
      .delete(files)
      .where(and(eq(files.userId, session.id), inArray(files.id, idsToDelete)));

    return NextResponse.json({
      success: true,
      message: "Permanently deleted",
      deletedCount: idsToDelete.length,
    });
  } catch (error) {
    console.error("Permanent delete error:", error);
    return NextResponse.json(
      { error: "Failed to permanently delete item" },
      { status: 500 },
    );
  }
}
