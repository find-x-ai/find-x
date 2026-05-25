import { getSession } from "@/actions/auth"
import { redirect } from "next/navigation"
import { IndexScreen } from "../_components/index-screen"

export const revalidate = 0

const page = async ({ params }: { params: { name: string } }) => {
  const session = await getSession()
  if (!session || !session.data) {
    redirect("/login")
  }

  const name = decodeURIComponent(params.name)

  return (
    <main className="flex flex-col w-full h-full">
      <IndexScreen name={name} />
    </main>
  )
}

export default page
