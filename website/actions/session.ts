import "server-only";
import { jwtVerify, JWTVerifyResult, SignJWT } from "jose";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { setCookie, getCookie } from "cookies-next";

const key = new TextEncoder().encode(process.env.JWT_SECRET!);

export const verifyJwt = async ({ token }: { token: string }) => {
  try {
    const info = (await jwtVerify(token, key)) as JWTVerifyResult<{
      name: string;
      email: string;
      session: string;
    }>;

    return {
      success: true,
      data: {
        name: info.payload.name,
        email: info.payload.email,
        session: info.payload.session,
      },
      message: "Valid token!",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Invalid token provided!",
    };
  }
};

export const assignJwt = async ({
  email,
  name,
  exp,
  session,
}: {
  email: string;
  name: string;
  exp: number;
  session: string;
}) => {
  try {
    const token = await new SignJWT({
      name,
      email,
      session,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime(`${exp}s`)
      .sign(key);

    return {
      success: true,
      message: "Success signing token",
      token,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error signing token",
      token: null,
    };
  }
};

export const getSession = async () => {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("_a_token")?.value || "";

    const accessResult = await verifyJwt({ token: accessToken });
    if (accessResult.success && accessResult.data) {
      return {
        success: true,
        message: "Valid session!",
        data: accessResult.data,
      };
    }

    const refreshToken = cookieStore.get("_r_token")?.value;
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const refreshResult = await verifyJwt({ token: refreshToken });

    if (!refreshResult.success || !refreshResult.data) {
      throw new Error("Invalid refresh token");
    }

    const [user] = await sql`SELECT session FROM users WHERE email = ${refreshResult.data.email}`;

    if (!user || user.session !== refreshResult.data.session) {
      throw new Error("Session mismatch or user not found");
    }

    const newAccess = await assignJwt({
      email: refreshResult.data.email,
      name: refreshResult.data.name,
      exp: 30,
      session: refreshResult.data.session,
    });

    if (!newAccess.success || !newAccess.token) {
      throw new Error("Failed to create new access token");
    }

    setCookie("_a_token", newAccess.token);
    return {
      success: true,
      message: "Valid session!",
      data: refreshResult.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Session expired or invalid",
      data: null,
    };
  }
};