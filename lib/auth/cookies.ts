import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const ACCESS_COOKIE_NAME = "droply_access_token";
export const REFRESH_COOKIE_NAME = "droply_refresh_token";

const ACCESS_MAX_AGE = 15 * 60; // 15 minutes in seconds
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Set auth cookies on a NextResponse object
 */
export function setAuthCookiesOnResponse(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string,
) {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: accessToken,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });

  if (refreshToken) {
    response.cookies.set({
      name: REFRESH_COOKIE_NAME,
      value: refreshToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_MAX_AGE,
    });
  }

  return response;
}

/**
 * Clear auth cookies on a NextResponse object
 */
export function clearAuthCookiesOnResponse(response: NextResponse) {
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

/**
 * Read tokens from server request cookies
 */
export async function getTokensFromCookies() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
  return { accessToken, refreshToken };
}
