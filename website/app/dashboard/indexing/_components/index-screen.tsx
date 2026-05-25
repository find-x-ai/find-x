"use client"

import type { Index } from "@/actions/types"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getIndex } from "@/actions/get-index"
import { Screen } from "./screen"

interface ProcessData {
  queueLength: number
  scrapedDataLength: number
  visitedLength: number
  percentage: number
}

interface IndexScreenProps {
  name: string
}

export const IndexScreen = ({ name }: IndexScreenProps) => {
  const router = useRouter()
  const [index, setIndex] = useState<Index | null>(null)
  const [processData, setProcessData] = useState<ProcessData>({
    queueLength: 0,
    scrapedDataLength: 0,
    visitedLength: 0,
    percentage: 0,
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        const res = await getIndex(name)
        if (cancelled) return
        if (res.unauthorized) {
          router.push("/login")
          return
        }
        setIndex(res.index)
        setProcessData(res.processData)
      } catch {
        if (cancelled) return
        setIsError(true)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [name, router])

  if (isLoading) return <div className="flex items-center justify-center w-full h-full">Loading...</div>
  if (isError) return <div className="flex items-center justify-center w-full h-full">Something went wrong.</div>
  if (!index) return <div className="flex items-center justify-center w-full h-full">Index not found.</div>

  return <Screen index={index} processData={processData} />
}
