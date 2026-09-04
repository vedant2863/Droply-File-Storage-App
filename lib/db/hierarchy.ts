import { db } from "./index";
import { files, FileRecord } from "./schema";
import { eq, and, inArray } from "drizzle-orm";

/**
 * Recursively find all descendant file and folder records for a list of folder IDs
 */
export async function getAllDescendantRecords(
  userId: string,
  folderIds: string[],
): Promise<FileRecord[]> {
  if (!folderIds || folderIds.length === 0) return [];

  const allDescendants: FileRecord[] = [];
  let currentParentIds = [...folderIds];

  while (currentParentIds.length > 0) {
    const children = await db
      .select()
      .from(files)
      .where(
        and(
          eq(files.userId, userId),
          inArray(files.parentId, currentParentIds),
        ),
      );

    if (children.length === 0) break;

    allDescendants.push(...children);

    // Continue downwards only for subfolders
    currentParentIds = children.filter((c) => c.isFolder).map((c) => c.id);
  }

  return allDescendants;
}
