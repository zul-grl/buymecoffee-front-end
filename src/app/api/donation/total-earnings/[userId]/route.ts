import { ApiResponse, DonationStats } from "@/app/_lib/type";
import { NextResponse } from "next/server";
import { runQuery } from "../../../../../../util/qeuryService";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
): Promise<NextResponse<ApiResponse<DonationStats>>> {
  try {
    const userId = parseInt(params.userId);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        COALESCE(SUM(amount), 0) as "totalEarnings",
        COUNT(*) as "donationCount"
      FROM "Donation"
      WHERE "recipientId" = $1
    `;

    const [stats] = await runQuery<DonationStats>(query, [userId]);

    return NextResponse.json({
      success: true,
      data: {
        totalEarnings: stats.totalEarnings || 0,
        donationCount: stats.donationCount || 0,
        totalDonations: stats.totalDonations || 0,
        recentDonations: stats.recentDonations || [],
        topDonors: stats.topDonors || [],
      },
    });
  } catch (err) {
    console.error("Failed to fetch donation stats:", err);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}
