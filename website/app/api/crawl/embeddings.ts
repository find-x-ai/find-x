import { ScrapedData } from "@/types";
import { sql as db } from "@/lib/db";
import { index } from "@/lib/db";

export class EmbeddingsService {
  private clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  async updateWebsite(chunks: ScrapedData[]): Promise<EmbeddingResult> {
    await index.namespace(this.clientId).reset();
    return await this.processChunks(chunks);
  }

  async createNewWebsite(chunks: ScrapedData[]): Promise<EmbeddingResult> {
    return await this.processChunks(chunks);
  }

  private async processChunks(chunks: ScrapedData[]): Promise<EmbeddingResult> {
    const failedChunks: number[] = [];
    const embeddedChunks: number[] = [];
    const MAX_RETRIES = 3;

    const chunkPromises = chunks.map(async (chunk, i) => {
      for (let retry = 0; retry < MAX_RETRIES + 1; retry++) {
        try {
          await this.upsertChunk(chunks, i + 1);
          embeddedChunks.push(i);
          return;
        } catch (error) {
          console.log(error);
          if (retry === MAX_RETRIES) {
            failedChunks.push(i + 1);
          }
        }
      }
    });

    await Promise.all(chunkPromises);

    return {
      success: failedChunks.length === 0,
      failedChunks,
      embeddedChunks,
      clientId: this.clientId,
    };
  }

  private async upsertChunk(
    chunk: ScrapedData[],
    index: number
  ): Promise<void> {
    console.log(`upserting chunk ${index} for ${this.clientId}`);

    const res = await fetch(process.env.UPSERT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.UPSERT_KEY!}`,
      },
      body: JSON.stringify({
        client: this.clientId,
        data: chunk,
      }),
    });

    if (!res.ok) {
      throw new Error(
        `Error generating vector embeddings for chunk: ${res.statusText}`
      );
    }
  }
}

interface ClientInfo {
  name: string;
  email: string;
  apiKey: string;
  plan: string;
  url: string;
}

interface EmbeddingResult {
  success: boolean;
  failedChunks: number[];
  embeddedChunks: number[];
  clientId: string;
}
