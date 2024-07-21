export const useExtractCodeSnippets = () => {
    return (text: string) => {
      const regex = /```(?:\w*\n)?([\s\S]*?)```/g;
      const snippets: string[] = [];
      let index = 0;
      const processedText = text.replace(regex, (_match, code) => {
        snippets.push(code.trim());
        return `<CODE_SNIPPET_${index++}>`;
      });
      return { snippets, processedText };
    };
  };