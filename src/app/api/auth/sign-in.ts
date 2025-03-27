import { mockUser } from "@/app/_lib/data";

export async function POST(req: Request) {
  return new Response(
    JSON.stringify({
      user: mockUser,
      token: "sign-in-token",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
