import { ApiResponse, Profile } from "@/app/_lib/type";
import { NextResponse } from "next/server";
import { runQuery } from "../../../../../../util/qeuryService";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
): Promise<NextResponse<ApiResponse<Profile>>> {
  try {
    const { username } = params;

    if (!username?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_USERNAME",
          message: "Username is required",
        },
        { status: 400 }
      );
    }

    const userQuery = `
      SELECT id, "profileId" 
      FROM "User" 
      WHERE username = $1
    `;

    const userResult = await runQuery<{ id: number; profileId: number }>(
      userQuery,
      [username]
    );

    if (userResult.length === 0 || !userResult[0].profileId) {
      return NextResponse.json(
        {
          success: false,
          error: "PROFILE_NOT_FOUND",
          message: "User or profile not found for the specified username",
        },
        { status: 404 }
      );
    }

    const userId = userResult[0].id;
    const profileId = userResult[0].profileId;

    const profileQuery = `
      SELECT 
        id,
        name,
        about,
        "socialMediaURL",
        "avatarImage",
        "backgroundImage",
        "successMessage",
        "created_at",
        "updated_at"
      FROM "Profile"
      WHERE id = $1
    `;

    const profileResult = await runQuery<Profile>(profileQuery, [profileId]);

    if (profileResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "PROFILE_NOT_FOUND",
          message: "Profile data not found",
        },
        { status: 404 }
      );
    }

    const responseData = {
      id: profileResult[0].id,
      name: profileResult[0].name,
      about: profileResult[0].about,
      avatarImage: profileResult[0].avatarImage,
      socialMediaURL: profileResult[0].socialMediaURL,
      backgroundImage: profileResult[0].backgroundImage,
      successMessage:
        profileResult[0].successMessage || "Thank you for your support!",
      userId: userId,
      created_at: profileResult[0].created_at,
      updated_at: profileResult[0].updated_at,
    };

    return NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to fetch profile data:", err);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch profile data",
        ...(process.env.NODE_ENV === "development" && {
          details: err instanceof Error ? err.message : String(err),
        }),
      },
      { status: 500 }
    );
  }
}
