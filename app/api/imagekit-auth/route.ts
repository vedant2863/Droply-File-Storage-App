import { NextRequest, NextResponse } from "next/server";
import { getUploadAuthParams } from "@/lib/imagekit";
import { getAuthSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authParams = getUploadAuthParams();
    return NextResponse.json(authParams);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload authorization" },
      { status: 500 },
    );
  }
}
