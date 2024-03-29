import Hero from "./hero"
import Subhero from "./subhero"
const index = () => {
  return (
    <div className="flex flex-col gap-10">
        <Hero/>
        <Subhero/>
    </div>
  )
}

export default index