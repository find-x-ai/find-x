export const useTypeEffect = () => {
  return async (
    text: string,
    setResponse: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      setResponse((prev) => prev + (i === 0 ? "" : " ") + words[i]);
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
  };
};
