import { auth, getUserState } from "@/config/firebase"

const CurrentUser = async () => {
    const user = await getUserState();
    
  return (
    <div>
       <p>user is </p>
    </div>
  )
}

export default CurrentUser