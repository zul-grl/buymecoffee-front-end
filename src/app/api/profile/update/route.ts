import { NextResponse } from "next/server";
import { runQuery } from "../../../../../util/qeuryService";
import { Profile } from "@/app/_lib/type";

export async function PATCH(request: Request) {
  try {
    const {
      userId,
      name,
      about,
      socialMediaURL,
      avatarImage,
      backgroundImage,
      successMessage,
    } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const profileIdQuery = `SELECT "profileId" FROM "User" WHERE id = $1`;
    const profileIdResult = await runQuery<{ profileId: number }>(
      profileIdQuery,
      [userId]
    );

    if (profileIdResult.length === 0 || !profileIdResult[0].profileId) {
      return NextResponse.json(
        { success: false, error: "User profile not found" },
        { status: 404 }
      );
    }

    const profileId = profileIdResult[0].profileId;
    const updateQuery = `
      UPDATE "Profile"
      SET 
        name = COALESCE($1, name),
        about = COALESCE($2, about),
        "socialMediaURL" = COALESCE($3, "socialMediaURL"),
        "avatarImage" = COALESCE($4, "avatarImage"),
        "backgroundImage" = COALESCE($5, "backgroundImage"),
        "successMessage" = COALESCE($6, "successMessage"),
        "updated_at" = NOW()
      WHERE id = $7
      RETURNING *
    `;

    const result = await runQuery<Profile>(updateQuery, [
      name,
      about,
      socialMediaURL,
      avatarImage,
      backgroundImage,
      successMessage,
      profileId,
    ]);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Profile update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile",
        details:
          process.env.NODE_ENV === "development"
            ? err instanceof Error
              ? err.message
              : String(err)
            : undefined,
      },
      { status: 500 }
    );
  }
}
