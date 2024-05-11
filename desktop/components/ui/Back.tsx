"use client"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
const Back = () => {
    const router = useRouter()
  return (
    <div className=" border-b border-zinc-900 bg-black p-3">
        <button
          onClick={() => router.back()}
          className="text-xl font-semibold flex  items-center text-white group hover:text-amber-600 transition-colors duration-300"
        >
          <ChevronLeft className="mr-2 group-hover:translate-x-[-4px] transition-transform duration-300" />
          Back
        </button>
      </div>
  )
}

export default Back