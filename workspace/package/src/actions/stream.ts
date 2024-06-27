"use server";

export const getEnvSecret = () => {
  const secret = process.env.FINDX_SECRET_KEY!;
  if (!secret) {
    throw new Error("No FINDX_SECRET_KEY found!");
  }
  return secret;
};
export const getStreamingResponse = async ({ query }: { query: string }) => {
  console.log(query);

  return {
    success: true,
    message: "Got the response",
  };

  // const res = await fetch("https://server.find-x.workers.dev/query", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${getEnvSecret()}`,
  //   },
  //   body: JSON.stringify({ query: query.trim() }),
  // });
  // return res;
};
