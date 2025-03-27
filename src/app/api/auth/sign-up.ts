import { mockUser } from "@/app/_lib/data";

export async function POST(req: Request) {
  return new Response(
    JSON.stringify({
      user: mockUser,
      token: "sign-up-token",
    }),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
