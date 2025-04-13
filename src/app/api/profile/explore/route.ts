import { NextResponse } from "next/server";
import { ApiResponse } from "@/app/_lib/type";
import { runQuery } from "../../../../../util/qeuryService";

export async function GET(): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const allProfilesQuery = `
      SELECT 
        p.id, 
        p.name, 
        p.about, 
        p."socialMediaURL", 
        p."avatarImage", 
        p."backgroundImage", 
        p."successMessage",
        u.username
      FROM "Profile" p
      JOIN "User" u ON p.id = u."profileId"
      ORDER BY p."created_at" DESC
    `;

    const profiles = await runQuery(allProfilesQuery, []);

    if (!profiles || profiles.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: "No profiles found",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: profiles,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to fetch profiles:", err);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch profiles",
        ...(process.env.NODE_ENV === "development" && {
          details: err instanceof Error ? err.message : String(err),
        }),
      },
      { status: 500 }
    );
  }
}
