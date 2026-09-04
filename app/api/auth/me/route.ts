import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users, files } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate user storage stats
    const [storageStats] = await db
      .select({
        totalSize: sql<number>`coalesce(sum(${files.size}), 0)`,
        totalFiles: sql<number>`count(${files.id})`,
      })
      .from(files)
      .where(and(eq(files.userId, session.id), eq(files.isFolder, false)));

    return NextResponse.json({
      user: {
        ...user,
        stats: {
          totalSize: Number(storageStats?.totalSize || 0),
          totalFiles: Number(storageStats?.totalFiles || 0),
        },
      },
    });
  } catch (error) {
    console.error("Fetch user profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}
