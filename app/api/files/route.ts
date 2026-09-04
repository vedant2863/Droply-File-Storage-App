import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, isNull, ilike, desc, asc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const tab = searchParams.get("tab") || "all";
    const parentId = searchParams.get("parentId");
    const searchQuery = searchParams.get("search")?.trim();

    const conditions = [eq(files.userId, session.id)];

    // Breadcrumbs resolution if parentId is specified
    const breadcrumbs: { id: string | null; name: string }[] = [
      { id: null, name: "Home" },
    ];

    if (parentId && parentId !== "null" && parentId !== "undefined") {
      let currentFolderId: string | null = parentId;
      const pathTrail: { id: string; name: string }[] = [];

      while (currentFolderId) {
        const [folder] = await db
          .select({ id: files.id, name: files.name, parentId: files.parentId })
          .from(files)
          .where(
            and(eq(files.id, currentFolderId), eq(files.userId, session.id)),
          )
          .limit(1);

        if (folder) {
          pathTrail.unshift({ id: folder.id, name: folder.name });
          currentFolderId = folder.parentId;
        } else {
          break;
        }
      }
      breadcrumbs.push(...pathTrail);
    }

    // Apply Tab and Hierarchy filters
    if (tab === "trash") {
      conditions.push(eq(files.isTrash, true));
    } else if (tab === "starred") {
      conditions.push(eq(files.isTrash, false));
      conditions.push(eq(files.isStarred, true));
    } else {
      // Default: 'all' tab
      conditions.push(eq(files.isTrash, false));

      if (searchQuery) {
        conditions.push(ilike(files.name, `%${searchQuery}%`));
      } else if (parentId && parentId !== "null" && parentId !== "undefined") {
        conditions.push(eq(files.parentId, parentId));
      } else {
        conditions.push(isNull(files.parentId));
      }
    }

    const items = await db
      .select()
      .from(files)
      .where(and(...conditions))
      .orderBy(desc(files.isFolder), asc(files.name));

    return NextResponse.json({
      items,
      breadcrumbs,
      currentParentId: parentId || null,
    });
  } catch (error) {
    console.error("Fetch files error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      size,
      type,
      fileUrl,
      thumbnailUrl,
      imagekitFileId,
      parentId,
    } = body;

    if (!name || !fileUrl) {
      return NextResponse.json(
        { error: "Missing required file details" },
        { status: 400 },
      );
    }

    let itemPath = `/${name}`;
    if (parentId) {
      const [parent] = await db
        .select({ path: files.path })
        .from(files)
        .where(and(eq(files.id, parentId), eq(files.userId, session.id)))
        .limit(1);

      if (parent) {
        itemPath = `${parent.path}/${name}`;
      }
    }

    const [newFile] = await db
      .insert(files)
      .values({
        name,
        path: itemPath,
        size: Number(size) || 0,
        type: type || "application/octet-stream",
        fileUrl,
        thumbnailUrl: thumbnailUrl || null,
        imagekitFileId: imagekitFileId || null,
        userId: session.id,
        parentId: parentId || null,
        isFolder: false,
      })
      .returning();

    return NextResponse.json({ file: newFile }, { status: 201 });
  } catch (error) {
    console.error("Create file error:", error);
    return NextResponse.json(
      { error: "Failed to save file metadata" },
      { status: 500 },
    );
  }
}
