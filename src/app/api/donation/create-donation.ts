import { mockSupporters } from "@/app/_lib/data";

export async function POST(req: Request) {
  const body = await req.json();
  const newDonation = {
    id: Math.max(...mockSupporters.map((s) => s.id)) + 1,
    ...body,
    timeAgo: "Just now",
  };

  return new Response(JSON.stringify(newDonation), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
