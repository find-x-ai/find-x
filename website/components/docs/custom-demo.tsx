"use client"
import { toggleChatBox } from "find-x-ai";

export function CustomChatComponent(){
  return (
    <button className="py-2 px-4 bg-green-500 text-white rounded-md my-2" onClick={ ()=> toggleChatBox() }>
       Search here...
    </button>
  )
}