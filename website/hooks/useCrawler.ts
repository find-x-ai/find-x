import { useState, useEffect, useCallback } from 'react'
import { CrawlerProps, LogMessage, ScrapedData } from '@/types'

export const useCrawler = ({
  setLogMessages,
  setScrapedData,
  url,
}: Omit<CrawlerProps, 'localMode'>) => {
  const [scraping, setScraping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const startCrawler = useCallback(async () => {
    setScraping(true)
    setLogMessages([])
    setScrapedData([])

    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      const { sessionId } = await response.json()
      setSessionId(sessionId)
    } catch (error) {
      console.error('Failed to start crawler:', error)
      setScraping(false)
    }
  }, [url, setLogMessages, setScrapedData])

  useEffect(() => {
    if (!sessionId) return

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/logs/${sessionId}`)
        const { logs } = await response.json()
        
        setLogMessages(logs)
        
        // Check for completion message to stop polling
        const completionLog = logs.find((log: { tag: string }) => log.tag === '[FINISHED]')
        if (completionLog) {
          setScraping(false)
          clearInterval(pollInterval)
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error)
      }
    }, 1000)

    return () => clearInterval(pollInterval)
  }, [sessionId, setLogMessages])

  return { scraping, startCrawler }
}