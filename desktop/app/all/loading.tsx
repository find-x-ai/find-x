import {Loader2} from "lucide-react"
const loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
        <div>
           <Loader2 className=" animate-spin duration-300 w-[40px] h-[40px] text-white"/>
        </div>
    </div>
  )
}

export default loading;