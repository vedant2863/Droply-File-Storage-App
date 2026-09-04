import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { files, FileRecord } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { getAllDescendantRecords } from "@/lib/db/hierarchy";

interface DownloadFileItem {
  id: string;
  name: string;
  fileUrl: string;
  relativePath: string;
  size: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemIds } = await req.json();
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json({ error: "No items selected" }, { status: 400 });
    }

    // Fetch the directly selected items
    const selected = await db
      .select()
      .from(files)
      .where(and(eq(files.userId, session.id), inArray(files.id, itemIds)));

    const downloadList: DownloadFileItem[] = [];

    // Separate direct files and folders
    const directFiles = selected.filter(
      (item) => !item.isFolder && item.fileUrl,
    );
    for (const f of directFiles) {
      downloadList.push({
        id: f.id,
        name: f.name,
        fileUrl: f.fileUrl!,
        relativePath: f.name,
        size: f.size,
      });
    }

    const directFolders = selected.filter((item) => item.isFolder);

    for (const folder of directFolders) {
      // Find all nested records under this folder
      const descendants = await getAllDescendantRecords(session.id, [
        folder.id,
      ]);
      const allUnderFolder: FileRecord[] = [folder, ...descendants];

      // Build folder map for fast path building
      const idToFolder = new Map<string, FileRecord>();
      for (const rec of allUnderFolder) {
        if (rec.isFolder) {
          idToFolder.set(rec.id, rec);
        }
      }

      function buildRelativePath(item: FileRecord): string {
        const parts: string[] = [item.name];
        let currentParentId = item.parentId;

        while (currentParentId && currentParentId !== folder.parentId) {
          const parentFolder = idToFolder.get(currentParentId);
          if (parentFolder) {
            parts.unshift(parentFolder.name);
            currentParentId = parentFolder.parentId;
          } else {
            break;
          }
        }
        return parts.join("/");
      }

      for (const d of descendants) {
        if (!d.isFolder && d.fileUrl) {
          downloadList.push({
            id: d.id,
            name: d.name,
            fileUrl: d.fileUrl,
            relativePath: buildRelativePath(d),
            size: d.size,
          });
        }
      }
    }

    return NextResponse.json({ files: downloadList });
  } catch (error) {
    console.error("Download tree preparation error:", error);
    return NextResponse.json(
      { error: "Failed to prepare download manifest" },
      { status: 500 },
    );
  }
}
