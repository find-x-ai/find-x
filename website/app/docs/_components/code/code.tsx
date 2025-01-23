import { CodeCopy } from "./copy";

async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const shiki = await import('shiki');
  const out = await shiki.codeToHtml(code, {
    lang: lang,
    theme: "aurora-x",
  });

  return <CodeCopy code={code}>{out}</CodeCopy>;
}

export default CodeBlock;
