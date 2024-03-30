"use server";
import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const getUserInfo = async () => {
  const user = await currentUser();
  if (user) {
    const res = (await db.get(
      `${user.emailAddresses[0].emailAddress}:profile`
    )) as { wallet: number };
    return {
      name: user.firstName || "friend",
      wallet: res.wallet,
    };
  }
  return {
    name: "friend",
    wallet: 10.0,
  };
};
