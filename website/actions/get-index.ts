"use server"

import type { Index } from "@/actions/types"

import { getSession } from "@/actions/auth"
import { sql } from "@/lib/db"
import { redis } from "@/lib/db"

interface ProcessData {
  queueLength: number
  scrapedDataLength: number
  visitedLength: number
  percentage: number
}

interface GetIndexResponse {
  index: Index | null
  processData: ProcessData
}

const DEFAULT_PROCESS_DATA: ProcessData = {
  queueLength: 0,
  scrapedDataLength: 0,
  visitedLength: 0,
  percentage: 0,
}

/**
 * @describe Fetches an index by name for the authenticated user,
 * along with its process data if currently deploying.
 */
export const getIndex = async (name: string): Promise<GetIndexResponse> => {
  const session = await getSession()
  if (!session || !session.data) {
    return { index: null, processData: DEFAULT_PROCESS_DATA }
  }

  const indexes = (await sql`SELECT * FROM indexes WHERE name = ${name} AND user_id = ${session.data.id}`) as Index[]

  if (!indexes || indexes.length === 0 || indexes[0].user_id !== session.data.id) {
    return { index: null, processData: DEFAULT_PROCESS_DATA }
  }

  const index = indexes[0]

  const processData = index.status === "deploying"
    ? ((await redis.get(`process_${index.id}`)) as ProcessData | null)
    : null

  return {
    index,
    processData: processData ?? DEFAULT_PROCESS_DATA,
  }
}
