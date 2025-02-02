import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { sql } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json("Required env secrets not set!", { status: 400 });
  }

  const rawBody = await req.text();
  const signature = Buffer.from(req.headers.get("X-Signature") ?? "", "hex");

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
  console.log("Received webhook event:", data);

  const eventName = data.meta.event_name;
  const attributes = data.data.attributes;
  const customerEmail = attributes.user_email;
  const paidAmount = attributes.total / 100 || 0;
  const status = attributes.status;
  const currency = attributes.currency;
  const refunded = attributes.refunded;
  const createdAt = attributes.created_at;

  try {
    switch (eventName) {
      case "subscription_payment_success":
      case "subscription_payment_recovered":
        await sql`
          INSERT INTO payments (email, created_at, amount, status, currency, refunded)
          VALUES (${customerEmail}, ${createdAt}, ${paidAmount}, ${status}, ${currency}, ${refunded})
        `;
        await sql`
          UPDATE plans 
          SET name = 'pro', paid = ${paidAmount} 
          WHERE user_email = ${customerEmail}
        `;
        console.log("User upgraded to pro.");
        break;

      case "subscription_payment_failed":
      case "subscription_payment_refunded":
        await sql`
          INSERT INTO payments (email, created_at, amount, status, currency, refunded)
          VALUES (${customerEmail}, ${createdAt}, ${paidAmount}, ${status}, ${currency}, ${refunded})
        `;
        await sql`
          UPDATE plans 
          SET name = 'free', paid = 0
          WHERE user_email = ${customerEmail}
        `;
        console.log("User downgraded due to failed/refunded payment.");
        break;

      case "subscription_cancelled":
      case "subscription_expired":
        await sql`
          UPDATE plans 
          SET name = 'free', paid = 0
          WHERE user_email = ${customerEmail}
        `;
        console.log("User plan cancelled/expired.");
        break;

      case "subscription_plan_changed":
        await sql`
          UPDATE plans 
          SET name = 'pro', paid = ${paidAmount}
          WHERE user_email = ${customerEmail}
        `;
        console.log("User plan changed.");
        break;

      default:
        console.log("Unhandled event:", eventName);
        break;
    }
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
};
