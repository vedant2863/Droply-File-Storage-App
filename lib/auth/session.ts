import { NextRequest } from "next/server";
import { verifyAccessToken, verifyRefreshToken } from "./jwt";
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "./cookies";
import { db } from "../db";
import { refreshTokens, users } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import type { SessionUser, AccessTokenPayload } from "@/types";

export type { SessionUser };

/**
 * Get current session user from an incoming Request
 */
export async function getAuthSession(
  req: NextRequest | Request,
): Promise<SessionUser | null> {
  try {
    // 1. Check cookies or Authorization header
    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    if (
      "cookies" in req &&
      typeof (req as NextRequest).cookies?.get === "function"
    ) {
      accessToken = (req as NextRequest).cookies.get(ACCESS_COOKIE_NAME)?.value;
      refreshToken = (req as NextRequest).cookies.get(
        REFRESH_COOKIE_NAME,
      )?.value;
    } else {
      const cookieHeader = req.headers.get("cookie") || "";
      const cookies = Object.fromEntries(
        cookieHeader.split(";").map((c) => {
          const [k, ...v] = c.trim().split("=");
          return [k, v.join("=")];
        }),
      );
      accessToken = cookies[ACCESS_COOKIE_NAME];
      refreshToken = cookies[REFRESH_COOKIE_NAME];
    }

    // Check Bearer header fallback
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.substring(7);
    }

    // Verify access token
    if (accessToken) {
      const payload: AccessTokenPayload | null =
        await verifyAccessToken(accessToken);
      if (payload) {
        return {
          id: payload.userId,
          email: payload.email,
          name: payload.name,
        };
      }
    }

    // Fallback: Check if valid refresh token exists in DB to resolve user
    if (refreshToken) {
      const refreshPayload = await verifyRefreshToken(refreshToken);
      if (refreshPayload) {
        const [tokenRow] = await db
          .select({
            userId: refreshTokens.userId,
            expiresAt: refreshTokens.expiresAt,
            userName: users.name,
            userEmail: users.email,
            userAvatar: users.avatarUrl,
          })
          .from(refreshTokens)
          .innerJoin(users, eq(users.id, refreshTokens.userId))
          .where(
            and(
              eq(refreshTokens.token, refreshToken),
              gt(refreshTokens.expiresAt, new Date()),
            ),
          )
          .limit(1);

        if (tokenRow) {
          return {
            id: tokenRow.userId,
            email: tokenRow.userEmail,
            name: tokenRow.userName,
            avatarUrl: tokenRow.userAvatar,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error verifying auth session:", error);
    return null;
  }
}
