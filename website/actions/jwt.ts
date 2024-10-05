import "server-only";
import { jwtVerify, JWTVerifyResult, SignJWT } from "jose";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { setCookie, getCookie } from "cookies-next";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

const key = new TextEncoder().encode(process.env.JWT_SECRET!);

export const verifyJwt = async ({ token }: { token: string }) => {
  try {
    const info = (await jwtVerify(token, key)) as JWTVerifyResult<{
      name: string;
      email: string;
      session: string;
      id: string;
    }>;

    return {
      success: true,
      data: {
        name: info.payload.name,
        email: info.payload.email,
        session: info.payload.session,
        id: info.payload.id,
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
  id,
}: {
  email: string;
  name: string;
  exp: number;
  session: string;
  id: string;
}) => {
  try {
    const token = await new SignJWT({
      name,
      email,
      session,
      id,
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

export const checkAccessToken = async (req: NextRequest) => {
  const accessToken = req.cookies.get("_a_token")?.value || "";
  const accessResult = await verifyJwt({ token: accessToken });
  return accessResult;
};

export const newAccessToken = async (req: NextRequest) => {
  const refreshToken = req.cookies.get("_r_token")?.value;
  if (!refreshToken) {
    return {
      success: false,
      message: "No refresh token found!",
      token: null,
      email: null,
      session: null,
    };
  }

  const refreshResult = await verifyJwt({ token: refreshToken });
  if (refreshResult.success && refreshResult.data) {
    const { email, name, session, id } = refreshResult.data;
    const newAccess = await assignJwt({ name, email, session, exp: 30, id });
    if (newAccess.success) {
      return {
        success: true,
        message: "Assigned new token!",
        token: newAccess.token,
        email: email,
        session: session,
      };
    }
  } else {
    return {
      success: false,
      message: "Failed to assign token!",
      token: null,
      email: null,
      session: null,
    };
  }
};
