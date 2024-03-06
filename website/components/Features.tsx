import Link from "next/link";
import { CardContainer } from "./ui/3d-card";

export default function Features() {
  return (
    <div className="w-full py-0 px-6 flex flex-col justify-center items-center relative top-[-30px]">
      <div className="w-full max-w-[1200px] h-full flex flex-col justify-between">
        <div className=" pt-10 pb-5  flex md:flex-row flex-col gap-7 cursor-pointer">
          <CardContainer>
            <div className="w-full border border-purple-950/30 rounded-xl p-5 bg-purple-950/5">
              <h1 className="text-5xl text-white">Your Data</h1>
              <br />
              <p className="text-zinc-400 leading-8 w-full max-w-[800px]">
                Your app is the answer to users all questions and that is
                exactly what it takes to get you started! Just provide the URL
                of your application and start configuring the data that will
                enable us to deliver you the best experience possible.
              </p>
            </div>
          </CardContainer>
          <CardContainer>
            <div className="w-full border border-purple-950/30 rounded-xl p-5 bg-purple-950/5">
              <h1 className="text-5xl text-white">Secure data flow</h1>
              <br />
              <p className="text-zinc-400 leading-8 w-full max-w-[800px]">
                Whole process works on the visible data for the application.
                There isn't any need to share any confidential information about
                your application. This eliminates the possibility of any
                potentially risks associated with your data.
              </p>
            </div>
          </CardContainer>
        </div>
        <div className="w-full sm:h-[150px] h-[100px] border border-purple-950/30 bg-purple-950/5 rounded-xl flex justify-center items-center">
          <div>
            <Link href={"/"} className="text-4xl text-white">
              try Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
