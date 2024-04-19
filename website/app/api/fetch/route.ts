import { NextRequest, NextResponse } from "next/server";


const CHROMIUM_PATH =
  "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";

async function getBrowser() {
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

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  try {
    const browser = await getBrowser();

    const page = await browser.newPage();
    const result : [{url: string , content: string}] | [] = [];

    url.forEach(async (link : string) => {
      const res = await page.goto(link);

      const obj = {
        url: link,
        content: await res?.text()
      }
      //@ts-ignore
      result.push(obj);

    });
    // const res = await page.goto(url);

   

    

    return NextResponse.json(
      {
        data: result,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "failed to fetch data",
      },
      { status: 401 }
    );
  }
}
