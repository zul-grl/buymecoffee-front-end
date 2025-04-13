import { ApiResponse, Donation } from "@/app/_lib/type";
import { NextResponse } from "next/server";
import { runQuery } from "../../../../../util/qeuryService";

export async function POST(
  req: Request
): Promise<NextResponse<ApiResponse<Donation>>> {
  try {
    const { amount, specialMessage, socialURL, donorId, recipientId } =
      await req.json();

    if (!recipientId || !donorId) {
      return NextResponse.json(
        {
          success: false,
          error: "MISSING_IDS",
          message: "Both donor and recipient IDs are required",
        },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_AMOUNT",
          message: "Amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    const createDonationQuery = `
      INSERT INTO "Donation" (
        amount, 
        "specialMessage", 
        "socialURL", 
        "donorId", 
        "recipientId",
        "created_at",
        "updated_at"
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;

    const donation = await runQuery<Donation>(createDonationQuery, [
      amount,
      specialMessage || null,
      socialURL || null,
      donorId,
      recipientId,
    ]);

    const updateUserQuery = `
    UPDATE "User"
    SET "receivedDonations" = array_append(
      COALESCE("receivedDonations", ARRAY[]::integer[]),
      $1
    ),
    "updated_at" = NOW()
    WHERE id = $2
  `;
    await runQuery(updateUserQuery, [donation[0].id, recipientId]);

    return NextResponse.json(
      {
        success: true,
        data: donation[0],
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Full error details:", err);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to create donation",
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
