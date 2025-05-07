import { ApiResponse, DonationWithDonor } from "@/app/_lib/type";
import { NextResponse } from "next/server";
import { runQuery } from "../../../../../util/qeuryService";

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<DonationWithDonor[]>>> {
  try {
    const { userId, minAmount, maxAmount, startDate, endDate, donorName } =
      await request.json();

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        d.id,
        d.amount,
        d."specialMessage",
        d."created_at",
        u.id as "donorId",
        u.username as "donorName",
        p."avatarImage" as "donorImage",
        u.email as "donorEmail"
      FROM "Donation" d
      JOIN "User" u ON d."donorId" = u.id
      LEFT JOIN "Profile" p ON u."profileId" = p.id
      WHERE d."recipientId" = $1
      ${minAmount ? `AND d.amount >= ${minAmount}` : ""}
      ${maxAmount ? `AND d.amount <= ${maxAmount}` : ""}
      ${
        startDate
          ? `AND d.created_at >= '${new Date(startDate).toISOString()}'`
          : ""
      }
      ${
        endDate
          ? `AND d.created_at <= '${new Date(endDate).toISOString()}'`
          : ""
      }
      ${donorName ? `AND u.username ILIKE '%${donorName}%'` : ""}
      ORDER BY d."created_at" DESC
    `;

    const donations = await runQuery<DonationWithDonor>(query, [userId]);

    return NextResponse.json({
      success: true,
      data: donations.map((donation) => ({
        ...donation,
        created_at: new Date(donation.created_at).toISOString(),
      })),
    });
  } catch (err) {
    console.error("Failed to fetch donations:", err);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch donations",
        details:
          process.env.NODE_ENV === "development"
            ? err instanceof Error
              ? err.message
              : String(err)
            : undefined,
      },
      { status: 500 }
    );
  }
}
