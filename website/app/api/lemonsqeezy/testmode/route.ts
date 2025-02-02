import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { sql } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  // Check if the secret is set
  if (!secret) {
    return NextResponse.json("Required env secrets not set!", { status: 400 });
  }

  const rawBody = await req.text();
  const signature = Buffer.from(req.headers.get("X-Signature") ?? "", "hex");

  // Validate the signature and body
  if (signature.length === 0 || rawBody.length === 0) {
    return NextResponse.json("Invalid request", { status: 400 });
  }

  const hmac = Buffer.from(
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
    "hex"
  );

  // @ts-ignore
  if (!crypto.timingSafeEqual(hmac, signature)) {
    return NextResponse.json("Invalid request", { status: 400 });
  }

  const data = JSON.parse(rawBody);

  console.log("Received data: ", data);

  const eventName = data["meta"]["event_name"];
  const attributes = data["data"]["attributes"];
  const customerEmail = attributes["user_email"]; // Extract customer email
  const paidAmount = attributes["total"]; // Extract the total paid amount
  const status = attributes["status"]; // Extract payment status
  const currency = attributes["currency"]; // Extract payment currency
  const refunded = attributes["refunded"]; // Check if the payment is refunded

  // Handle event based on its name
  try {
    switch (eventName) {
      case "subscription_payment_success":
        // Insert payment record into the payments table
        await sql`
          INSERT INTO payments (email, created_at, amount, status, currency, refunded)
          VALUES (${customerEmail}, ${attributes["created_at"]}, ${paidAmount}, ${status}, ${currency}, ${refunded})
        `;
        console.log("Payment success: Inserted into payments table.");

        // Update user plan to 'pro' if payment is successful
        await sql`
          UPDATE plans 
          SET name = 'pro',
              paid = ${paidAmount} 
          WHERE user_email = ${customerEmail}
        `;
        console.log("Subscription payment success: User updated to 'pro' plan.");
        break;

      case "subscription_payment_failed":
        // Insert payment record into the payments table
        await sql`
          INSERT INTO payments (email, created_at, amount, status, currency, refunded)
          VALUES (${customerEmail}, ${attributes["created_at"]}, ${paidAmount}, ${status}, ${currency}, ${refunded})
        `;
        console.log("Payment failed: Inserted into payments table.");

        // Update user plan to 'free' if payment failed
        await sql`
          UPDATE plans 
          SET name = 'free',
              paid = 0
          WHERE user_email = ${customerEmail}
        `;
        console.log("Payment failed for user: ", customerEmail);
        break;

      default:
        // Handle other events or log them for debugging
        console.log("Unhandled event: ", eventName);
        break;
    }
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
};
