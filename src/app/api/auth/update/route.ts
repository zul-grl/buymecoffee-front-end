
import { NextResponse } from "next/server";
import { compareSync, hashSync } from "bcryptjs";
import { runQuery } from "../../../../../util/qeuryService";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId, currentPassword, newPassword } = await request.json();

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const query = `SELECT password FROM "User" WHERE id = $1`;
    const users = await runQuery<{ password: string }>(query, [userId]);

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    const passwordMatch = user.password
      ? compareSync(currentPassword, user.password)
      : false;

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const hashedPassword = hashSync(newPassword, 10);
    const updateQuery = `UPDATE "User" SET password = $1 WHERE id = $2`;
    await runQuery(updateQuery, [hashedPassword, userId]);

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Password update failed:", err);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
