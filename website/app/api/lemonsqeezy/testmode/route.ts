import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

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
  //@ts-ignore
  if (!crypto.timingSafeEqual(hmac, signature)) {
    return NextResponse.json("Invalid request", { status: 400 });
  }

  const data = JSON.parse(rawBody);

  console.log("data is here ", data);

  const eventName = data["meta"]["event_name"];
  const attributes = data["data"]["attributes"];
  const id = data["data"]["id"];

  return NextResponse.json({ message: "success" }, { status: 200 });
};
