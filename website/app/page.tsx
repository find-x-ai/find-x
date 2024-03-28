"use client"
import { useState } from "react";
export default function Home(){

  const [res , setRes ] = useState<string>("");
  const [loading , setLoading] = useState<boolean>(false);

  const fakeLoad = async()=>{return}
  const handleSubmit = async (formData: FormData)=>{
    await fakeLoad();
    setLoading(true);
    setRes("")
      const message = formData.get('message');
      const response = await fetch("https://findx.vercel.app/api/query", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message
        })
      });

    if(!response.ok || !response.body){
      return {
        status: false,
        message: "failed to submit"
      }
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while(true){
      const { value , done} = await reader.read()
      const text = decoder.decode(value);
      setRes((prev)=> prev + text)
      if(done){
        break;
      }
    }

    setLoading(false);
      
  }
  return (
    <main className="w-full h-screen flex flex-col justify-center items-center">
       <div className="p-5 bg-blue-300 text-black w-[500px]">
        {res}
       </div>
       <form action={handleSubmit}>
        <input name="message" required className="p-2 w-[400px] text-black" type="text" />
        <button disabled={loading} className="p-2 w-[120px]">{loading ? "loading..." : "send"}</button>
       </form>
    </main>
  )
}