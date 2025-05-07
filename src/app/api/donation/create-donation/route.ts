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

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_AMOUNT",
          message: "Amount must be a number greater than 0",
        },
        { status: 400 }
      );
    }

    const donorCheckQuery = `SELECT id FROM "User" WHERE id = $1`;
    const recipientCheckQuery = `SELECT id FROM "User" WHERE id = $1`;

    const [donorResult, recipientResult] = await Promise.all([
      runQuery(donorCheckQuery, [donorId]),
      runQuery(recipientCheckQuery, [recipientId]),
    ]);

    if (donorResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "DONOR_NOT_FOUND",
          message: `Donor with ID ${donorId} not found`,
        },
        { status: 404 }
      );
    }

    if (recipientResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "RECIPIENT_NOT_FOUND",
          message: `Recipient with ID ${recipientId} not found`,
        },
        { status: 404 }
      );
    }

    const createDonationQuery = `
      INSERT INTO "Donation" (
        amount, "specialMessage", "socialURL", "donorId", "recipientId",
        "created_at", "updated_at"
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

    if (!donation || donation.length === 0) {
      throw new Error("Failed to create donation record");
    }

    const initializeArrayQuery = `
      UPDATE "User"
      SET "receivedDonations" = COALESCE("receivedDonations", ARRAY[]::integer[])
      WHERE id = $1
      RETURNING id;
    `;

    await runQuery(initializeArrayQuery, [recipientId]);
    const updateUserQuery = `
      UPDATE "User"
      SET "receivedDonations" = array_append("receivedDonations", $1)
      WHERE id = $2
      RETURNING id;
    `;

    const updateResult = await runQuery(updateUserQuery, [
      donation[0].id,
      recipientId,
    ]);

    if (!updateResult || updateResult.length === 0) {
      const checkUserQuery = `SELECT id, "receivedDonations" FROM "User" WHERE id = $1`;
      const userCheck = await runQuery(checkUserQuery, [recipientId]);

      throw new Error("Failed to update recipient's donations");
    }

    return NextResponse.json(
      { success: true, data: donation[0] },
      { status: 201 }
    );
  } catch (err) {
    console.error("Donation creation error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to process donation",
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
