import { ApiResponse, BankCard } from "@/app/_lib/type";
import { NextResponse } from "next/server";
import { runQuery } from "../../../../../util/qeuryService";

export async function PATCH(
  request: Request
): Promise<NextResponse<ApiResponse<BankCard>>> {
  try {
    const body = await request.json();
    if (!body?.bankCardId) {
      console.error("Missing bankCardId");
      return NextResponse.json(
        { error: "bankCardId is required" },
        { status: 400 }
      );
    }

    const { bankCardId, ...updateFields } = body;
    if (Object.keys(updateFields).length === 0) {
      console.error("No fields to update provided");
      return NextResponse.json(
        { error: "At least one field to update is required" },
        { status: 400 }
      );
    }

    let query = `UPDATE "BankCard" SET `;
    const values: any[] = [];
    let paramCount = 1;
    const updates: string[] = [];

    if (updateFields.country !== undefined) {
      updates.push(`country = $${paramCount++}`);
      values.push(updateFields.country);
    }

    if (updateFields.firstName !== undefined) {
      updates.push(`"firstName" = $${paramCount++}`);
      values.push(updateFields.firstName);
    }

    if (updateFields.lastName !== undefined) {
      updates.push(`"lastName" = $${paramCount++}`);
      values.push(updateFields.lastName);
    }

    if (updateFields.cardNumber !== undefined) {
      updates.push(`"cardNumber" = $${paramCount++}`);
      values.push(updateFields.cardNumber);
    }

    if (updateFields.cvc !== undefined) {
      updates.push(`cvc = $${paramCount++}`);
      values.push(updateFields.cvc);
    }
    if (
      updateFields.expiryMonth !== undefined ||
      updateFields.expiryYear !== undefined
    ) {
      if (!updateFields.expiryMonth || !updateFields.expiryYear) {
        console.error("Both expiryMonth and expiryYear must be provided");
        return NextResponse.json(
          {
            error: "Both expiryMonth and expiryYear must be provided together",
          },
          { status: 400 }
        );
      }
      const expiryDate = `${updateFields.expiryYear}-${String(
        updateFields.expiryMonth
      ).padStart(2, "0")}-01`;
      updates.push(`"expiryDate" = $${paramCount++}`);
      values.push(expiryDate);
    }

    query += updates.join(", ");
    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(bankCardId);
    const result = await runQuery<BankCard>(query, values);

    if (result.length === 0) {
      console.error("Bank card not found");
      return NextResponse.json(
        { error: "Bank card not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Bank card updated successfully",
        data: result[0],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update bank card error:", err);
    return NextResponse.json(
      { error: "Failed to update bank card" },
      { status: 500 }
    );
  }
}
