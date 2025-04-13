import { NextResponse } from "next/server";
import { runQuery } from "../../../../util/qeuryService";
import { Profile } from "@/app/_lib/type";

export async function GET(): Promise<NextResponse> {
  try {
    const getProfile = `SELECT name,about FROM "Profile"`;
    const profile = await runQuery(getProfile);

    return new NextResponse(JSON.stringify({ Profiles: profile }));
  } catch (err) {
    console.error("Failed to run query:", err);
    return new NextResponse(
      JSON.stringify({ error: true, message: "Failed to run query" }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request): Promise<NextResponse<Profile>> {
  try {
    const {
      name,
      about,
      socialMediaURL,
      avatarImage,
      userId,
      backgroundImage,
      successMessage,
    } = await req.json();

    if (userId === null || userId === undefined) {
      return new NextResponse(
        JSON.stringify({ error: true, message: "User ID is required" }),
        {
          status: 400,
        }
      );
    }
    const createProfile = `INSERT INTO "Profile" (name, about, "socialMediaURL" ,"avatarImage" , "backgroundImage" , "successMessage" ) VALUES ($1, $2, $3,$4 , $5, $6 ) RETURNING * `;

    const profile: Profile[] = await runQuery(createProfile, [
      name,
      about,
      socialMediaURL,
      avatarImage,
      backgroundImage || null,
      successMessage || null,
    ]);

    const createdProfile = profile[0];

    const UPDATE_PROFILE = `UPDATE "User" SET "profileId" = $1 WHERE id = $2`;

    const updateProfile = await runQuery(UPDATE_PROFILE, [
      createdProfile?.id,
      userId,
    ]);
    return new NextResponse(
      JSON.stringify({
        profile: profile[0],
        updateProfile: updateProfile[0],
        userId: userId,
        message: "Profile created successfully",
      })
    );
  } catch (err) {
    console.error("Failed to run query:", err);
    return new NextResponse(
      JSON.stringify({ error: true, message: "Failed to create profile" }),
      {
        status: 500,
      }
    );
  }
}
