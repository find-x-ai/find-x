import next from "next";
import { NextRequest, NextResponse } from "next/server";

export default async function Middleware(req : NextRequest , res : NextResponse){
    req.headers.delete("origin")
    console.log("Mid ran")
}