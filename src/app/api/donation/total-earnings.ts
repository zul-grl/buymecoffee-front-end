import { mockSupporters } from "@/app/_lib/data";

export async function GET(req: Request) {
  const total = mockSupporters.reduce((sum, supporter) => {
    return sum + parseFloat(supporter.amount.replace("$", ""));
  }, 0);

  return new Response(
    JSON.stringify({
      total: `$${total.toFixed(2)}`,
      count: mockSupporters.length,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
