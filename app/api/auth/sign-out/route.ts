import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { refreshTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  clearAuthCookiesOnResponse,
  REFRESH_COOKIE_NAME,
} from "@/lib/auth/cookies";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (refreshToken) {
      await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.token, refreshToken));
    }

    const response = NextResponse.json({ message: "Signed out successfully" });
    return clearAuthCookiesOnResponse(response);
  } catch (error) {
    console.error("Sign-out error:", error);
    const response = NextResponse.json({ message: "Signed out" });
    return clearAuthCookiesOnResponse(response);
  }
}
