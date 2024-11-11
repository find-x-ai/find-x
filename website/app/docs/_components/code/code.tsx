import { codeToHtml } from "shiki";
import { CodeCopy } from "./copy";

async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const out = await codeToHtml(code, {
    lang: lang,
    theme: "aurora-x",
  });

  return <CodeCopy code={code}>{out}</CodeCopy>;
}

export default CodeBlock;
