'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface NewIndexFormProps {
  onSuccess: () => void
}

export function NewIndexForm({ onSuccess }: NewIndexFormProps) {
  const [url, setUrl] = useState("")
  const [appName, setAppName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!url || !appName) {
      toast.error("Please fill in all fields.")
      setIsLoading(false)
      return
    }

    // Here you would typically send the data to your backend
    // For this example, we'll just simulate an API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulating API call
      toast.success("New index created successfully!")
      setUrl("")
      setAppName("")
      onSuccess()
    } catch (error) {
      toast.error("Failed to create new index. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full text-gray-100">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">
          Create New Index
        </CardTitle>
        <CardDescription className="text-gray-400">
          Enter the URL and app name for your new index
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-gray-200">
              URL
            </Label>
            <Input
              id="url"
              placeholder="https://example.com"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="bg-[#141414] border-[#353535] placeholder-gray-500 text-white"
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="appName" className="text-gray-200">
              App Name
            </Label>
            <Input
              id="appName"
              placeholder="My Awesome App"
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              required
              className="bg-[#141414] border-[#353535] placeholder-gray-500 text-white"
            />
          </div>
          <Button
            disabled={isLoading}
            className="w-full flex gap-2 items-center mt-6 bg-emerald-700 hover:bg-emerald-800 transition-all duration-300"
            type="submit"
          >
            Create New Index
            {isLoading && (
              <Loader2 className="animate-spin transition-all duration-500 w-[20px] h-[20px]" />
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm text-[#656565] text-center">
        <p>
          By creating a new index, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </div>
  )
}