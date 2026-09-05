import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { getAllDescendantRecords } from "@/lib/db/hierarchy";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fileIds, targetParentId } = body as {
      fileIds: string[];
      targetParentId: string | null;
    };

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: "No files specified to move" },
        { status: 400 },
      );
    }

    let targetFolderName = "Home";

    // 1. If targetParentId is specified, verify it exists, belongs to user, and is a folder
    if (targetParentId) {
      const [targetFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, targetParentId),
            eq(files.userId, session.id),
            eq(files.isFolder, true),
          ),
        )
        .limit(1);

      if (!targetFolder) {
        return NextResponse.json(
          { error: "Target folder does not exist or is not a folder" },
          { status: 400 },
        );
      }
      targetFolderName = targetFolder.name;
    }

    // 2. Fetch the selected items to move
    const selectedItems = await db
      .select()
      .from(files)
      .where(and(eq(files.userId, session.id), inArray(files.id, fileIds)));

    if (selectedItems.length === 0) {
      return NextResponse.json(
        { error: "No matching files found" },
        { status: 404 },
      );
    }

    // 3. Cycle prevention: Cannot move a folder into itself
    if (targetParentId && fileIds.includes(targetParentId)) {
      return NextResponse.json(
        { error: "Cannot move a folder into itself" },
        { status: 400 },
      );
    }

    // 4. Cycle prevention: Cannot move a folder into its own subfolder/descendant
    const selectedFolderIds = selectedItems
      .filter((i) => i.isFolder)
      .map((i) => i.id);

    if (selectedFolderIds.length > 0 && targetParentId) {
      const descendants = await getAllDescendantRecords(
        session.id,
        selectedFolderIds,
      );
      const descendantIdSet = new Set(descendants.map((d) => d.id));
      if (descendantIdSet.has(targetParentId)) {
        return NextResponse.json(
          { error: "Cannot move a folder into one of its own subdirectories" },
          { status: 400 },
        );
      }
    }

    // 5. Update parentId for all items
    await db
      .update(files)
      .set({
        parentId: targetParentId,
        updatedAt: new Date(),
      })
      .where(
        and(eq(files.userId, session.id), inArray(files.id, fileIds)),
      );

    return NextResponse.json({
      success: true,
      message: `Moved ${selectedItems.length} item(s) to ${targetFolderName}`,
      count: selectedItems.length,
      targetParentId,
      targetFolderName,
    });
  } catch (error) {
    console.error("Move operation error:", error);
    return NextResponse.json(
      { error: "Failed to move items" },
      { status: 500 },
    );
  }
}
