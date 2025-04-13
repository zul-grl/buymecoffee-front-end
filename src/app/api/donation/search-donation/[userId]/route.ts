import { ApiResponse, Donation, DonationSearchParams } from "@/app/_lib/type";
import { NextResponse } from "next/server";
import { runQuery } from "../../../../../../util/qeuryService";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
): Promise<NextResponse<ApiResponse<Donation[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(params.userId);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "INVALID_USER_ID", message: "User ID must be a number" },
        { status: 400 }
      );
    }

    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const donorName = searchParams.get("donorName");

    let query = `
      SELECT 
        d.id,
        d.amount,
        d."specialMessage",
        d."socialURL",
        d."donorId",
        d."recipientId",
        d."created_at" as "createdAt",
        d."updated_at" as "updatedAt",
        u.username as "donorName"
      FROM "Donation" d
      LEFT JOIN "User" u ON d."donorId" = u.id
      WHERE d."recipientId" = $1
    `;

    const queryParams: any[] = [userId];
    let paramIndex = 2;

    if (minAmount) {
      query += ` AND d.amount >= $${paramIndex++}`;
      queryParams.push(parseFloat(minAmount));
    }

    if (maxAmount) {
      query += ` AND d.amount <= $${paramIndex++}`;
      queryParams.push(parseFloat(maxAmount));
    }

    if (startDate) {
      query += ` AND d.created_at >= $${paramIndex++}`;
      queryParams.push(new Date(startDate));
    }

    if (endDate) {
      query += ` AND d.created_at <= $${paramIndex++}`;
      queryParams.push(new Date(endDate));
    }

    if (donorName) {
      query += ` AND (u.username ILIKE $${paramIndex++} OR u.username IS NULL)`;
      queryParams.push(`%${donorName}%`);
    }

    query += " ORDER BY d.created_at DESC";

    const donations = await runQuery<Donation>(query, queryParams);
    return NextResponse.json({ success: true, data: donations });
  } catch (err) {
    console.error("Failed to search donations:", err);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: "Failed to search donations" },
      { status: 500 }
    );
  }
}
