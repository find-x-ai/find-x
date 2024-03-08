import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: Request) {
  const data = (await request.json()) as {
    url: string;
  };
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(data.url, { waitUntil: "networkidle2" });
    const pageContent = await page.content();
    return NextResponse.json({ status: true, page: pageContent });
  } catch (error) {
    NextResponse.json({ status: false, error: error });
  } finally {
    browser.close();
  }
}
