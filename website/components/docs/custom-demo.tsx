"use client"
import { toggleChatBox } from "find-x-ai";

export function CustomChatComponent(){
  return (
    <button className="py-2 px-4 bg-zinc-800 text-white rounded-md my-2" onClick={ ()=> toggleChatBox() }>
       Search here...
    </button>
  )
}