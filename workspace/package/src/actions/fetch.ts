const URL = "http://127.0.0.1:8787/query";

export const fetchResponse = async (search: string, findx_key: string): Promise<AsyncIterable<string>> => {
  const res = await fetch(URL, {
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
    [Symbol.asyncIterator]() {
      return {
        async next() {
          const { value, done } = await reader.read();
          if (done) return { done: true, value: undefined };
          return {
            done: false,
            value: decoder.decode(value, { stream: true })
          };
        }
      };
    }
  };
};
