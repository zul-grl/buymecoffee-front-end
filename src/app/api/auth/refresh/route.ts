import { ApiResponse, User } from "@/app/_lib/type";
import { NextResponse } from "next/server";
import { runQuery } from "../../../../../util/qeuryService";

export async function GET(
  request: Request
): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }

    const query = `
      SELECT id, username, email 
      FROM "User" 
      WHERE id = $1
    `;
    const users = await runQuery<User>(query, [userId]);

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: users[0] }, { status: 200 });
  } catch (err) {
    console.error("Refresh error:", err);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
