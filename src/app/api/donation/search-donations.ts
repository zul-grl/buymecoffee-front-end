import { mockSupporters } from "@/app/_lib/data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query") || "";

  const filtered = mockSupporters.filter(
    (supporter) =>
      supporter.name.toLowerCase().includes(query.toLowerCase()) ||
      supporter.message?.toLowerCase().includes(query.toLowerCase())
  );

  return new Response(JSON.stringify(filtered), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
