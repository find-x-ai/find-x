"use server";

export const getEnvSecret = async () => {
  const secret = process.env.FINDX_SECRET_KEY!;
  if (!secret) {
    throw new Error("No FINDX_SECRET_KEY found!");
  }
  return secret;
};
export const getStreamingResponse = async ({ query }: { query: string }) => {
  try {
    const res = await fetch("https://server.find-x.workers.dev/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getEnvSecret()}`,
      },
      body: JSON.stringify({ query: query.trim() }),
    });

    const final = await res.json();

    return {
      success: true,
      data: final.answer,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: "something went wrong !",
    };
  }
};
