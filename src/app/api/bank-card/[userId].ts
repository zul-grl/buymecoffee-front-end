import { mockUser } from "@/app/_lib/data";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  return new Response(
    JSON.stringify({
      ...mockUser.payment,
      userId: params.userId,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
