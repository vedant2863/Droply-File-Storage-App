import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, parentId } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();
    let folderPath = `/${trimmedName}`;

    // Verify parent folder if provided
    if (parentId && parentId !== "null") {
      const [parent] = await db
        .select({ id: files.id, path: files.path })
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, session.id),
            eq(files.isFolder, true),
          ),
        )
        .limit(1);

      if (!parent) {
        return NextResponse.json(
          { error: "Parent folder not found" },
          { status: 404 },
        );
      }
      folderPath = `${parent.path}/${trimmedName}`;
    }

    // Check for duplicate name inside the same folder level
    const duplicateCondition = [
      eq(files.userId, session.id),
      eq(files.name, trimmedName),
      eq(files.isTrash, false),
      parentId && parentId !== "null"
        ? eq(files.parentId, parentId)
        : isNull(files.parentId),
    ];

    const [existing] = await db
      .select({ id: files.id })
      .from(files)
      .where(and(...duplicateCondition))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "An item with this name already exists in this directory." },
        { status: 409 },
      );
    }

    const [newFolder] = await db
      .insert(files)
      .values({
        name: trimmedName,
        path: folderPath,
        size: 0,
        type: "folder",
        userId: session.id,
        parentId: parentId && parentId !== "null" ? parentId : null,
        isFolder: true,
      })
      .returning();

    return NextResponse.json({ folder: newFolder }, { status: 201 });
  } catch (error) {
    console.error("Create folder error:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 },
    );
  }
}
