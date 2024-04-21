import { NextRequest, NextResponse } from "next/server";
import { getBrowser } from "@/lib/pup/pup";

// options request for CORS
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

// POST Method
export async function POST(req: NextRequest) {
  const { url } = (await req.json()) as { url: string[] };
  try {
    const browser = await getBrowser();
    const data: { url: string; content: string }[] = [];
    let allLinks: string[] = [];

    for (let link of url) {
      const page = await browser.newPage();
      await page.goto(link);
      //@ts-ignore
      const info = await page.evaluate(() => {
        const content = (document.querySelector("body")?.innerText || "")
          .replace(/\n/g, " ") // Replace newline characters with spaces
          .replace(/([a-z])([A-Z])/g, "$1 $2"); // Insert space before capital letters
        return { url: document.location.href, content };
      });
      //@ts-ignore
      const links = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll("a")).map((element: HTMLAnchorElement) => element.href);
        return links;
      });

      allLinks = allLinks.concat(links.filter((l:string) => !allLinks.includes(l)));
      data.push(info);
    }

    await browser.close();

    return NextResponse.json(
      {
        data,
        links: allLinks,
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
