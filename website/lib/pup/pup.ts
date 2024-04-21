const CHROMIUM_PATH =
  "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";

export async function getBrowser() {
  //@ts-ignore
  if (process.env.VERCEL_ENV === "production") {
    //@ts-ignore
    const chromium = await import("@sparticuz/chromium-min").then(
      (mod) => mod.default
    );
    //@ts-ignore
    const puppeteerCore = await import("puppeteer-core").then(
      (mod) => mod.default
    );

    const executablePath = await chromium.executablePath(CHROMIUM_PATH);

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: true,
    });
    return browser;
  } else {
    //@ts-ignore
    const puppeteer = await import("puppeteer").then((mod) => mod.default);

    const browser = await puppeteer.launch();
    return browser;
  }
}
