import { mockUser } from "@/app/_lib/data";

export async function PATCH(req: Request) {
  const body = await req.json();
  return new Response(
    JSON.stringify({
      ...mockUser,
      ...body,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
