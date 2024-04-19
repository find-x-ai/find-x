import { NextRequest, NextResponse } from "next/server";
import edgeChromium from "chrome-aws-lambda";
import  Puppeteer  from "puppeteer-core";

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

  const executablePath = await edgeChromium.executablePath;
  try {
     const browser = await Puppeteer.launch({
      executablePath,
      args: edgeChromium.args,
      headless: true,
     })

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

  }
}
