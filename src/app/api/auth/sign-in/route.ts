import { NextResponse } from "next/server";
import { compareSync } from "bcryptjs";
import { ApiResponse, User } from "@/app/_lib/type";
import { runQuery } from "../../../../../util/qeuryService";

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<{ id: number }>>> {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const query = `SELECT id, password FROM "User" WHERE email = $1`;
    const users = await runQuery<User>(query, [email]);

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = users[0];
    const passwordMatch = user.password
      ? compareSync(password, user.password)
      : false;

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Login successful",
        data: { id: user.id },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login failed:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
