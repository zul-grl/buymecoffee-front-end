import { mockSupporters } from "@/app/_lib/data";

export async function GET(req: Request) {
  return new Response(JSON.stringify(mockSupporters), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
