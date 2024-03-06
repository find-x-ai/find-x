"use client"
import { Menu , X } from "lucide-react";
import { useState } from "react";
export default function Ham() {
  const [isMenuOpen , setIsmenuOpen] = useState<boolean>(false);
  return (
    <div className=" transition-transform duration-500" onClick={()=> setIsmenuOpen(!isMenuOpen)}>
      { isMenuOpen ? <X className="text-white w-[35px] h-[35px]" /> :<Menu className="text-white w-[35px] h-[35px]" />}
    </div>
  );
}
