"use server";

export const getFindxKey = async () => {
  return process.env.FINDX_SECRET_KEY!;
};
