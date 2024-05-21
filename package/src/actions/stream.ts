export const getStreamingResponse = async ({ query }: { query: string }) => {
  const res = await fetch("https://server.find-x.workers.dev/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.FINDX_SECRET_KEY}`
    },
    body: JSON.stringify({ query: query.trim() })
  });
  return res;
};