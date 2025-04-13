import { NextResponse } from "next/server";
import { runQuery } from "../../../../../util/qeuryService";
import { hashSync } from "bcryptjs";
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { username, password, email } = await request.json();
    if (!username || !password || !email) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }
    const checkUserQuery = `SELECT id FROM "User" WHERE username = $1 OR email = $2`;
    const existingUser = await runQuery(checkUserQuery, [username, email]);

    if (existingUser.length > 0) {
      return new NextResponse(
        JSON.stringify({ error: "Username or email already taken" }),
        { status: 409 }
      );
    }
    const hashedPassword = hashSync(password, 10);
    const createUserQuery = `
      INSERT INTO "User" (username, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, email
    `;
    const newUser = await runQuery(createUserQuery, [
      username,
      email,
      hashedPassword,
    ]);

    return new NextResponse(
      JSON.stringify({
        message: "User created successfully",
        user: newUser[0],
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to create user:", err);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create user" }),
      { status: 500 }
    );
  }
}
