import { NextResponse } from "next/server";
import { runQuery } from "../../../../util/qeuryService";
import { BankCard } from "@/app/_lib/type";

export async function GET(): Promise<NextResponse> {
  try {
    const getBankCardsQuery = `SELECT * FROM "BankCard"`;
    const bankCards: BankCard[] = await runQuery(getBankCardsQuery);

    return new NextResponse(JSON.stringify({ bankCards }), {
      status: 200,
    });
  } catch (err) {
    console.error("Failed to fetch bank cards:", err);
    return new NextResponse(
      JSON.stringify({ error: true, message: "Failed to fetch bank cards" }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request): Promise<NextResponse<BankCard>> {
  try {
    const {
      userId,
      country,
      firstName,
      lastName,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvc,
    } = await req.json();

    if (
      !userId ||
      !cardNumber ||
      !firstName ||
      !lastName ||
      !expiryMonth ||
      !expiryYear ||
      !cvc ||
      !country
    ) {
      return new NextResponse(
        JSON.stringify({ error: true, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const expiryDateString = `${expiryYear}-${String(expiryMonth).padStart(
      2,
      "0"
    )}-01`;
    const expiryDate = new Date(expiryDateString); 

    const insertBankCardQuery = `
      INSERT INTO "BankCard" (
        "userId", country, "firstName", "lastName", "cardNumber", "expiryDate",cvc
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const bankCard: BankCard[] = await runQuery(insertBankCardQuery, [
      userId,
      country,
      firstName,
      lastName,
      cardNumber,
      expiryDate,
      cvc,
    ]);

    const createdCard = bankCard[0];

    const UPDATE_USER = `UPDATE "User" SET "bankCardId" = $1 WHERE id = $2`;

    const updateUser = await runQuery(UPDATE_USER, [createdCard?.id, userId]);

    return new NextResponse(
      JSON.stringify({
        message: "Bank card added and user updated successfully",
        bankCard: createdCard,
        updateUser: updateUser[0],
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to add bank card:", err);
    return new NextResponse(
      JSON.stringify({ error: true, message: "Failed to add bank card" }),
      { status: 500 }
    );
  }
}
