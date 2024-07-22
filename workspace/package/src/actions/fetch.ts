export const fetchResponse = async (search: string, findx_key: string) => {
  const res = await fetch("https://server.find-x.workers.dev/query", {
    method: "POST",
    cache: "force-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${findx_key}`,
    },
    body: JSON.stringify({
      query: search,
    }),
  });

  if (!res.body) {
    throw new Error("Failed to load response!");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  return {
    [Symbol.asyncIterator]: async function* () {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        yield decoder.decode(value, { stream: true });
      }
    },
  };
};
