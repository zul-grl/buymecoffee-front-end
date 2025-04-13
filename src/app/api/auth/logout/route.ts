import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");

  return new NextResponse(
    JSON.stringify({ message: "Logged out successfully" }),
    { status: 200 }
  );
}
