import { codeToHtml } from "shiki";

async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const out = await codeToHtml(code, {
    lang: lang,
    theme: "aurora-x",
  });

  return <div className="code-block" dangerouslySetInnerHTML={{ __html: out }} />;
}

export default CodeBlock;
