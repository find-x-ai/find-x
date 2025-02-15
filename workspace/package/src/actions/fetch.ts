const URL = "https://server.find-x.workers.dev/query";

export const fetchResponse = async (
  search: string,
  findx_key: string,
  use_cache: boolean
): Promise<AsyncIterable<string>> => {
  console.log(URL, search, findx_key, use_cache);
  const res = await fetch(URL, {
    method: "POST",
    cache: "force-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${findx_key}`,
    },
    body: JSON.stringify({
      query: search,
      use_cache,
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
            value: decoder.decode(value, { stream: true }),
          };
        },
      };
    },
  };
};
