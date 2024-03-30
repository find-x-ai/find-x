"use server";

export const checkURL = async ({ url }: { url: string }) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        status: false,
        message: "Invalid or missing URL",
      };
    } else {
      return {
        status: true,
        message: "valid URL",
      };
    }
  } catch (error) {
    return { status: false, message: "Invalid or missing URL" };
  }
};
