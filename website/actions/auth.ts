"use server";

import { z } from "zod";
import nodemailer from "nodemailer";
import { magicLinkLogin } from "@/components/email";
import { sql, redis } from "@/lib/db";
import { assignJwt, verifyJwt } from "./jwt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { setCookie } from "cookies-next";

const key = new TextEncoder().encode(process.env.JWT_SECRET!);

const magicLinkSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(3, "Name is required")
    .max(15, "Name cannot be more than 15 characters"),
});

export const setCookies = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  cookies().set("_a_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30,
    path: "/",
  });
  cookies().set("_r_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
};

export const sendMagicLink = async ({
  email,
  name,
  baseUrl,
}: {
  email: string;
  name?: string;
  baseUrl: string;
}) => {
  try {
    if (name) {
      magicLinkSchema.parse({ email, name });
    }
    const pipeline = redis.pipeline();
    const attemptCount =
      ((await redis.get(`${email}:attempts`)) as number) || 0;

    if (attemptCount >= 10) {
      return {
        success: false,
        message: "Too many attempts, please try again later!",
      };
    }

    if (!name) {
      try {
        name = (await sql`SELECT name FROM users WHERE email = ${email}`)[0]
          .name as string;
      } catch (e) {
        return {
          success: false,
          message: "No user found!",
        };
      }
    }

    const res = await assignJwt({
      email,
      name,
      exp: 60 * 3,
      session: Date.now().toString(),
      id: -1,
    });

    if (!res.success) {
      throw new Error("Failed to assign JWT!");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!,
      },
    });

    const link = `${baseUrl}/magic/${res.token}`;

    const mailOptions = {
      from: `Find-X <redshield.vercel.app@gmail.com>`,
      to: email,
      subject: `Magic login for Find-X`,
      html: await magicLinkLogin({ email, name, link }),
    };

    const info = await transporter.sendMail(mailOptions);

    if (info.accepted.length > 0) {
      pipeline.set(`${email}:attempts`, attemptCount + 1, {
        ex: 60 * 15,
      });

      await pipeline.exec();

      return {
        success: true,
        message: "Magic link sent!",
      };
    }

    return {
      success: false,
      message: "Failed to send link!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong!",
    };
  }
};

export const verifyMagicLink = async ({
  token,
}: {
  token: string;
}): Promise<{ success: boolean; message: string }> => {
  if (!token || typeof token !== "string") {
    return { success: false, message: "Invalid token provided" };
  }

  try {
    const res = await verifyJwt({ token });

    if (!res.success || !res.data?.email) {
      throw new Error("Failed to verify magic link");
    }

    const { email, name, session } = res.data;

    if (
      !email ||
      typeof email !== "string" ||
      !name ||
      typeof name !== "string"
    ) {
      throw new Error("Invalid user data in token");
    }

    const dbRes = await sql`
    INSERT INTO users (email, name, session)
    VALUES (${email}, ${name}, ${session})
    ON CONFLICT (email) 
    DO UPDATE SET session = ${session}
    RETURNING id
  `;
    const [access, refresh] = await Promise.all([
      assignJwt({ email, name, exp: 30, session, id: dbRes[0].id }),
      assignJwt({
        email,
        name,
        exp: 60 * 60 * 24 * 30,
        session,
        id: dbRes[0].id,
      }),
    ]);

    if (!access.token || !refresh.token) {
      throw new Error("Failed to generate access or refresh tokens");
    }

    await setCookies({
      accessToken: access.token,
      refreshToken: refresh.token,
    });

    return {
      success: true,
      message: "Magic link verified successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export const signInWithGoogle = async ({
  email,
  name,
  session,
  id,
}: {
  email: string;
  name: string;
  session: string;
  id: number;
}) => {
  try {
    const refresh = await assignJwt({
      email,
      name,
      exp: 60 * 60 * 24 * 30,
      session,
      id,
    });
    const access = await assignJwt({
      email,
      name,
      exp: 30,
      session: Date.now().toString(),
      id,
    });

    if (!refresh.token || !access.token) {
      throw new Error("Failed to generate access or refresh tokens");
    }
    await setCookies({
      accessToken: access.token,
      refreshToken: refresh.token,
    });
    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong!",
    };
  }
};

export const getSession = async () => {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("_r_token")?.value || "";

    if (!refreshToken) {
      return {
        success: false,
        message: "No refresh token found",
        data: null,
      };
    }

    const verificationResult = await verifyJwt({ token: refreshToken });

    return {
      success: verificationResult.success,
      message: verificationResult.message,
      data: verificationResult.data,
    };
  } catch (e) {
    return {
      success: false,
      message: "Error occurred while getting session",
      data: null,
    };
  }
};

export const logoutUser = async () => {
  cookies().delete("_a_token");
  cookies().delete("_r_token");

  const allCookies = cookies().getAll();

  allCookies.map((ck) => {
    cookies().delete(ck.name);
  });
  redirect("/login");
};
