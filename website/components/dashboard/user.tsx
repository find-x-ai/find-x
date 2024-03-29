import { useAuth , currentUser } from "@clerk/nextjs"
import Apps from "./apps"
const user = async () => {
  const user = await currentUser();
  return (
    <div className="w-full flex flex-col text-center">
        <p className="text-xl">Hello , {user?.firstName || "friend"} !</p> <br />
         <Apps/>
    </div>
  )
}

export default user