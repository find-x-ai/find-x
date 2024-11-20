import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const logs = await redis.lrange(`logs:${params.sessionId}`, 0, -1)
    const parsedLogs = logs.map(log => JSON.parse(log))
    
    return NextResponse.json({ logs: parsedLogs })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}