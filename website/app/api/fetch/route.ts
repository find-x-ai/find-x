import { NextRequest, NextResponse } from "next/server";
import { getBrowser } from "@/lib/pup/pup";
//runtime configuration
export const runtime = "edge"

//class based approach for browser initialization
class Scraper {
  private browser: any;

  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await getBrowser();
    }
  }

  async scrapePages(urls: string[]) {
    await this.initBrowser();
    const pages = await Promise.all(urls.map(async (link) => {
      const page = await this.browser.newPage();
      await page.goto(link);
      return page;
    }));

    const scrapingPromises = pages.map(async (page) => {
      const [info, links] = await Promise.all([
        this.extractPageInfo(page),
        this.extractPageLinks(page)
      ]);
      await page.close();
      return { info, links };
    });

    const results = await Promise.all(scrapingPromises);

    const data = results.map(result => result.info);
    const allLinks = Array.from(new Set<string>(results.flatMap(result => result.links)));

    return { data, links: allLinks };
  }

  private async extractPageInfo(page: any) {
    return await page.evaluate(() => {
      const content = (document.body?.innerText || "")
        .replace(/\n/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2");
      return { url: document.location.href, content };
    });
  }

  private async extractPageLinks(page: any) {
    return await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a")).map(
        (element: HTMLAnchorElement) => element.href
      );
    });
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

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
    const scraper = new Scraper();
    const { data, links } = await scraper.scrapePages(url);
    await scraper.closeBrowser();

    return NextResponse.json(
      { data, links },
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
      { message: "failed to fetch data" },
      { status: 401 }
    );
  }
}
