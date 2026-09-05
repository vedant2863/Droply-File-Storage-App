import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db/seed";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const force = searchParams.get("force") === "true";
    const email = searchParams.get("email") || undefined;
    const name = searchParams.get("name") || undefined;
    const password = searchParams.get("password") || undefined;

    const result = await seedDatabase({
      force,
      email,
      name,
      password,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("GET /api/seed error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed database",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown> = {};

    try {
      body = await req.json();
    } catch {
      // Body is optional; fallback to default values if body is empty
      body = {};
    }

    const force = Boolean(body.force);
    const email = typeof body.email === "string" ? body.email : undefined;
    const name = typeof body.name === "string" ? body.name : undefined;
    const password =
      typeof body.password === "string" ? body.password : undefined;

    const result = await seedDatabase({
      force,
      email,
      name,
      password,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("POST /api/seed error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed database",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
