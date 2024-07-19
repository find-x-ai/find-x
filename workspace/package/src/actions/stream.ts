"use server";
export const getEnvSecret = async () => {
  const secret = process.env.FINDX_SECRET_KEY!;
  if (!secret) {
    throw new Error("No FINDX_SECRET_KEY found!");
  }
  return secret;
};
export const getStreamingResponse = async ({ query }: { query: string }) => {
  // try {
  const controller = new AbortController();
  // const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  const res = await fetch("https://server.find-x.workers.dev/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getEnvSecret()}`,
    },
    body: JSON.stringify({ query: query.trim() }),
    signal: controller.signal,
  });

  return res.body;
  //   clearTimeout(timeoutId);

  //   if (!res.ok) {
  //     throw new Error(`HTTP error! status: ${res.status}`);
  //   }

  //   const contentType = res.headers.get("Content-Type");
  //   if (!contentType || !contentType.includes("text/plain")) {
  //     throw new Error(`Unexpected content type: ${contentType}`);
  //   }

  //   if (!res.body) {
  //     throw new Error("Response body is null");
  //   }

  //   const decoder = new TextDecoder();
  //   const reader = res.body.getReader();
  //   let content = "";
  //   while (true) {
  //     const { value, done } = await reader.read();
  //     if (done) break;
  //     const chunk = decoder.decode(value, { stream: true });
  //     content += chunk;
  //   }

  //   return {
  //     success: true,
  //     message: "Successfully fetched response",
  //     data: content,
  //   };
  // } catch (error) {
  //   console.error("Error in getStreamingResponse:", error);
  //   return {
  //     success: false,
  //     message: error instanceof Error ? error.message : "Something went wrong!",
  //     data: "Something went wrong!",
  //   };
  // }
};
