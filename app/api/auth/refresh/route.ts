import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { refreshTokens, users } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth/jwt";
import {
  setAuthCookiesOnResponse,
  clearAuthCookiesOnResponse,
  REFRESH_COOKIE_NAME,
} from "@/lib/auth/cookies";

export async function POST(req: NextRequest) {
  try {
    const oldRefreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (!oldRefreshToken) {
      const response = NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 },
      );
      return clearAuthCookiesOnResponse(response);
    }

    const payload = await verifyRefreshToken(oldRefreshToken);
    if (!payload) {
      const response = NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 },
      );
      return clearAuthCookiesOnResponse(response);
    }

    // Verify token exists in database and has not expired
    const [tokenRecord] = await db
      .select({
        id: refreshTokens.id,
        userId: refreshTokens.userId,
        userName: users.name,
        userEmail: users.email,
        userAvatar: users.avatarUrl,
      })
      .from(refreshTokens)
      .innerJoin(users, eq(users.id, refreshTokens.userId))
      .where(
        and(
          eq(refreshTokens.token, oldRefreshToken),
          gt(refreshTokens.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!tokenRecord) {
      const response = NextResponse.json(
        { error: "Refresh token revoked or expired" },
        { status: 401 },
      );
      return clearAuthCookiesOnResponse(response);
    }

    // Delete used refresh token (rotation)
    await db.delete(refreshTokens).where(eq(refreshTokens.id, tokenRecord.id));

    // Generate new access token and rotated refresh token
    const newAccessToken = await signAccessToken({
      userId: tokenRecord.userId,
      email: tokenRecord.userEmail,
      name: tokenRecord.userName,
    });

    const newRefreshToken = await signRefreshToken({
      userId: tokenRecord.userId,
      tokenId: crypto.randomUUID(),
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(refreshTokens).values({
      userId: tokenRecord.userId,
      token: newRefreshToken,
      expiresAt,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: tokenRecord.userId,
        name: tokenRecord.userName,
        email: tokenRecord.userEmail,
        avatarUrl: tokenRecord.userAvatar,
      },
    });

    return setAuthCookiesOnResponse(response, newAccessToken, newRefreshToken);
  } catch (error) {
    console.error("Token refresh error:", error);
    const response = NextResponse.json(
      { error: "Token refresh failed" },
      { status: 500 },
    );
    return clearAuthCookiesOnResponse(response);
  }
}
