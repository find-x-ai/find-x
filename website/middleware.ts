import { NextResponse } from "next/server"
export async function middleware(req : Request){
    const res = NextResponse.next();
    const origin = req.headers.get('origin') as string;

    console.log("origin: " + origin);

    res.headers.set("Access-Control-Allow-Origin", origin)
    return res
}