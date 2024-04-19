import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium"
import  Puppeteer  from "puppeteer-core";



// Optional: If you'd like to disable webgl, true is the default.
chromium.setGraphicsMode = false;


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
    const browser = await Puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath("/opt/chromium"),
      headless: true,
    });
     const page = await browser.newPage();

     const res = await page.goto(url);

     const result = await res.text()

    return NextResponse.json(
      {
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
     console.log(error)

     return NextResponse.json({
      message:"failed to fetch data",
     }, {status: 401})
  }
}
