import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, refreshTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookiesOnResponse } from "@/lib/auth/cookies";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    // Issue tokens
    const accessToken = await signAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const refreshToken = await signRefreshToken({
      userId: user.id,
      tokenId: crypto.randomUUID(),
    });

    // Store refresh token in DB
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    const response = NextResponse.json({
      message: "Sign-in successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });

    return setAuthCookiesOnResponse(response, accessToken, refreshToken);
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { error: "Failed to sign in. Please try again." },
      { status: 500 },
    );
  }
}
