import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { bulkDeleteImageKitFiles } from "@/lib/imagekit";
import { getAllDescendantRecords } from "@/lib/db/hierarchy";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, fileIds } = body as {
      action: "star" | "unstar" | "trash" | "restore" | "delete";
      fileIds: string[];
    };

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json({ error: "No files selected" }, { status: 400 });
    }

    // Fetch the selected items to check if any folders were selected
    const selectedItems = await db
      .select()
      .from(files)
      .where(and(eq(files.userId, session.id), inArray(files.id, fileIds)));

    if (selectedItems.length === 0) {
      return NextResponse.json(
        { error: "No matching items found" },
        { status: 404 },
      );
    }

    const folderIds = selectedItems.filter((i) => i.isFolder).map((i) => i.id);

    // Collect all targets including descendants for cascading operations
    let allTargetIds = selectedItems.map((i) => i.id);
    let allTargetImagekitIds: string[] = selectedItems
      .filter((i) => Boolean(i.imagekitFileId))
      .map((i) => i.imagekitFileId as string);

    if (
      folderIds.length > 0 &&
      (action === "trash" || action === "restore" || action === "delete")
    ) {
      const descendants = await getAllDescendantRecords(session.id, folderIds);
      for (const d of descendants) {
        allTargetIds.push(d.id);
        if (d.imagekitFileId) {
          allTargetImagekitIds.push(d.imagekitFileId);
        }
      }
    }

    // Deduplicate IDs
    allTargetIds = Array.from(new Set(allTargetIds));
    allTargetImagekitIds = Array.from(new Set(allTargetImagekitIds));

    switch (action) {
      case "star":
        await db
          .update(files)
          .set({ isStarred: true, updatedAt: new Date() })
          .where(and(eq(files.userId, session.id), inArray(files.id, fileIds)));
        break;

      case "unstar":
        await db
          .update(files)
          .set({ isStarred: false, updatedAt: new Date() })
          .where(and(eq(files.userId, session.id), inArray(files.id, fileIds)));
        break;

      case "trash":
        await db
          .update(files)
          .set({ isTrash: true, updatedAt: new Date() })
          .where(
            and(eq(files.userId, session.id), inArray(files.id, allTargetIds)),
          );
        break;

      case "restore":
        await db
          .update(files)
          .set({ isTrash: false, updatedAt: new Date() })
          .where(
            and(eq(files.userId, session.id), inArray(files.id, allTargetIds)),
          );
        break;

      case "delete":
        // Purge assets from ImageKit CDN
        if (allTargetImagekitIds.length > 0) {
          await bulkDeleteImageKitFiles(allTargetImagekitIds);
        }
        // Permanently delete records from DB in a single SQL operation
        await db
          .delete(files)
          .where(
            and(eq(files.userId, session.id), inArray(files.id, allTargetIds)),
          );
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      action,
      count: allTargetIds.length,
    });
  } catch (error) {
    console.error("Batch operation error:", error);
    return NextResponse.json(
      { error: "Batch operation failed" },
      { status: 500 },
    );
  }
}
